from fastapi import APIRouter, HTTPException, Depends
import httpx
from dependencies.internal import require_internal_service_secret
from dependencies.auth import require_authenticated_payload
from users.dtos.authCode import AuthCodePayload
from users.dtos.testAuth import InternalTestTokenRequest
from users.usersService import users_service

router = APIRouter()

@router.post("/google-login", tags=["Users"])
async def google_login(payload: AuthCodePayload):
    """
    This endpoint exchanges a Google authentication code for a token and user information.\n
    Body Parameters:
    - code: str
        The Google authentication code.
    """
    try:
        user_info = await users_service.exchange_auth_code_for_token(payload.code)
        return {"status": True, "message": "Google Authentication Successful!", "result": user_info}
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=400, detail="Google authentication failed")

@router.get("/verify-token", tags=["Users"])
async def verify_token_route(user_payload: dict = Depends(require_authenticated_payload)):
    """
    This endpoint verifies a JWT token and returns the user payload.\n
    Body Parameters:
    - token: str
        The JWT token to verify.
    """
    # If the token is valid, this route will return the user payload
    return {"status": True, "user": user_payload}


@router.post("/internal/testing/issue-token", tags=["Internal"], include_in_schema=False)
async def issue_internal_test_token(
    payload: InternalTestTokenRequest,
    _: None = Depends(require_internal_service_secret),
):
    """Issue or refresh a deterministic test token for automated test flows."""
    result = await users_service.issue_internal_test_token(payload)
    return {"status": True, "message": "Internal test token issued", "result": result}
