"""개발 설정에서만 허용하는 명시적 답변 평가. 클라이언트 자료는 비신뢰 입력이다."""

import json
from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, StrictInt, ValidationError
from starlette.concurrency import run_in_threadpool

from app.agent import build_resume_context, get_dolmen_llm
from app.evaluation import judge_answer_once, judge_result
from app.rag import dolmen_rag_service
from app.resume import is_private_resume_question, sanitize_resume_text
from app.settings import RETRIEVED_GROUNDS_LIMIT, is_debug_enabled

router = APIRouter(tags=["evaluations"])
MAX_EVALUATION_REQUEST_BYTES = 64000


class JudgeRequestBody(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    question: str = Field(min_length=1, max_length=4000)
    answer: str = Field(min_length=1, max_length=12000)
    status: Literal["completed", "failed", "cancelled"]
    resume_revision: Annotated[StrictInt, Field(ge=0)]
    ground_chunk_ids: list[Annotated[str, Field(min_length=1, max_length=160)]] = Field(
        max_length=5
    )


def evaluation_http_error(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(status_code, detail={"code": code, "message": message})


def evaluate_current_answer(judge_request: JudgeRequestBody) -> dict:
    if judge_request.status != "completed":
        return judge_result("skipped", "non_completed_answer")
    if is_private_resume_question(judge_request.question):
        return judge_result("skipped", "private_question")
    sanitized_question = sanitize_resume_text(judge_request.question)
    if not sanitized_question or not sanitize_resume_text(judge_request.answer):
        return judge_result("skipped", "sanitized_empty")
    try:
        # 검색/쪽 선택은 생성 때와 같은 원질문으로 재현한다. 정제 시 공백/문자 수가 바뀌면
        # 예산에 새 쪽이 들어와 원래 모델이 보지 않은 사실을 지지 근거로 오판할 수 있다.
        # 원질문은 저장하지 않으며 외부 Judge payload에만 정제본을 사용한다.
        reply_context = dolmen_rag_service().retrieve_reply_context(
            judge_request.question, limit=RETRIEVED_GROUNDS_LIMIT
        )
        expected_chunk_ids = {ground.chunk_id for ground in reply_context.grounds}
        supplied_chunk_ids = set(judge_request.ground_chunk_ids)
        if (
            reply_context.revision != judge_request.resume_revision
            or len(supplied_chunk_ids) != len(judge_request.ground_chunk_ids)
            or expected_chunk_ids != supplied_chunk_ids
        ):
            return judge_result("failed", "context_mismatch")
        if not expected_chunk_ids:
            return judge_result("skipped", "no_evidence")
        built_context = build_resume_context(judge_request.question, reply_context)
        if built_context.status != "ready":
            return judge_result("skipped", "context_budget_exceeded")
        return judge_answer_once(
            sanitized_question,
            judge_request.answer,
            built_context.grounds,
            get_dolmen_llm(),
            resume_pages=built_context.resume_pages,
        )
    except Exception:
        # SDK/검색 예외 문자열에는 문서·경로·접속 정보가 들어갈 수 있다.
        return judge_result("failed", "evaluation_unavailable")


@router.post("/evaluations/judge")
async def evaluate_answer_with_judge(request: Request) -> dict:
    if not is_debug_enabled():
        raise evaluation_http_error(404, "not_found", "요청한 기능을 찾을 수 없습니다.")
    # FastAPI 기본 validation 오류의 input 필드로 원문이 반사되지 않게 여기서 검증한다.
    request_bytes = bytearray()
    async for request_chunk in request.stream():
        request_bytes.extend(request_chunk)
        if len(request_bytes) > MAX_EVALUATION_REQUEST_BYTES:
            raise evaluation_http_error(413, "request_too_large", "평가 요청 크기를 줄여 주세요.")
    try:
        judge_request = JudgeRequestBody.model_validate(json.loads(request_bytes))
    except (ValueError, TypeError, ValidationError):
        raise evaluation_http_error(
            422, "invalid_request", "평가 요청 형식을 확인해 주세요."
        ) from None
    return await run_in_threadpool(evaluate_current_answer, judge_request)
