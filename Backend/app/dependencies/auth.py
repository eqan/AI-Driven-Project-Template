from fastapi import HTTPException, Request

from users.usersService import users_service


async def require_authenticated_payload(request: Request) -> dict:
    return await users_service.verify_jwt_token(request)


async def require_authenticated_user_id(request: Request) -> int:
    user_id = await users_service.verify_jwt_token_for_chatbot(request)
    if user_id is None:
        raise HTTPException(status_code=400, detail="User is blacklisted")
    return user_id
