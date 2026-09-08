from pydantic import BaseModel, EmailStr, Field

from users.models.enums import UserType


class InternalTestTokenRequest(BaseModel):
    user_key: str = Field(default="primary", min_length=1, max_length=64)
    email: EmailStr | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    profile_url: str | None = Field(default=None, max_length=2048)
    user_type: str = Field(default=UserType.REGULAR_USER.value, min_length=1, max_length=64)
    notes: str | None = Field(default=None, max_length=2000)
