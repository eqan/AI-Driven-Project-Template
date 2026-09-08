from fastapi import HTTPException

from config.config import get_voyage_client
from config.settings import settings


class VoyageClient:
    def embed_text(self, text: str, input_type: str = "query") -> list[float]:
        client = get_voyage_client()
        if client is None:
            raise HTTPException(status_code=503, detail="VoyageAI is not configured")

        result = client.embed([text], model=settings.embedding_model, input_type=input_type)
        return result.embeddings[0]


voyage_client = VoyageClient()
