"""채팅 SSE 엔드포인트.

POST /api/chat — {"message": ..., "session_id": ...} 로 질문하면
text/event-stream 으로 JSON 이벤트를 흘려보낸다:
- {"type": "sources", "grounds": [...]} — 답변 생성 전 검색된 근거 청크
- {"type": "status", "message": ...} — 모델 혼잡 재시도 등 진행 상태 안내
- {"type": "chunk", "text": ...} — 어시스턴트 답변 조각
- {"type": "done"} / {"type": "error", "message": ...}

무료 티어 모델은 혼잡(429 code 1305)·분당 제한(1302)이 잦아, 첫 조각이 나오기 전에
그런 오류가 나면 백오프 후 재시도한다. 동기 제너레이터를 그대로 반환하면 Starlette가
스레드풀에서 소비해 이벤트 루프를 막지 않는다.
"""

import json
import time
from collections.abc import Iterator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.agent import DolmenConfigError, dolmen_agent_service
from app.rag import RetrievedGround, dolmen_rag_service
from app.settings import missing_llm_env_names

router = APIRouter(tags=["chat"])

RETRIEVED_GROUNDS_LIMIT = 5
TRANSIENT_LLM_ERROR_MARKERS = ("1305", "1302", "overloaded", "rate limit")
RETRY_BACKOFF_SECONDS = (4, 8, 16)


class ChatRequestBody(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str = Field(min_length=1, max_length=200)


def format_sse_event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def is_transient_llm_error(error: Exception) -> bool:
    error_text = str(error).lower()
    return any(marker in error_text for marker in TRANSIENT_LLM_ERROR_MARKERS)


def serialize_ground_for_screen(ground: RetrievedGround) -> dict:
    """화면에는 발췌(snippet)만 보내고 프롬프트용 원문(content)은 제외한다."""
    return {
        "chunk_id": ground.chunk_id,
        "source": ground.source,
        "version": ground.version,
        "score": ground.score,
        "snippet": ground.snippet,
    }


@router.get("/health")
async def read_health() -> dict:
    missing_env_names = missing_llm_env_names()
    return {
        "status": "ok",
        "llm_configured": len(missing_env_names) == 0,
        "missing_llm_env": missing_env_names,
    }


@router.post("/chat")
async def stream_chat_reply(chat_request_body: ChatRequestBody) -> StreamingResponse:
    def generate_reply_events() -> Iterator[str]:
        try:
            agent_service = dolmen_agent_service()
        except DolmenConfigError as error:
            yield format_sse_event({"type": "error", "message": str(error)})
            return

        retrieved_grounds: list[RetrievedGround] = []
        try:
            rag_service = dolmen_rag_service()
            rag_service.ensure_demo_document_ingested()
            retrieved_grounds = rag_service.search_grounds(
                query=chat_request_body.message, limit=RETRIEVED_GROUNDS_LIMIT
            )
        except Exception:  # noqa: BLE001 — 근거 검색 실패는 답변 스트림을 막지 않는다
            retrieved_grounds = []
        if retrieved_grounds:
            yield format_sse_event(
                {
                    "type": "sources",
                    "grounds": [serialize_ground_for_screen(g) for g in retrieved_grounds],
                }
            )

        max_attempt_count = len(RETRY_BACKOFF_SECONDS) + 1
        for attempt_index in range(max_attempt_count):
            if attempt_index > 0:
                backoff_seconds = RETRY_BACKOFF_SECONDS[attempt_index - 1]
                yield format_sse_event(
                    {
                        "type": "status",
                        "message": (
                            f"모델이 혼잡해 {backoff_seconds}초 후 다시 시도합니다 "
                            f"({attempt_index}/{len(RETRY_BACKOFF_SECONDS)})"
                        ),
                    }
                )
                time.sleep(backoff_seconds)

            has_emitted_chunk = False
            try:
                for reply_chunk in agent_service.stream_assistant_reply(
                    chat_request_body.session_id,
                    chat_request_body.message,
                    retrieved_grounds,
                ):
                    has_emitted_chunk = True
                    yield format_sse_event({"type": "chunk", "text": reply_chunk})
            except Exception as error:  # noqa: BLE001 — 스트림 오류를 화면에 그대로 알려야 한다
                is_last_attempt = attempt_index == max_attempt_count - 1
                if has_emitted_chunk or not is_transient_llm_error(error) or is_last_attempt:
                    yield format_sse_event({"type": "error", "message": f"답변 생성 실패: {error}"})
                    return
                continue
            yield format_sse_event({"type": "done"})
            return

    return StreamingResponse(
        generate_reply_events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
