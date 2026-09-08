from fastapi import HTTPException

from config.config import get_pinecone_index
from config.settings import settings


class PineconeClient:
    def upsert(self, vectors: list[dict]) -> bool:
        index = self._require_index()
        index.upsert(vectors=vectors, namespace=settings.pinecone_index_name)
        return True

    def list_ids(self) -> list[str]:
        index = self._require_index()
        ids_list: list[str] = []
        for ids in index.list(namespace=settings.pinecone_index_name):
            for vector_id in ids:
                ids_list.append(vector_id)
        return ids_list

    def query(self, vector: list[float], top_k: int, company_website: str):
        index = self._require_index()
        return index.query(
            namespace=settings.pinecone_index_name,
            vector=vector,
            top_k=top_k,
            include_metadata=True,
            filter={"company_website": {"$eq": company_website}},
        )

    def search_by_text(self, query: str, top_k: int, company_website: str):
        index = self._require_index()
        return index.search(
            namespace=settings.pinecone_index_name,
            query={
                "inputs": {"text": query},
                "top_k": top_k,
                "filter": {"company_website": company_website},
                "include_metadata": True,
            },
        )

    @staticmethod
    def _require_index():
        index = get_pinecone_index()
        if index is None:
            raise HTTPException(status_code=503, detail="Pinecone is not configured")
        return index


pinecone_client = PineconeClient()
