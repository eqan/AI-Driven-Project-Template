import ast
import concurrent.futures
import json
import re

from fastapi import HTTPException

from config.settings import settings
from ingestion.dtos.ingestion import Ingestion, SearchDTO, WebsiteScrapeResult
from integrations.deepseek_client import deepseek_client
from integrations.firecrawl_client import firecrawl_client
from integrations.pinecone_client import pinecone_client
from integrations.voyage_client import voyage_client
from prompts.load_prompt import load_prompt
from utils.cache import get_cache_service


class IngestionService:
    def scrape_websites(self, ingestion: Ingestion) -> dict:
        return firecrawl_client.batch_scrape_urls(
            ingestion.relevant_links_to_be_scraped,
            formats=["markdown"],
        )

    def firecrawl_cleaner(self, ingestion: Ingestion, batch_scrape_result: any) -> list[WebsiteScrapeResult]:
        cleaned_data = []
        data = batch_scrape_result.get("data", [])
        for result, url in zip(data, ingestion.relevant_links_to_be_scraped):
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

    def generate_data_for_ingestion(self, list_of_data: list[WebsiteScrapeResult], ingestion: Ingestion):
        generated_data = []

        def process_data(item: WebsiteScrapeResult):
            markdown = getattr(item, "markdown", None) or item.get("markdown")
            description = getattr(item, "description", None) or item.get("description", "")
            title = getattr(item, "title", None) or item.get("title", "")
            url = getattr(item, "url", None) or item.get("url", "")

            prompt = load_prompt("data-generation-for-ingestion")
            prompt = prompt.replace("{markdown}", markdown or "")
            prompt = prompt.replace("{description}", description)
            prompt = prompt.replace("{title}", title)
            prompt = prompt.replace("{url}", url or "")

            response = deepseek_client.generate_completion(prompt)
            content_str = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            if content_str.strip().startswith("```"):
                content_str = re.sub(r"^```[a-zA-Z]*\n|\n```$", "", content_str.strip())

            try:
                parsed = json.loads(content_str)
                parsed["source_url"] = url
                parsed["company_name"] = ingestion.company_name
                parsed["company_website"] = ingestion.company_website
                parsed["specific_metadata"] = json.dumps(parsed["specific_metadata"])
                return parsed
            except json.JSONDecodeError as e:
                print(f"[generate_data_for_ingestion] JSON decode error: {e}. Returning raw content.")
                return content_str

        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(process_data, list_of_data))
        generated_data.extend(results)
        return generated_data

    def ingest_data(self, ingestion: Ingestion):
        batch_scrape_result = self.scrape_websites(ingestion)
        cleaned_data = self.firecrawl_cleaner(ingestion, batch_scrape_result)
        generated_data = self.generate_data_for_ingestion(cleaned_data, ingestion)
        return self.embed_inputs(generated_data)

    def embed_inputs(self, array_of_data: list[WebsiteScrapeResult]):
        data_for_pinecone = []
        for data in array_of_data:
            url = getattr(data, "source_url", None) or data.get("source_url")
            title = getattr(data, "title", None) or data.get("title")
            section = getattr(data, "section", None) or data.get("section")
            content_type = getattr(data, "content_type", None) or data.get("content_type")
            summarized_content = getattr(data, "summarized_content", None) or data.get("summarized_content")
            data_for_pinecone.append(
                {
                    "id": url,
                    "values": self.embed_text(f"{title} {section} {content_type} {summarized_content}"),
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

            python_dict = ast.literal_eval(str(results))
            cache.set_json(
                cache_key,
                python_dict,
                ttl_seconds=settings.runtime.cache.search_ttl_seconds,
            )
            return python_dict
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


ingestion_service = IngestionService()
