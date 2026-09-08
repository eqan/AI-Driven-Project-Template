from ingestion.dtos.ingestion import Ingestion
from config.config import get_firecrawl_client, get_pinecone_index, get_voyage_client, settings
from ingestion.dtos.ingestion import WebsiteScrapeResult, SearchDTO
from prompts.load_prompt import load_prompt
import concurrent.futures
import json
import re
from fastapi import HTTPException
import ast
from utils.cache import get_cache_service

class IngestionService:
    def scrape_websites(self, ingestion: Ingestion) -> any:
        firecrawl_app = get_firecrawl_client()
        if firecrawl_app is None:
            raise HTTPException(status_code=503, detail="Firecrawl is not configured")

        batch_scrape_result = firecrawl_app.batch_scrape_urls(
            ingestion.relevant_links_to_be_scraped, formats=["markdown"]
        )

        # Convert to a plain dict if Firecrawl returns a Pydantic model (e.g., CrawlStatusResponse)
        if hasattr(batch_scrape_result, "model_dump"):
            batch_scrape_result = batch_scrape_result.model_dump()
        elif hasattr(batch_scrape_result, "dict"):
            batch_scrape_result = batch_scrape_result.dict()

        return batch_scrape_result
    
    def firecrawl_cleaner(self, ingestion: Ingestion, batch_scrape_result: any) -> [WebsiteScrapeResult]:
        cleaned_data = []
        data = batch_scrape_result.get('data', [])
        for result, url in zip(data, ingestion.relevant_links_to_be_scraped):
            # print(result)
            # Each `result` is a dict returned by Firecrawl for a single URL scrape
            # We only keep entries that contain markdown content.
            markdown = result.get('markdown')
            if not markdown:
                continue

            # Firecrawl nests most meta-tags under "metadata"
            metadata = result.get("metadata", {}) if isinstance(result, dict) else {}

            # Prefer OpenGraph tags, fall back to generic keys if missing
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
            
            url = (metadata.get("ogUrl") or metadata.get("url") or result.get("url", ""))

            cleaned_data.append(
                WebsiteScrapeResult(
                    url=url,
                    markdown=markdown,
                    description=description or "",
                    title=title or "",
                )
            )
        return cleaned_data

    def deep_seek_api_call(self, prompt: str):
            import requests

            url = "https://api.deepseek.com/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.reasoning_model_api_key}"
            }
            data = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": prompt},
                ],
                "stream": False
            }
            response = requests.post(url, headers=headers, json=data)
            return response.json()
    
    def generate_data_for_ingestion(self, list_of_data: [WebsiteScrapeResult], ingestion: Ingestion):
        generated_data = []
        print(list_of_data)
        def process_data(item: WebsiteScrapeResult):
            """Handle a single WebsiteScrapeResult (or compatible dict)."""
            # Allow both pydantic objects *and* plain dicts so the function is robust
            markdown = getattr(item, "markdown", None) or item.get("markdown")
            description = getattr(item, "description", None) or item.get("description", "")
            title = getattr(item, "title", None) or item.get("title", "")
            url = getattr(item, "url", None) or item.get("url", "")
            print("This was the item", item)

            prompt = load_prompt("data-generation-for-ingestion")
            prompt = prompt.replace("{markdown}", markdown or "")
            prompt = prompt.replace("{description}", description)
            prompt = prompt.replace("{title}", title)
            prompt = prompt.replace("{url}", url or "")
            # print("Prompt", prompt)

            response = self.deep_seek_api_call(prompt)
            # The model usually returns a JSON string. Remove any markdown code fences and parse it.
            content_str = response.get('choices')[0].get('message').get('content', "")
            print("Content",content_str)
            # Strip common markdown JSON fences if present
            if content_str.strip().startswith("```"):
                content_str = re.sub(r"^```[a-zA-Z]*\n|\n```$", "", content_str.strip())

            try:
                parsed = json.loads(content_str)
                parsed['source_url'] = url
                parsed['company_name'] = ingestion.company_name
                parsed['company_website'] = ingestion.company_website
                parsed['specific_metadata'] = json.dumps(parsed['specific_metadata'])
                print("Parsed", parsed)
                return parsed
            except json.JSONDecodeError as e:
                # Log & fall back to raw string to avoid crashing the whole ingestion pipeline
                print(f"[generate_data_for_ingestion] JSON decode error: {e}. Returning raw content.")
                return content_str

        results = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(process_data, list_of_data))
        print("Results", results)
        generated_data.extend(results)
        return generated_data

    def ingest_data(self, ingestion: Ingestion):
        batch_scrape_result = self.scrape_websites(ingestion)
        cleaned_data = self.firecrawl_cleaner(ingestion, batch_scrape_result)
        generated_data = self.generate_data_for_ingestion(cleaned_data, ingestion)
        # print("Generated Data", generated_data)
        data = self.embed_inputs(generated_data)
        return data
    
    def embed_inputs(self, array_of_data: [WebsiteScrapeResult]):
        data_for_pinecone = []
        for data in array_of_data:
            print("Data", data)
            url = getattr(data, "source_url", None) or data.get("source_url")
            title = getattr(data, "title", None) or data.get("title")
            section = getattr(data, "section", None) or data.get("section")
            content_type = getattr(data, "content_type", None) or data.get("content_type")
            summarized_content = getattr(data, "summarized_content", None) or data.get("summarized_content")
            _data = {
                "id": url,
                "values": self.embed_text(f"{title} {section} {content_type} {summarized_content}"),
                "metadata": data
            }
            # print("Data Value", _data)
            data_for_pinecone.append(_data)
        return data_for_pinecone

    def embed_text(self, text: str):
        """
        Returns a list of 1 embedding for the following input:
          1) Text
        """
        try:
          vo = get_voyage_client()
          if vo is None:
              raise HTTPException(status_code=503, detail="VoyageAI is not configured")
          embedding_inputs = [text]
          result = vo.embed(embedding_inputs, model=settings.embedding_model, input_type="query")
          embeddings = result.embeddings[0]
          return embeddings
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
            index = get_pinecone_index()
            if index is None:
                raise HTTPException(status_code=503, detail="Pinecone is not configured")
            index.upsert(
                vectors=data,
                namespace=settings.pinecone_index_name
            )
            return True
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_all_record_ids_from_pinecone(self) -> list:
        index = get_pinecone_index()
        if index is None:
            raise HTTPException(status_code=503, detail="Pinecone is not configured")
        ids_list = []
        for ids in index.list(namespace=settings.pinecone_index_name):
            for id in ids:
                ids_list.append(id)
        return ids_list

    def search_in_pinecone(self, search_dto: SearchDTO) -> dict:
        try:
            index = get_pinecone_index()
            if index is None:
                raise HTTPException(status_code=503, detail="Pinecone is not configured")

            cache = get_cache_service()
            cache_key = (
                f"pinecone-search:{search_dto.company_website}:"
                f"{search_dto.top_k}:{search_dto.query.strip().lower()}"
            )
            cached_result = cache.get_json(cache_key)
            if cached_result is not None:
                return cached_result

            print("I'm here at embedding")
            embedding = self.embed_text(search_dto.query)
            results = None
            if embedding:
                results = index.query(
                    namespace=settings.pinecone_index_name,
                    vector=embedding,
                    top_k=search_dto.top_k,
                    include_metadata=True,
                    filter={
                        "company_website": {"$eq": search_dto.company_website}
                    }
                )
            else:
               results = index.search(
                    namespace=settings.pinecone_index_name,
                    query={
                        "inputs":{
                                "text": search_dto.query,
                        },
                        "top_k": search_dto.top_k,
                        "filter": {
                                "company_website": search_dto.company_website
                        },
                        "include_metadata": True
                    }
                ) 
            # Convert the string to a Python dictionary:
            python_dict = ast.literal_eval(str(results))
            # Serialize the Python dictionary to JSON format:
            cache.set_json(
                cache_key,
                python_dict,
                ttl_seconds=settings.runtime.cache.search_ttl_seconds,
            )
            return python_dict
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


ingestion_service = IngestionService()
