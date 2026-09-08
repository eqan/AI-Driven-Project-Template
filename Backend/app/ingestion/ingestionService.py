import concurrent.futures
import json
import re

from fastapi import HTTPException

from config.settings import settings
from ingestion.dtos.ingestion import GeneratedIngestionRecord, Ingestion, SearchDTO, WebsiteScrapeResult
from integrations.deepseek_client import deepseek_client
from integrations.firecrawl_client import firecrawl_client
from integrations.pinecone_client import pinecone_client
from integrations.voyage_client import voyage_client
from prompts.load_prompt import load_prompt
from utils.cache import get_cache_service


class IngestionService:
    def __init__(self):
        self._ingestion_prompt = load_prompt("data-generation-for-ingestion")

    def scrape_websites(self, ingestion: Ingestion) -> dict:
        return firecrawl_client.batch_scrape_urls(
            ingestion.relevant_links_to_be_scraped,
            formats=["markdown"],
        )

    def firecrawl_cleaner(self, ingestion: Ingestion, batch_scrape_result: dict) -> list[WebsiteScrapeResult]:
        cleaned_data = []
        data = batch_scrape_result.get("data", [])
        for result in data:
            markdown = result.get("markdown")
            if not markdown:
                continue

            metadata = result.get("metadata", {}) if isinstance(result, dict) else {}
            description = (
                metadata.get("ogDescription")
                or metadata.get("description")
                or result.get("description", "")
            )
            title = (
                metadata.get("ogTitle")
                or metadata.get("title")
                or result.get("title", "")
            )
            url = metadata.get("ogUrl") or metadata.get("url") or result.get("url", "")

            cleaned_data.append(
                WebsiteScrapeResult(
                    url=url,
                    markdown=markdown,
                    description=description or "",
                    title=title or "",
                )
            )
        return cleaned_data

    def _build_generation_prompt(self, item: WebsiteScrapeResult) -> str:
        prompt = self._ingestion_prompt
        prompt = prompt.replace("{markdown}", item.markdown or "")
        prompt = prompt.replace("{description}", item.description)
        prompt = prompt.replace("{title}", item.title)
        prompt = prompt.replace("{url}", item.url or "")
        return prompt

    @staticmethod
    def _strip_json_fence(content: str) -> str:
        stripped = content.strip()
        if stripped.startswith("```"):
            return re.sub(r"^```[a-zA-Z]*\n|\n```$", "", stripped)
        return stripped

    def _parse_generated_record(self, content: str, ingestion: Ingestion, url: str) -> GeneratedIngestionRecord | None:
        cleaned_content = self._strip_json_fence(content)
        try:
            parsed = json.loads(cleaned_content)
            parsed["source_url"] = url
            parsed["company_name"] = ingestion.company_name
            parsed["company_website"] = ingestion.company_website
            return GeneratedIngestionRecord.model_validate(parsed)
        except Exception as e:
            print(f"[generate_data_for_ingestion] invalid generated payload for {url}: {e}")
            return None

    def generate_data_for_ingestion(self, list_of_data: list[WebsiteScrapeResult], ingestion: Ingestion) -> list[dict]:
        def process_data(item: WebsiteScrapeResult) -> dict | None:
            response = deepseek_client.generate_completion(self._build_generation_prompt(item))
            content_str = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            record = self._parse_generated_record(content_str, ingestion, item.url)
            if record is None:
                return None

            serialized = record.model_dump()
            serialized["specific_metadata"] = json.dumps(serialized["specific_metadata"])
            return serialized

        max_workers = min(4, max(1, len(list_of_data)))
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            results = list(executor.map(process_data, list_of_data))
        return [result for result in results if result is not None]

    def ingest_data(self, ingestion: Ingestion):
        batch_scrape_result = self.scrape_websites(ingestion)
        cleaned_data = self.firecrawl_cleaner(ingestion, batch_scrape_result)
        generated_data = self.generate_data_for_ingestion(cleaned_data, ingestion)
        return self.embed_inputs(generated_data)

    def embed_inputs(self, array_of_data: list[dict]) -> list[dict]:
        data_for_pinecone = []
        for data in array_of_data:
            url = data.get("source_url")
            title = data.get("title")
            section = data.get("section")
            content_type = data.get("content_type")
            summarized_content = data.get("summarized_content")
            vector = self.embed_text(f"{title} {section} {content_type} {summarized_content}")
            if not vector:
                continue
            data_for_pinecone.append(
                {
                    "id": url,
                    "values": vector,
                    "metadata": data,
                }
            )
        return data_for_pinecone

    def embed_text(self, text: str):
        try:
            return voyage_client.embed_text(text, input_type="query")
        except HTTPException:
            raise
        except Exception as e:
            print("Error in embedding model", str(e))
            return False

    def scrape_and_ingest_data(self, ingestion: Ingestion):
        generated_data = self.ingest_data(ingestion)
        if not generated_data:
            raise HTTPException(status_code=422, detail="No valid ingestion records were generated")
        self.upsert_in_pinecone(generated_data)
        return generated_data

    def upsert_in_pinecone(self, data: dict):
        try:
            return pinecone_client.upsert(data)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_all_record_ids_from_pinecone(self) -> list:
        return pinecone_client.list_ids()

    def search_in_pinecone(self, search_dto: SearchDTO) -> dict:
        try:
            cache = get_cache_service()
            cache_key = (
                f"pinecone-search:{search_dto.company_website}:"
                f"{search_dto.top_k}:{search_dto.query.strip().lower()}"
            )
            cached_result = cache.get_json(cache_key)
            if cached_result is not None:
                return cached_result

            embedding = self.embed_text(search_dto.query)
            if embedding:
                results = pinecone_client.query(
                    vector=embedding,
                    top_k=search_dto.top_k,
                    company_website=search_dto.company_website,
                )
            else:
                results = pinecone_client.search_by_text(
                    query=search_dto.query,
                    top_k=search_dto.top_k,
                    company_website=search_dto.company_website,
                )

            cache.set_json(
                cache_key,
                results,
                ttl_seconds=settings.runtime.cache.search_ttl_seconds,
            )
            return results
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


ingestion_service = IngestionService()
