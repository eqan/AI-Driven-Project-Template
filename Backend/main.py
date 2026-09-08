import uvicorn
from app.config.settings import settings

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
