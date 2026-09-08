from fastapi import HTTPException

from config.config import get_firecrawl_client


class FirecrawlClient:
    def batch_scrape_urls(self, urls: list[str], formats: list[str]) -> dict:
        client = get_firecrawl_client()
        if client is None:
            raise HTTPException(status_code=503, detail="Firecrawl is not configured")

        result = client.batch_scrape_urls(urls, formats=formats)
        if hasattr(result, "model_dump"):
            return result.model_dump()
        if hasattr(result, "dict"):
            return result.dict()
        return result


firecrawl_client = FirecrawlClient()
