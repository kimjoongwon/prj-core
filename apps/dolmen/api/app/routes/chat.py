"""채팅 SSE 엔드포인트.

POST /api/chat — {"message": ..., "session_id": ...} 로 질문하면
text/event-stream 으로 JSON 이벤트를 흘려보낸다:
- {"type": "sources", "grounds": [...]} — 답변 생성 전 검색된 근거 청크
- {"type": "status", "message": ...} — 모델 혼잡 재시도 등 진행 상태 안내
- {"type": "chunk", "text": ...} — 어시스턴트 답변 조각
- {"type": "done"} / {"type": "error", "message": ...}
- {"type": "debug", ...} — 개발 설정이 활성화된 경우 허용된 실행 정보만 추가

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

from app.agent import (
    DolmenConfigError,
    DolmenEmptyReplyError,
    dolmen_agent_service,
    select_answer_path,
)
from app.debug import ChatDebugTrace, safe_error_details
from app.rag import RetrievedGround, dolmen_rag_service
from app.resume import ResumeUnavailableError
from app.settings import RETRIEVED_GROUNDS_LIMIT, missing_llm_env_names

router = APIRouter(tags=["chat"])

TRANSIENT_LLM_ERROR_MARKERS = ("1305", "1302", "overloaded", "rate limit")
RETRY_BACKOFF_SECONDS = (4, 8, 16)


class ChatRequestBody(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str = Field(min_length=1, max_length=200)


def format_sse_event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def is_transient_llm_error(error: Exception) -> bool:
    try:
        if safe_error_details(error)["error_category"] in {"rate_limit", "overloaded"}:
            return True
        error_text = str(error).lower()
        return any(marker in error_text for marker in TRANSIENT_LLM_ERROR_MARKERS)
    except Exception:
        return False


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
            trace = ChatDebugTrace()
        except Exception:
            trace = None

        def emit_debug(event: str, **details) -> tuple[str, ...]:
            try:
                return trace.emit(event, **details) if trace is not None else ()
            except Exception:
                return ()
        yield from emit_debug("request_received")
        yield from emit_debug("retrieval_started", retrieval_limit=RETRIEVED_GROUNDS_LIMIT)
        try:
            reply_context = dolmen_rag_service().retrieve_reply_context(
                query=chat_request_body.message, limit=RETRIEVED_GROUNDS_LIMIT
            )
        except ResumeUnavailableError as error:
            yield from emit_debug(
                "reply_failed", stage="retrieval", attempt=0, reason=error.code,
                error_category="unknown",
            )
            yield format_sse_event({"type": "error", "message": error.message})
            return
        except Exception:
            yield from emit_debug(
                "reply_failed", stage="retrieval", attempt=0, reason="resume_not_ready",
                error_category="unknown",
            )
            yield format_sse_event(
                {"type": "error", "message": "등록 이력서 검색에 실패했습니다. 다시 질문해 주세요."}
            )
            return

        yield from emit_debug(
            "context_ready", revision=reply_context.revision,
            page_count=len(reply_context.resume_pages),
            context_characters=sum(len(page.text) for page in reply_context.resume_pages),
            retrieved_count=len(reply_context.grounds), retrieval_limit=RETRIEVED_GROUNDS_LIMIT,
        )
        answer_path = select_answer_path(chat_request_body.message, reply_context.grounds)

        try:
            agent_service = dolmen_agent_service()
        except DolmenConfigError:
            yield from emit_debug(
                "reply_failed", stage="configuration", attempt=0, reason="llm_not_configured",
                answer_path=answer_path, error_category="unknown",
            )
            yield format_sse_event(
                {
                    "type": "error",
                    "message": "LLM 연결 설정이 준비되지 않았습니다. 서버 설정을 확인해 주세요.",
                }
            )
            return
        except Exception as error:
            yield from emit_debug(
                "reply_failed", stage="configuration", attempt=0,
                reason="model_initialization_failed", answer_path=answer_path,
                **safe_error_details(error),
            )
            yield format_sse_event(
                {"type": "error", "message": "모델 연결을 준비하지 못했습니다. 다시 질문해 주세요."}
            )
            return

        retrieved_grounds = reply_context.grounds
        if retrieved_grounds:
            yield format_sse_event(
                {
                    "type": "sources",
                    "grounds": [serialize_ground_for_screen(g) for g in retrieved_grounds],
                }
            )

        max_attempt_count = len(RETRY_BACKOFF_SECONDS) + 1
        reply_character_count = 0
        has_emitted_first_chunk = False
        previous_error_details = {"error_category": "unknown"}
        for attempt_index in range(max_attempt_count):
            if attempt_index > 0:
                backoff_seconds = RETRY_BACKOFF_SECONDS[attempt_index - 1]
                yield from emit_debug(
                    "retry_scheduled", attempt=attempt_index, next_attempt=attempt_index + 1,
                    backoff_seconds=backoff_seconds, **previous_error_details,
                )
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
            yield from emit_debug(
                "reply_attempt", attempt=attempt_index + 1, answer_path=answer_path,
            )
            try:
                for reply_chunk in agent_service.stream_assistant_reply(
                    chat_request_body.session_id,
                    chat_request_body.message,
                    retrieved_grounds,
                    reply_context.resume_settings,
                    reply_context.revision,
                    reply_context.resume_pages,
                ):
                    if not reply_chunk:
                        continue
                    if not has_emitted_first_chunk:
                        yield from emit_debug(
                            "first_chunk", attempt=attempt_index + 1, answer_path=answer_path,
                            chunk_characters=len(reply_chunk),
                        )
                        has_emitted_first_chunk = True
                    has_emitted_chunk = True
                    reply_character_count += len(reply_chunk)
                    yield format_sse_event({"type": "chunk", "text": reply_chunk})
                if not has_emitted_chunk:
                    raise DolmenEmptyReplyError("표시 가능한 답변이 없습니다.")
            except ResumeUnavailableError as error:
                yield from emit_debug(
                    "reply_failed", stage="reply", attempt=attempt_index + 1,
                    reason=error.code, answer_path=answer_path, error_category="unknown",
                )
                yield format_sse_event({"type": "error", "message": error.message})
                return
            except DolmenEmptyReplyError:
                yield from emit_debug(
                    "reply_failed", stage="reply", attempt=attempt_index + 1,
                    reason="empty_reply", answer_path=answer_path, error_category="unknown",
                )
                yield format_sse_event(
                    {
                        "type": "error",
                        "message": "답변을 받지 못했습니다. 잠시 후 다시 질문해 주세요.",
                    }
                )
                return
            except Exception as error:  # noqa: BLE001 — 원인 대신 고정된 안전한 안내를 전달한다
                is_last_attempt = attempt_index == max_attempt_count - 1
                if has_emitted_chunk or not is_transient_llm_error(error) or is_last_attempt:
                    yield from emit_debug(
                        "reply_failed", stage="reply", attempt=attempt_index + 1,
                        reason="reply_error", answer_path=answer_path, **safe_error_details(error),
                    )
                    yield format_sse_event(
                        {
                            "type": "error",
                            "message": "답변 생성에 실패했습니다. 잠시 후 다시 질문해 주세요.",
                        }
                    )
                    return
                previous_error_details = safe_error_details(error)
                continue
            yield from emit_debug(
                "reply_completed", attempts=attempt_index + 1, answer_path=answer_path,
                reply_characters=reply_character_count,
            )
            yield format_sse_event({"type": "done"})
            return

    return StreamingResponse(
        generate_reply_events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
