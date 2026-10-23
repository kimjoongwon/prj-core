"""개발용 실행 관측. 허용된 단계·수치만 기록하고 계측 실패는 응답에 영향을 주지 않는다."""

import json
import math
import re
import time
import uuid

from app.agent import RUN_STATUSES, STOP_REASONS
from app.context import CONTEXT_ESTIMATOR, CONTEXT_VERSION, PACKET_REASONS
from app.evaluation import CHECK_DISCLAIMER, CHECK_NAMES
from app.resume import sanitize_resume_text
from app.settings import is_debug_enabled

ANSWER_PATHS = {"model", "private_refusal", "no_evidence"}
FAILURE_REASONS = {
    "resume_not_configured",
    "resume_not_ready",
    "llm_not_configured",
    "model_initialization_failed",
    "empty_reply",
    "reply_error",
    "context_budget_exceeded",
    "output_limit",
    "incomplete_reply",
}
ERROR_CATEGORIES = {
    "rate_limit",
    "overloaded",
    "timeout",
    "authentication",
    "connection",
    "provider_error",
    "unknown",
}
DEBUG_EVENT_FIELDS: dict[str, dict[str, type | set[str]]] = {
    "request_received": {},
    "retrieval_started": {"retrieval_limit": int},
    "context_ready": {
        "revision": int,
        "page_count": int,
        "context_characters": int,
        "retrieved_count": int,
        "retrieval_limit": int,
    },
    "context_built": {},
    "answer_evaluated": {},
    "reply_metrics": {
        "attempt": int,
        "run_status": RUN_STATUSES,
        "stop_reason": STOP_REASONS,
        "prompt_tokens": int,
        "completion_tokens": int,
        "total_tokens": int,
    },
    "reply_attempt": {"attempt": int, "answer_path": ANSWER_PATHS},
    "retry_scheduled": {
        "attempt": int,
        "next_attempt": int,
        "backoff_seconds": int,
        "error_category": ERROR_CATEGORIES,
        "provider_code": int,
        "http_status": int,
    },
    "first_chunk": {
        "attempt": int,
        "answer_path": ANSWER_PATHS,
        "chunk_characters": int,
    },
    "reply_completed": {
        "attempts": int,
        "answer_path": ANSWER_PATHS,
        "reply_characters": int,
    },
    "reply_failed": {
        "stage": {"retrieval", "configuration", "context", "reply"},
        "attempt": int,
        "reason": FAILURE_REASONS,
        "answer_path": ANSWER_PATHS,
        "error_category": ERROR_CATEGORIES,
        "provider_code": int,
        "http_status": int,
    },
}

EVALUATION_REASONS = {
    "정상 모델 답변만 검사합니다.",
    "답변 본문이 있습니다.",
    "답변 본문이 비어 있습니다.",
    "쪽 인용이 있습니다.",
    "쪽 인용이 없습니다.",
    "인용한 쪽이 실제 제공한 근거에 포함됩니다.",
    "제공하지 않은 쪽 또는 누락된 인용입니다.",
    "지원자 호칭과 3인칭 형식이 있습니다.",
    "지원자 호칭이 없거나 1인칭 패턴이 있습니다.",
    "검사 대상 개인정보 패턴이 없습니다.",
    "검사 대상 개인정보 패턴이 발견되었습니다.",
    "제공된 쪽 근거가 없어 인용 검사를 건너뜁니다.",
}


def _counts(value, keys):
    if not isinstance(value, dict) or any(
        type(value.get(key)) is not int or not 0 <= value[key] <= 10**9 for key in keys
    ):
        raise ValueError
    return {key: value[key] for key in keys}


def safe_context_payload(value: dict) -> dict:
    """스냅샷에도 엄격한 허용 목록을 적용한다. 질문/프롬프트/대화는 직렬화하지 않는다."""
    if (
        value.get("version") != CONTEXT_VERSION
        or value.get("estimator") != CONTEXT_ESTIMATOR
        or value.get("status") not in {"ready", "budget_exceeded"}
        or value.get("policy") not in {"full_sanitized_resume", "selected_resume_groups"}
    ):
        raise ValueError
    payload = {key: value[key] for key in ("version", "estimator", "status", "policy")}
    payload.update(_counts(value, ("revision",)))
    payload["budget"] = _counts(
        value.get("budget"),
        (
            "input_limit",
            "output_reserve",
            "estimated_input_tokens",
            "remaining_input_tokens",
        ),
    )
    payload["history"] = _counts(
        value.get("history"),
        (
            "available_turns",
            "selected_turns",
            "dropped_turns",
            "deduplicated_turns",
        ),
    )
    if not isinstance(value.get("stages"), list) or len(value["stages"]) != 4:
        raise ValueError
    payload["stages"] = []
    for entry, stage in zip(
        value["stages"],
        ("gather", "select", "structure", "compress"),
        strict=True,
    ):
        if entry.get("stage") != stage:
            raise ValueError
        payload["stages"].append(
            {"stage": stage, **_counts(entry, ("input_count", "output_count"))}
        )
    if not isinstance(value.get("packets"), list) or len(value["packets"]) > 1000:
        raise ValueError
    payload["packets"] = []
    for packet in value["packets"]:
        packet_id, source = packet.get("packet_id"), packet.get("source")
        if (
            not isinstance(packet_id, str)
            or len(packet_id) > 64
            or not re.fullmatch(
                r"system|query|(?:resume-group|history-turn|retrieval)-\d{1,8}", packet_id
            )
            or not isinstance(source, str)
            or len(source) > 80
            or not (
                source in {"시스템 정책", "현재 질문", "최근 대화", "검색 근거"}
                or re.fullmatch(r"등록 이력서 · \d{1,4}쪽", source)
            )
            or packet.get("kind") not in {"system", "query", "resume", "history", "retrieval"}
            or type(packet.get("selected")) is not bool
            or packet.get("reason") not in PACKET_REASONS
        ):
            raise ValueError
        expected_labels = {
            "system": (r"system", "시스템 정책"),
            "query": (r"query", "현재 질문"),
            "history": (r"history-turn-\d{1,8}", "최근 대화"),
            "retrieval": (r"retrieval-\d{1,8}", "검색 근거"),
            "resume": (r"resume-group-\d{1,8}", None),
        }
        id_pattern, fixed_source = expected_labels[packet["kind"]]
        if (
            not re.fullmatch(id_pattern, packet_id)
            or (fixed_source is not None and source != fixed_source)
            or (packet["kind"] == "resume" and not re.fullmatch(r"등록 이력서 · \d{1,4}쪽", source))
        ):
            raise ValueError
        safe_packet = {
            key: packet[key]
            for key in (
                "packet_id",
                "source",
                "kind",
                "selected",
                "reason",
            )
        }
        safe_packet.update(_counts(packet, ("estimated_tokens", "character_count")))
        if packet["kind"] == "resume" and isinstance(packet.get("snippet"), str):
            safe_packet["snippet"] = sanitize_resume_text(packet["snippet"])[:220]
        payload["packets"].append(safe_packet)
    return payload


def safe_evaluation_payload(value: dict) -> dict:
    if (
        value.get("kind") != "deterministic_checks"
        or value.get("status") not in {"completed", "skipped"}
        or not isinstance(value.get("checks"), list)
        or len(value["checks"]) != len(CHECK_NAMES)
        or value.get("disclaimer") != CHECK_DISCLAIMER
    ):
        raise ValueError
    checks = []
    for check, name in zip(value["checks"], CHECK_NAMES, strict=False):
        if (
            check.get("name") != name
            or check.get("status") not in {"passed", "failed", "skipped"}
            or check.get("reason") not in EVALUATION_REASONS
        ):
            raise ValueError
        checks.append({key: check[key] for key in ("name", "status", "reason")})
    return {
        "kind": "deterministic_checks",
        "status": value["status"],
        "checks": checks,
        "disclaimer": CHECK_DISCLAIMER,
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
                        if field_name.endswith("_tokens") and field_value > 10**9:
                            continue
                        if field_name == "provider_code" and field_value > 999999:
                            continue
                        if field_name == "http_status" and not 100 <= field_value <= 599:
                            continue
                        allowed_details[field_name] = field_value
                elif (
                    isinstance(allowed_type, set)
                    and isinstance(field_value, str)
                    and field_value in allowed_type
                ):
                    allowed_details[field_name] = field_value
            elapsed_ms = (time.monotonic() - self._started_at) * 1000
            if not math.isfinite(elapsed_ms):
                return ()
            self._last_elapsed_ms = max(self._last_elapsed_ms, round(elapsed_ms, 3), 0.0)
            payload = {
                "type": "debug",
                "event": event,
                "elapsed_ms": self._last_elapsed_ms,
                "request_id": self._request_id,
                "details": allowed_details,
            }
            if event == "context_built":
                payload["context"] = safe_context_payload(details.get("context"))
            elif event == "answer_evaluated":
                payload["evaluation"] = safe_evaluation_payload(details.get("evaluation"))
            return (f"data: {json.dumps(payload, ensure_ascii=False)}\n\n",)
        except Exception:
            return ()
