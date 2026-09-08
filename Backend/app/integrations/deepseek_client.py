import requests

from fastapi import HTTPException

from config.settings import settings


class DeepSeekClient:
    def generate_completion(self, prompt: str) -> dict:
        if not settings.reasoning_model_api_key:
            raise HTTPException(status_code=503, detail="DeepSeek is not configured")

        response = requests.post(
            "https://api.deepseek.com/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.reasoning_model_api_key}",
            },
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "system", "content": prompt}],
                "stream": False,
            },
            timeout=60,
        )
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=f"DeepSeek error: {response.text}")
        return response.json()


deepseek_client = DeepSeekClient()
