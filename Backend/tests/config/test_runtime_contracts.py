import importlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "app"))

from config.settings import RuntimeSettings, Settings


def test_runtime_server_env_overrides_json_defaults(tmp_path, monkeypatch):
    runtime_config = {
        "server": {
            "host": "10.0.0.5",
            "port": 9999,
            "reload": False,
            "workers": 8,
            "timeout_keep_alive": 300,
        }
    }
    runtime_path = tmp_path / "runtime.json"
    runtime_path.write_text(json.dumps(runtime_config), encoding="utf-8")

    monkeypatch.setenv("HOST", "127.0.0.1")
    monkeypatch.setenv("PORT", "8010")
    monkeypatch.setenv("RELOAD", "true")
    monkeypatch.setenv("WORKERS", "2")
    monkeypatch.setenv("TIMEOUT_KEEP_ALIVE", "45")

    settings = Settings(
        db_user="postgres",
        db_name="interfaze",
        secret_key="test-secret",
        runtime_config_path=str(runtime_path),
    )

    assert settings.runtime.server.host == "127.0.0.1"
    assert settings.runtime.server.port == 8010
    assert settings.runtime.server.reload is True
    assert settings.runtime.server.workers == 2
    assert settings.runtime.server.timeout_keep_alive == 45


def test_create_app_omits_disabled_routes(monkeypatch):
    app_module = importlib.import_module("app")
    runtime = RuntimeSettings()
    runtime.features.enable_stats = False
    runtime.features.enable_ticketing = False
    runtime.features.enable_ingestion = False
    runtime.features.enable_sentry = False

    monkeypatch.setattr(app_module.settings, "runtime", runtime, raising=False)
    application = app_module.create_app()
    paths = {route.path for route in application.routes}

    assert "/stats" not in paths
    assert "/ticket/{uuid}" not in paths
    assert "/tickets" not in paths
    assert "/ingestion/scrape-website" not in paths
    assert "/ingestion/search" not in paths
    assert "/sentry-debug" not in paths


def test_google_search_tools_follow_feature_flag(monkeypatch):
    gemini_module = importlib.import_module("integrations.gemini_client")
    runtime = RuntimeSettings()
    runtime.features.enable_google_search_grounding = False

    monkeypatch.setattr(gemini_module.settings, "runtime", runtime, raising=False)
    assert gemini_module.gemini_client.google_search_tools() == []

    runtime.features.enable_google_search_grounding = True
    monkeypatch.setattr(gemini_module.settings, "runtime", runtime, raising=False)
    assert gemini_module.gemini_client.google_search_tools() == [{"googleSearch": {}}]
