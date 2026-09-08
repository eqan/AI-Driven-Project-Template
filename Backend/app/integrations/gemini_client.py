import json

import aiohttp
import requests
from fastapi import HTTPException

from config.settings import settings


class GeminiClient:
    def __init__(self):
        self._base = (settings.model_api_base_url or "https://generativelanguage.googleapis.com/v1beta").rstrip("/")

    def _endpoint(self, model_name: str, action: str) -> str:
        return f"{self._base}/models/{model_name}:{action}?key={settings.model_api_key}"

    @staticmethod
    def google_search_tools() -> list[dict]:
        if settings.runtime.features.enable_google_search_grounding:
            return [{"googleSearch": {}}]
        return []

    def generate_content(self, model_name: str, payload: dict, timeout_seconds: int = 60) -> dict:
        response = requests.post(
            self._endpoint(model_name, "generateContent"),
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=timeout_seconds,
        )
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=f"Upstream LLM error: {response.text}")
        return response.json()

    async def generate_content_async(self, model_name: str, payload: dict, timeout_seconds: int = 30) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self._endpoint(model_name, "generateContent"),
                json=payload,
                timeout=aiohttp.ClientTimeout(total=timeout_seconds),
            ) as response:
                if response.status != 200:
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"Intent classification error: {await response.text()}",
                    )
                return await response.json()

    async def stream_generate_content(self, model_name: str, payload: dict, timeout_seconds: int = 120):
        endpoint = self._endpoint(model_name, "streamGenerateContent").replace(":streamGenerateContent?", ":streamGenerateContent?alt=sse&")

        async with aiohttp.ClientSession() as session:
            async with session.post(
                endpoint,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=timeout_seconds),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"LLM streaming error: {error_text}",
                    )

                async for raw_line in response.content:
                    line_str = raw_line.decode("utf-8").strip()
                    if not line_str.startswith("data: "):
                        continue

                    json_str = line_str[6:]
                    if json_str == "[DONE]":
                        break

                    try:
                        yield json.loads(json_str)
                    except json.JSONDecodeError:
                        continue


gemini_client = GeminiClient()
