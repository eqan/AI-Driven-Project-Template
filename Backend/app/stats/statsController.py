from fastapi import APIRouter, Depends
from stats.statsService import stats_service
from fastapi import Request
from config.config import limiter
from config.settings import settings
from dependencies.auth import require_authenticated_user_id

router = APIRouter()
@router.post("/stats", tags=["Stats"])
@limiter.limit(settings.runtime.rate_limits.stats)
async def generate_stats_endpoint(request: Request, user_id: int = Depends(require_authenticated_user_id)):
    """
    This endpoint generates stats for a user.\n
    Body Parameters:
    - token: str
        The token for authentication.
    """
    return await stats_service.generate_stats(user_id)

@router.get("/stats", tags=["Stats"])
@limiter.limit(settings.runtime.rate_limits.stats)
async def get_stats_endpoint(request: Request, user_id: int = Depends(require_authenticated_user_id)):
    """
    This endpoint gets stats for a user.\n
    Body Parameters:
    - token: str
        The token for authentication.
    """
    return await stats_service.get_stats(user_id)
