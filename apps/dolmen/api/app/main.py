"""dolmen-api 진입점. uvicorn app.main:app --port 3012 로 실행한다."""

from fastapi import FastAPI

from app.routes import chat, documents


def create_app() -> FastAPI:
    application = FastAPI(title="dolmen-api", version="0.1.0")
    application.include_router(chat.router, prefix="/api")
    application.include_router(documents.router, prefix="/api")
    return application


app = create_app()
