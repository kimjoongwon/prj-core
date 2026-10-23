"""개발용 실행 관측. 허용된 단계·수치만 기록하고 계측 실패는 응답에 영향을 주지 않는다."""

import json
import math
import re
import time
import uuid

from app.settings import is_debug_enabled

ANSWER_PATHS = {"model", "private_refusal", "no_evidence"}
FAILURE_REASONS = {
    "resume_not_configured", "resume_not_ready", "llm_not_configured",
    "model_initialization_failed", "empty_reply", "reply_error",
}
ERROR_CATEGORIES = {
    "rate_limit", "overloaded", "timeout", "authentication", "connection",
    "provider_error", "unknown",
}
DEBUG_EVENT_FIELDS: dict[str, dict[str, type | set[str]]] = {
    "request_received": {},
    "retrieval_started": {"retrieval_limit": int},
    "context_ready": {
        "revision": int, "page_count": int, "context_characters": int,
        "retrieved_count": int, "retrieval_limit": int,
    },
    "reply_attempt": {"attempt": int, "answer_path": ANSWER_PATHS},
    "retry_scheduled": {
        "attempt": int, "next_attempt": int, "backoff_seconds": int,
        "error_category": ERROR_CATEGORIES, "provider_code": int, "http_status": int,
    },
    "first_chunk": {
        "attempt": int, "answer_path": ANSWER_PATHS, "chunk_characters": int,
    },
    "reply_completed": {
        "attempts": int, "answer_path": ANSWER_PATHS, "reply_characters": int,
    },
    "reply_failed": {
        "stage": {"retrieval", "configuration", "reply"},
        "attempt": int, "reason": FAILURE_REASONS, "answer_path": ANSWER_PATHS,
        "error_category": ERROR_CATEGORIES, "provider_code": int, "http_status": int,
    },
}


def safe_error_details(error: Exception) -> dict:
    """예외 원문은 반환하지 않고 제한된 코드/상태와 고정된 분류만 추출한다."""
    try:
        error_details: dict[str, str | int] = {"error_category": "unknown"}
        http_status = getattr(error, "status_code", None)
        if type(http_status) is not int:
            http_status = getattr(getattr(error, "response", None), "status_code", None)
        if type(http_status) is int and 100 <= http_status <= 599:
            error_details["http_status"] = http_status
        provider_code = getattr(error, "code", None)
        error_body = getattr(error, "body", None)
        if isinstance(error_body, dict):
            provider_error = error_body.get("error", error_body)
            if isinstance(provider_error, dict):
                provider_code = provider_error.get("code", provider_code)
        error_text = str(error).lower()
        if not isinstance(provider_code, (str, int)) or isinstance(provider_code, bool):
            provider_code = None
        if provider_code is None:
            known_code = re.search(r"[\"']?code[\"']?\s*[:=]\s*[\"']?(1302|1305)\b", error_text)
            provider_code = known_code.group(1) if known_code else None
        if provider_code is not None and re.fullmatch(r"\d{1,6}", str(provider_code)):
            error_details["provider_code"] = int(provider_code)
        code = error_details.get("provider_code")
        if code == 1305 or "overloaded" in error_text:
            error_details["error_category"] = "overloaded"
        elif code == 1302 or http_status == 429 or "rate limit" in error_text:
            error_details["error_category"] = "rate_limit"
        elif "timeout" in type(error).__name__.lower() or isinstance(error, TimeoutError):
            error_details["error_category"] = "timeout"
        elif http_status in (401, 403):
            error_details["error_category"] = "authentication"
        elif "connection" in type(error).__name__.lower():
            error_details["error_category"] = "connection"
        elif "http_status" in error_details:
            error_details["error_category"] = "provider_error"
        return error_details
    except Exception:
        return {"error_category": "unknown"}


class ChatDebugTrace:
    def __init__(self):
        self._enabled = False
        self._last_elapsed_ms = 0.0
        try:
            if is_debug_enabled():
                self._request_id = str(uuid.uuid4())
                self._started_at = time.monotonic()
                self._enabled = True
        except Exception:
            self._enabled = False

    def emit(self, event: str, **details) -> tuple[str, ...]:
        if not self._enabled:
            return ()
        try:
            if event not in DEBUG_EVENT_FIELDS:
                return ()
            allowed_details = {}
            for field_name, allowed_type in DEBUG_EVENT_FIELDS[event].items():
                field_value = details.get(field_name)
                if allowed_type is int:
                    if type(field_value) is int and field_value >= 0:
                        if field_name == "provider_code" and field_value > 999999:
                            continue
                        if field_name == "http_status" and not 100 <= field_value <= 599:
                            continue
                        allowed_details[field_name] = field_value
                elif (
                    isinstance(allowed_type, set) and isinstance(field_value, str)
                    and field_value in allowed_type
                ):
                    allowed_details[field_name] = field_value
            elapsed_ms = (time.monotonic() - self._started_at) * 1000
            if not math.isfinite(elapsed_ms):
                return ()
            self._last_elapsed_ms = max(self._last_elapsed_ms, round(elapsed_ms, 3), 0.0)
            payload = {
                "type": "debug", "event": event,
                "elapsed_ms": self._last_elapsed_ms,
                "request_id": self._request_id, "details": allowed_details,
            }
            return (f"data: {json.dumps(payload, ensure_ascii=False)}\n\n",)
        except Exception:
            return ()
