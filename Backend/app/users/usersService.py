from datetime import datetime, timedelta

import httpx
import jwt
from fastapi import HTTPException, Request
from sqlalchemy.exc import SQLAlchemyError

from config.settings import settings
from database import session_scope
from users.dtos.schemas import UserCreate
from users.models.enums import UserType
from users.models.user import User


class UsersService:
    """Service class that encapsulates all user-related business logic."""

    def __init__(self):
        self.SECRET_KEY = settings.secret_key
        self.ALGORITHM = settings.algorithm
        self.ACCESS_TOKEN_EXPIRE_DAYS = settings.access_token_expire_days

    async def exchange_auth_code_for_token(self, auth_code: str):
        try:
            params = {"id_token": auth_code}
            async with httpx.AsyncClient() as client:
                response = await client.get(settings.google_oauth_url, params=params)
                response.raise_for_status()
                user_info = response.json()

            token_data = {
                "sub": user_info["sub"],
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info["picture"],
                "exp": datetime.utcnow() + timedelta(days=self.ACCESS_TOKEN_EXPIRE_DAYS),
            }

            user = await self.get_user(token_data["email"])
            if user is None:
                await self.create_user(
                    UserCreate(
                        email=token_data["email"],
                        name=token_data["name"],
                        profile_url=token_data["picture"],
                        type=UserType.REGULAR_USER.value,
                        last_time_service_used=datetime.now(),
                        blackListed=False,
                        notes=None,
                    )
                )
            else:
                await self.update_last_time_service_used(token_data["email"])

            token = jwt.encode(token_data, self.SECRET_KEY, algorithm=self.ALGORITHM)
            user_info["token"] = token
            return {"token": token, "user_info": user_info}
        except Exception as e:
            print("This is the error", e)
            raise HTTPException(status_code=500, detail=str(e))

    async def verify_jwt_token_for_chatbot(self, request: Request):
        token = self._extract_bearer_token(request, missing_detail="Missing authentication token")

        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            user = await self.get_user(payload.get("email"))
            if user is None:
                raise HTTPException(status_code=401, detail="Token verification failed")
            if user.blackListed:
                return None
            print(f"Token verified for user: {user.email}")
            return user.id
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=401, detail="Token verification failed")

    async def verify_jwt_token(self, request: Request):
        token = self._extract_bearer_token(request, missing_detail="Unauthorized")

        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            request.state.user = payload
            user = await self.get_user(payload["email"])

            if user is not None:
                await self.update_last_time_service_used(payload["email"])
            else:
                return None

            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))

    async def create_user(self, user: UserCreate):
        try:
            data = user.model_dump() if hasattr(user, "model_dump") else user.dict()
            db_user = User(**data)
            with session_scope() as session:
                session.add(db_user)
                session.flush()
                session.refresh(db_user)
            return db_user
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def blacklist_user(self, user_email: str):
        try:
            with session_scope() as session:
                db_user = session.query(User).filter(User.email == user_email).first()
                if db_user:
                    db_user.blackListed = True
                    session.flush()
                    session.refresh(db_user)
                    return db_user
                print(f"User not found for email: {user_email}")
                return None
        except SQLAlchemyError as e:
            print(f"SQL error in blacklist_user: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            print(f"Unexpected error in blacklist_user: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def get_user(self, user_email: str):
        try:
            with session_scope() as session:
                return session.query(User).filter(User.email == user_email).first()
        except SQLAlchemyError as e:
            print(f"SQL error in get_user: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            print(f"Unexpected error in get_user: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def update_last_time_service_used(self, user_email: str):
        try:
            with session_scope() as session:
                db_user = session.query(User).filter(User.email == user_email).first()
                if db_user:
                    db_user.last_time_service_used = datetime.now()
                    session.flush()
                    session.refresh(db_user)
                    return db_user
                print(f"User not found for email: {user_email}")
                return None
        except SQLAlchemyError as e:
            print(f"SQL error in update_last_time_service_used: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            print(f"Unexpected error in update_last_time_service_used: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def _extract_bearer_token(request: Request, missing_detail: str) -> str:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail=missing_detail)
        return auth_header.split(" ", 1)[1]


users_service = UsersService()
