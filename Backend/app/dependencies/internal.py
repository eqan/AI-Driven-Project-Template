from fastapi import Header, HTTPException

from config.settings import settings


def require_internal_service_secret(
    x_internal_service_secret: str | None = Header(default=None),
) -> None:
    """Guard internal-only routes behind an explicit shared secret."""
    if not settings.enable_internal_test_auth:
        raise HTTPException(status_code=404, detail="Not found")

    if not settings.internal_service_secret:
        raise HTTPException(status_code=503, detail="Internal service secret is not configured")

    if x_internal_service_secret != settings.internal_service_secret:
        raise HTTPException(status_code=401, detail="Unauthorized internal request")
