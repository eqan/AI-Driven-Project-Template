import sys
from pathlib import Path

import uvicorn

APP_DIR = Path(__file__).resolve().parent / "app"
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

from config.settings import settings

if __name__ == "__main__":
    runtime_server = settings.runtime.server
    workers = 1 if runtime_server.reload else runtime_server.workers
    uvicorn.run(
        "app:app",
        app_dir="app",
        host=runtime_server.host,
        port=runtime_server.port,
        reload=runtime_server.reload,
        workers=workers,
        timeout_keep_alive=runtime_server.timeout_keep_alive,
    )
