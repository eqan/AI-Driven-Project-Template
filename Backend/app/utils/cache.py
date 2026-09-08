import json
import threading
import time
from functools import lru_cache

from config.settings import settings


class InMemoryTTLCache:
    def __init__(self):
        self._store: dict[str, tuple[float, str]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> str | None:
        with self._lock:
            cached = self._store.get(key)
            if cached is None:
                return None

            expires_at, value = cached
            if expires_at < time.time():
                self._store.pop(key, None)
                return None
            return value

    def set(self, key: str, value: str, ttl_seconds: int) -> None:
        with self._lock:
            self._store[key] = (time.time() + ttl_seconds, value)


class RedisTTLCache:
    def __init__(self, redis_url: str):
        if not redis_url:
            raise ValueError("Missing redis_url for Redis cache backend")

        import redis

        self._client = redis.Redis.from_url(redis_url, decode_responses=True)

    def get(self, key: str) -> str | None:
        return self._client.get(key)

    def set(self, key: str, value: str, ttl_seconds: int) -> None:
        self._client.set(name=key, value=value, ex=ttl_seconds)


class CacheService:
    def __init__(self, backend):
        self._backend = backend
        self._namespace = settings.runtime.cache.namespace

    def _key(self, key: str) -> str:
        return f"{self._namespace}:{key}"

    def get_json(self, key: str):
        raw_value = self._backend.get(self._key(key))
        if raw_value is None:
            return None
        return json.loads(raw_value)

    def set_json(self, key: str, value, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds or settings.runtime.cache.default_ttl_seconds
        self._backend.set(self._key(key), json.dumps(value), ttl)


@lru_cache(maxsize=1)
def get_cache_service() -> CacheService:
    cache_settings = settings.runtime.cache
    backend_name = cache_settings.backend.lower()

    if backend_name == "redis":
        try:
            return CacheService(RedisTTLCache(cache_settings.redis_url))
        except Exception:
            pass

    return CacheService(InMemoryTTLCache())
