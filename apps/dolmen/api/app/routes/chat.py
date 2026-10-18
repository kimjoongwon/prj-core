"""채팅 SSE 엔드포인트.

POST /api/chat — {"message": ..., "session_id": ...} 로 질문하면
text/event-stream 으로 {"type": "chunk"|"done"|"error"} JSON 이벤트를 흘려보낸다.
동기 제너레이터를 그대로 반환하면 Starlette가 스레드풀에서 소비해 이벤트 루프를 막지 않는다.
"""

import json
from collections.abc import Iterator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.agent import DolmenConfigError, dolmen_agent_service
from app.settings import missing_llm_env_names

router = APIRouter(tags=["chat"])


class ChatRequestBody(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str = Field(min_length=1, max_length=200)


def format_sse_event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


@router.get("/health")
async def read_health() -> dict:
    return {
        "status": "ok",
        "llm_configured": len(missing_llm_env_names()) == 0,
        "missing_llm_env": missing_llm_env_names(),
    }


@router.post("/chat")
async def stream_chat_reply(chat_request_body: ChatRequestBody) -> StreamingResponse:
    def generate_reply_events() -> Iterator[str]:
        try:
            agent_service = dolmen_agent_service()
        except DolmenConfigError as error:
            yield format_sse_event({"type": "error", "message": str(error)})
            return

        try:
            for reply_chunk in agent_service.stream_assistant_reply(
                chat_request_body.session_id,
                chat_request_body.message,
            ):
                yield format_sse_event({"type": "chunk", "text": reply_chunk})
        except Exception as error:  # noqa: BLE001 — 스트림 오류를 화면에 그대로 알려야 한다
            yield format_sse_event({"type": "error", "message": f"답변 생성 실패: {error}"})
            return
        yield format_sse_event({"type": "done"})

    return StreamingResponse(
        generate_reply_events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
