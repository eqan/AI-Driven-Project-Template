"""
Authentication helper for backend template tests.
Provides utilities for JWT token management, refresh, and authenticated requests.
"""
import json
import os
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Optional

import httpx
import jwt
import requests
from pydantic import EmailStr, TypeAdapter, ValidationError

from tests.config.test_config import config

TEST_CONFIG_DIR = Path(__file__).parent.parent / "config"
PERSISTENT_USERS_TEMPLATE_FILE = TEST_CONFIG_DIR / "persistent-users.json"
PERSISTENT_USERS_FILE = TEST_CONFIG_DIR / "persistent-users.local.json"
INTERNAL_AUTH_HEADER = "X-Internal-Service-Secret"
EMAIL_ADAPTER = TypeAdapter(EmailStr)


def load_persistent_users() -> Dict:
    ensure_local_persistent_users_file()
    if not PERSISTENT_USERS_FILE.exists():
        raise FileNotFoundError(f"Persistent users file not found: {PERSISTENT_USERS_FILE}")
    with open(PERSISTENT_USERS_FILE, 'r') as f:
        return json.load(f)


def save_persistent_users(users_config: Dict) -> None:
    ensure_local_persistent_users_file()
    with open(PERSISTENT_USERS_FILE, 'w') as f:
        json.dump(users_config, f, indent=2)


def ensure_local_persistent_users_file() -> None:
    if PERSISTENT_USERS_FILE.exists():
        return

    if PERSISTENT_USERS_TEMPLATE_FILE.exists():
        shutil.copyfile(PERSISTENT_USERS_TEMPLATE_FILE, PERSISTENT_USERS_FILE)


def get_test_user(user_type: str = "primary") -> Dict:
    users_config = load_persistent_users()
    if user_type not in users_config["users"]:
        raise ValueError(f"Unknown user type: {user_type}. Available: {list(users_config['users'].keys())}")
    return users_config["users"][user_type]


def get_auth_headers(token: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def get_auth_token_for_tests(user_type: str = "primary") -> str:
    user = get_test_user(user_type)
    token = user.get("token", "")
    if config.can_auto_refresh_tokens():
        if not token or token_expires_soon(token):
            return refresh_persistent_test_token(user_type)
    if not token:
        raise ValueError(
            f"No token set for user '{user_type}'. "
            f"Configure TEST_AUTH_AUTO_REFRESH/TEST_AUTH_SHARED_SECRET or set a token in persistent-users.json"
        )
    return token


def token_expires_soon(token: str) -> bool:
    try:
        payload = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
        exp = payload.get("exp")
        if not exp:
            return False

        expires_at = datetime.fromtimestamp(exp, tz=timezone.utc)
        refresh_deadline = datetime.now(timezone.utc) + timedelta(
            seconds=config.test_auth_refresh_buffer_seconds
        )
        return expires_at <= refresh_deadline
    except Exception:
        return True


def refresh_persistent_test_token(user_type: str = "primary") -> str:
    if not config.can_auto_refresh_tokens():
        raise ValueError(
            "Automatic token refresh is not configured. "
            "Set TEST_AUTH_AUTO_REFRESH=true and TEST_AUTH_SHARED_SECRET."
        )

    users_config = load_persistent_users()
    user = users_config["users"].get(user_type)
    if user is None:
        raise ValueError(f"Unknown user type: {user_type}")

    email = user.get("email") or None
    if email and not is_valid_refresh_email(email):
        email = None

    payload = {
        "user_key": user_type,
        "email": email,
        "name": user.get("full_name") or None,
    }

    try:
        response = requests.post(
            f"{get_api_url()}{config.test_auth_refresh_endpoint}",
            json=payload,
            headers={
                INTERNAL_AUTH_HEADER: config.test_auth_shared_secret,
                "Content-Type": "application/json",
            },
            timeout=config.test_auth_refresh_timeout,
        )
    except requests.RequestException as exc:
        raise ValueError(f"Unable to refresh token for '{user_type}': {exc}") from exc

    try:
        body = response.json()
    except ValueError as exc:
        snippet = response.text.strip()
        if len(snippet) > 300:
            snippet = f"{snippet[:300]}..."
        raise ValueError(
            f"Unable to refresh token for '{user_type}': non-JSON response ({response.status_code}) {snippet}"
        ) from exc

    if response.status_code != 200:
        detail = body.get("detail") if isinstance(body, dict) else body
        raise ValueError(
            f"Unable to refresh token for '{user_type}': {response.status_code} {detail}"
        )

    result = body.get("result", {})
    token = result.get("token", "")
    issued_user = result.get("user", {})
    if not token:
        raise ValueError(f"Unable to refresh token for '{user_type}': missing token in response")

    user["token"] = token
    user["email"] = issued_user.get("email") or user.get("email", "")
    user["full_name"] = issued_user.get("name") or user.get("full_name", "")
    users_config["lastUpdated"] = datetime.now(timezone.utc).isoformat()
    users_config["setupComplete"] = bool(users_config["users"].get("primary", {}).get("token"))
    save_persistent_users(users_config)
    return token


def refresh_configured_test_tokens(user_types: Optional[list[str]] = None) -> Dict[str, str]:
    users_config = load_persistent_users()
    selected_user_types = user_types or list(users_config["users"].keys())
    refreshed_tokens: Dict[str, str] = {}

    for user_type in selected_user_types:
        refreshed_tokens[user_type] = refresh_persistent_test_token(user_type)

    return refreshed_tokens


def is_valid_refresh_email(email: str) -> bool:
    try:
        EMAIL_ADAPTER.validate_python(email)
        return True
    except (ValidationError, ValueError):
        return False


class AuthenticatedClient:
    """HTTP client with automatic JWT authentication for chatbot widget API."""

    def __init__(self, token: str, base_url: str = "http://localhost:8000"):
        self.token = token
        self.base_url = base_url
        self.headers = get_auth_headers(token)

    async def post(self, endpoint: str, json_data: Dict = None, **kwargs) -> httpx.Response:
        """Make authenticated POST request. Token is sent via Authorization header."""
        async with httpx.AsyncClient(verify=False, timeout=30.0) as client:
            url = f"{self.base_url}{endpoint}"
            return await client.post(url, json=json_data, headers=self.headers, **kwargs)

    async def get(self, endpoint: str, **kwargs) -> httpx.Response:
        async with httpx.AsyncClient(verify=False, timeout=30.0) as client:
            url = f"{self.base_url}{endpoint}"
            return await client.get(url, headers=self.headers, **kwargs)

    async def put(self, endpoint: str, json_data: Dict = None, **kwargs) -> httpx.Response:
        async with httpx.AsyncClient(verify=False, timeout=30.0) as client:
            url = f"{self.base_url}{endpoint}"
            return await client.put(url, json=json_data, headers=self.headers, **kwargs)


def get_primary_user_token() -> str:
    return get_auth_token_for_tests("primary")


def get_secondary_user_token() -> str:
    return get_auth_token_for_tests("secondary")


def get_api_url() -> str:
    return os.getenv("API_BASE_URL") or "http://localhost:8000"
