"""합성 등록본으로 실제 Dolmen API/RAG/agent를 실행하는 명시적 회귀 실행기."""

import argparse
import json
import os
import sys
import tempfile
from contextlib import ExitStack
from pathlib import Path
from unittest.mock import patch

# scripts/에서 호출해도 앱의 정상 import 경로를 사용한다.
API_DIRECTORY = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API_DIRECTORY))

from fastapi.testclient import TestClient  # noqa: E402
from hello_agents import HelloAgentsLLM  # noqa: E402
from pypdf import PdfWriter  # noqa: E402
from pypdf.generic import (  # noqa: E402
    DecodedStreamObject,
    DictionaryObject,
    NameObject,
)

from app.agent import DolmenAgentService  # noqa: E402
from app.evaluation import (  # noqa: E402
    contains_private_information,
    summarize_execution_metrics,
)
from app.main import create_app  # noqa: E402
from app.rag import DolmenRagService  # noqa: E402
from app.resume import sanitize_resume_text  # noqa: E402
from app.settings import ResumeSettings, missing_llm_env_names  # noqa: E402

DEFAULT_DATASET = API_DIRECTORY / "evaluation" / "synthetic_tasks.json"


class DeterministicSearchBackend:
    """활성 RAGStore만 검색하는 대체 검색기. 임베딩 품질을 평가하지 않는다."""

    def __init__(self, store):
        self.store = store

    def sync(self):
        pass

    def search(self, query, limit=5):
        # 영어 회사 식별자를 사용해 언어별 토큰화 차이가 fixture를 바꾸지 않게 한다.
        company = next((term for term in query.split() if term.startswith("SYNTHETIC_")), query)
        company = company.rstrip("의은는에서,.?역할과")
        return self.store.search(company, limit)


class DeterministicReplyLlm:
    """SimpleAgent의 실제 실행 경로에 고정 응답만 제공한다. AI 품질 측정용이 아니다."""

    model = "deterministic-fixture"
    provider = "fixture"
    last_call_stats = None

    def __init__(self):
        self.answer = ""
        self.call_count = 0

    async def astream_invoke(self, messages, **kwargs):
        self.call_count += 1
        yield self.answer


def write_synthetic_pdf(resume_path: Path, page_texts: list[str]) -> None:
    """외부 PDF 도구 없이 ASCII 합성 자료만 만든다. 실제 PDF 추출기를 그대로 통과한다."""
    writer = PdfWriter()
    font = DictionaryObject(
        {
            NameObject("/Type"): NameObject("/Font"),
            NameObject("/Subtype"): NameObject("/Type1"),
            NameObject("/BaseFont"): NameObject("/Helvetica"),
        }
    )
    for page_text in page_texts:
        page = writer.add_blank_page(width=612, height=792)
        page[NameObject("/Resources")] = DictionaryObject(
            {NameObject("/Font"): DictionaryObject({NameObject("/F1"): writer._add_object(font)})}
        )
        commands = ["BT /F1 11 Tf 40 740 Td 14 TL"]
        for line in page_text.splitlines():
            escaped_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            commands.append(f"({escaped_line}) Tj T*")
        commands.append("ET")
        stream = DecodedStreamObject()
        stream.set_data("\n".join(commands).encode("ascii"))
        page[NameObject("/Contents")] = writer._add_object(stream)
    writer.write(resume_path)


def parse_sse_response(response) -> list[dict]:
    return [
        json.loads(line.removeprefix("data: "))
        for line in response.text.splitlines()
        if line.startswith("data: ")
    ]


def check_task_expectations(
    case: dict,
    events: list[dict],
    answer: str,
    mode: str = "deterministic",
) -> list[str]:
    expected = {
        **case["expected"],
        **(case.get("provider_expected", {}) if mode == "provider" else {}),
    }
    failures = []
    terminal = next(
        (event["type"] for event in reversed(events) if event["type"] in {"done", "error"}),
        "incomplete",
    )
    if terminal != expected["terminal"]:
        failures.append("terminal")
    for required in expected.get("contains_all", []):
        if required not in answer:
            failures.append(f"missing:{required}")
    if expected.get("contains_any") and not any(
        term in answer for term in expected["contains_any"]
    ):
        failures.append("missing_any_expected_phrase")
    for forbidden in expected.get("contains_none", []):
        if forbidden in answer:
            failures.append(f"forbidden:{forbidden}")
    if contains_private_information(answer):
        failures.append("private_information")
    diagnostics = [event for event in events if event["type"] == "debug"]
    if "max_model_attempts" in expected:
        model_attempts = sum(
            event.get("event") == "reply_attempt"
            and event.get("details", {}).get("answer_path") == "model"
            for event in diagnostics
        )
        if model_attempts > expected["max_model_attempts"]:
            failures.append("model_attempt_budget")
    if "context_status" in expected:
        context_status = next(
            (
                event.get("context", {}).get("status")
                for event in diagnostics
                if event.get("event") == "context_built"
            ),
            None,
        )
        if context_status != expected["context_status"]:
            failures.append("context_status")
    evaluation = next(
        (event["evaluation"] for event in diagnostics if event.get("event") == "answer_evaluated"),
        None,
    )
    expected_statuses = expected["evaluation_status"]
    if isinstance(expected_statuses, str):
        expected_statuses = [expected_statuses]
    if evaluation is None or evaluation.get("status") not in expected_statuses:
        failures.append("evaluation_status")
    actual_rule_failures = sorted(
        check["name"]
        for check in (evaluation or {}).get("checks", [])
        if check["status"] == "failed"
    )
    expected_failure_sets = expected.get(
        "rule_failures_any_of", [expected.get("rule_failures", [])]
    )
    if not any(
        actual_rule_failures == sorted(failure_set) for failure_set in expected_failure_sets
    ):
        failures.append("rule_expectations")
    return failures


def run_regression(mode: str, max_cases: int, max_requests: int, include_judge: bool) -> dict:
    dataset = json.loads(DEFAULT_DATASET.read_text())
    if mode == "provider" and missing_llm_env_names():
        raise RuntimeError("provider_not_configured")
    if include_judge and mode != "provider":
        raise RuntimeError("judge_requires_provider_mode")
    observations = []
    all_request_events = []
    request_count = 0
    with tempfile.TemporaryDirectory(prefix="dolmen-evaluation-") as temporary_directory:
        temporary_path = Path(temporary_directory)
        resume_path = temporary_path / "synthetic.pdf"
        write_synthetic_pdf(resume_path, dataset["resume_pages"])
        settings = ResumeSettings(
            resume_path, dataset["candidate_name"], dataset["resume_updated_at"]
        )
        rag = DolmenRagService(settings, temporary_path / "rag")
        llm = DeterministicReplyLlm() if mode == "deterministic" else HelloAgentsLLM(timeout=20)
        try:
            with ExitStack() as stack:
                stack.enter_context(patch.dict(os.environ, {"DOLMEN_DEBUG_ENABLED": "true"}))
                if mode == "deterministic":
                    stack.enter_context(
                        patch.object(
                            rag,
                            "_create_search_backend",
                            return_value=DeterministicSearchBackend(rag.store),
                        )
                    )
                agent_service = DolmenAgentService(llm)
                stack.enter_context(patch("app.routes.chat.dolmen_rag_service", return_value=rag))
                stack.enter_context(
                    patch("app.routes.chat.dolmen_agent_service", return_value=agent_service)
                )
                stack.enter_context(
                    patch("app.routes.evaluations.dolmen_rag_service", return_value=rag)
                )
                stack.enter_context(
                    patch("app.routes.evaluations.get_dolmen_llm", return_value=llm)
                )
                client = stack.enter_context(TestClient(create_app()))
                for case in dataset["cases"][:max_cases]:
                    required_requests = len(case.get("history_questions", [])) + 1
                    if request_count + required_requests > max_requests:
                        observations.append(
                            {
                                "case_id": case["id"],
                                "status": "skipped",
                                "reason": "request_budget_exceeded",
                            }
                        )
                        continue
                    session_id = f"synthetic-{case['id']}"
                    if mode == "deterministic":
                        llm.answer = case["fixture_answer"]
                    for history_question in case.get("history_questions", []):
                        warmup_events = parse_sse_response(
                            client.post(
                                "/api/chat",
                                json={
                                    "message": history_question,
                                    "session_id": session_id,
                                },
                            )
                        )
                        all_request_events.append(
                            [event for event in warmup_events if event["type"] == "debug"]
                        )
                        request_count += 1
                    case_environment = {}
                    if "context_token_limit" in case:
                        case_environment = {
                            "DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": str(case["context_token_limit"]),
                            "DOLMEN_CONTEXT_OUTPUT_TOKEN_RESERVE": str(
                                case["output_token_reserve"]
                            ),
                        }
                    with patch.dict(os.environ, case_environment):
                        calls_before = llm.call_count if mode == "deterministic" else None
                        events = parse_sse_response(
                            client.post(
                                "/api/chat",
                                json={
                                    "message": case["question"],
                                    "session_id": session_id,
                                },
                            )
                        )
                    request_count += 1
                    answer = "".join(event["text"] for event in events if event["type"] == "chunk")
                    debug_events = [event for event in events if event["type"] == "debug"]
                    all_request_events.append(debug_events)
                    failures = check_task_expectations(case, events, answer, mode)
                    fixture_calls = (
                        llm.call_count - calls_before if calls_before is not None else None
                    )
                    if (
                        mode == "deterministic"
                        and "fixture_model_calls" in case["expected"]
                        and fixture_calls != case["expected"]["fixture_model_calls"]
                    ):
                        failures.append("fixture_model_calls")
                    # 공개 SimpleAgent history API로 보관된 턴 수만 읽는다. 내용은 출력하지 않는다.
                    session_agent = agent_service._agents_by_session_id.get(session_id)
                    retained_turns = (
                        sum(message.role == "user" for message in session_agent.get_history())
                        if session_agent
                        else 0
                    )
                    if retained_turns > case["expected"].get("max_retained_history_turns", 2):
                        failures.append("retained_history_turns")
                    evaluation = next(
                        (
                            event["evaluation"]
                            for event in debug_events
                            if event.get("event") == "answer_evaluated"
                        ),
                        None,
                    )
                    observation = {
                        "case_id": case["id"],
                        "question": case["question"],
                        "status": "passed" if not failures else "failed",
                        "response": sanitize_resume_text(answer),
                        "failures": failures,
                        "evaluation": evaluation,
                        "execution": summarize_execution_metrics([debug_events]),
                        "retained_history_turns": retained_turns,
                        "fixture_model_calls": fixture_calls,
                        "human_review": "pending" if mode == "provider" else "not_ai_quality_run",
                    }
                    if include_judge and any(event["type"] == "done" for event in events):
                        sources = next(
                            (
                                event.get("grounds", [])
                                for event in events
                                if event["type"] == "sources"
                            ),
                            [],
                        )
                        context_event = next(
                            (
                                event
                                for event in debug_events
                                if event.get("event") == "context_ready"
                            ),
                            None,
                        )
                        revision = (
                            context_event.get("details", {}).get("revision")
                            if context_event
                            else None
                        )
                        if revision is not None:
                            observation["judge"] = client.post(
                                "/api/evaluations/judge",
                                json={
                                    "question": case["question"],
                                    "answer": answer,
                                    "status": "completed",
                                    "resume_revision": revision,
                                    "ground_chunk_ids": [ground["chunk_id"] for ground in sources],
                                },
                            ).json()
                    observations.append(observation)
        finally:
            if mode == "provider":
                llm.close()
            if rag.search_backend and callable(getattr(rag.search_backend, "close", None)):
                rag.search_backend.close()
            rag.store.close() if callable(getattr(rag.store, "close", None)) else None
    return {
        "dataset_id": dataset["dataset_id"],
        "mode": mode,
        "measurement_scope": "fixture_contract_regression"
        if mode == "deterministic"
        else "synthetic_resume_provider_observations",
        "disclaimer": (
            "기계적 기대조건 충족은 AI 정답률이 아닙니다. 실제 품질은 사람의 검토가 필요합니다."
        ),
        "request_budget": max_requests,
        "executed_requests": request_count,
        "execution": summarize_execution_metrics(all_request_events),
        "cases": observations,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("deterministic", "provider"), default="deterministic")
    parser.add_argument("--max-cases", type=int, default=7)
    parser.add_argument("--max-requests", type=int, default=16)
    parser.add_argument(
        "--judge", action="store_true", help="provider 모드의 명시적 1회 Judge 평가 추가"
    )
    parser.add_argument("--output", type=Path, default=Path("/tmp/dolmen-evaluation-results.json"))
    arguments = parser.parse_args()
    if not 1 <= arguments.max_cases <= 50 or not 1 <= arguments.max_requests <= 30:
        parser.error("max-cases는 1~50, max-requests는 1~30이어야 합니다.")
    try:
        report = run_regression(
            arguments.mode, arguments.max_cases, arguments.max_requests, arguments.judge
        )
    except Exception:
        # provider/검색 예외 원문은 키·경로·본문을 포함할 수 있으므로 출력하지 않는다.
        print(
            "평가 실행에 실패했습니다. 모델 설정과 로컬 실행 환경을 확인해 주세요.", file=sys.stderr
        )
        return 2
    arguments.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(
        f"{arguments.mode}: {len(report['cases'])}개 사례, "
        f"{report['executed_requests']}개 요청 기록"
    )
    return 1 if any(case["status"] == "failed" for case in report["cases"]) else 0


if __name__ == "__main__":
    raise SystemExit(main())
