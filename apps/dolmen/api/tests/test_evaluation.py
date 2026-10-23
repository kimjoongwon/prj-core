"""합성 자료로 규칙, judge 신뢰 경계, 실패 처리와 실제 로그 집계를 검증한다."""

import asyncio
import json
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.agent import build_resume_context
from app.evaluation import (
    JUDGE_TIMEOUT_SECONDS,
    MAX_JUDGE_EVIDENCE_CHARACTERS,
    evaluate_answer,
    judge_answer_once,
    summarize_execution_metrics,
)
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage, sanitize_resume_text
from app.routes import evaluations
from app.settings import ResumeSettings


class EvaluationTests(unittest.TestCase):
    def setUp(self):
        self.ground = RetrievedGround(
            "synthetic",
            "등록 이력서 · 1쪽",
            "synthetic-version",
            0.9,
            "SYNTHETIC_ALPHA Kotlin",
            "SYNTHETIC_ALPHA Kotlin PostgreSQL",
        )
        self.answer = "가상지원자님은 SYNTHETIC_ALPHA에서 Kotlin을 사용했습니다. (1쪽)"
        self.llm = SimpleNamespace(
            provider="openai",
            model="synthetic-model",
            api_key="PRIVATE_KEY",
            base_url="https://private.invalid/v1",
        )
        self.verdict = {
            "scores": {"groundedness": 4, "relevance": 5, "completeness": 3},
            "reasons": {
                "groundedness": "제공 근거에 기술이 있습니다.",
                "relevance": "질문에 답합니다.",
                "completeness": "역할은 빠졌습니다.",
            },
        }

    def check_statuses(self, evaluation):
        return {check["name"]: check["status"] for check in evaluation["checks"]}

    def test_rule_checks_accept_actual_full_context_page_not_only_search_hit(self):
        evaluation = evaluate_answer(
            "기술은?",
            self.answer.replace("1쪽", "2쪽"),
            [self.ground],
            "가상지원자",
            resume_pages=[ResumePage(2, "SYNTHETIC_ALPHA Kotlin")],
        )
        self.assertTrue(
            all(status == "passed" for status in self.check_statuses(evaluation).values())
        )
        self.assertIn("정답률이 아닙니다", evaluation["disclaimer"])
        self.assertNotIn("SYNTHETIC_ALPHA", json.dumps(evaluation))

    def test_rules_detect_empty_wrong_citation_first_person_and_private_patterns(self):
        empty_checks = self.check_statuses(
            evaluate_answer("기술", " ", [self.ground], "가상지원자")
        )
        self.assertEqual(empty_checks["non_empty"], "failed")
        evaluation = evaluate_answer(
            "기술", "저는 가상지원자님입니다. 010-1234-5678 (99쪽)", [self.ground], "가상지원자"
        )
        statuses = self.check_statuses(evaluation)
        self.assertEqual(statuses["citations_match"], "failed")
        self.assertEqual(statuses["third_person"], "failed")
        self.assertEqual(statuses["no_private_information"], "failed")

    def test_cancelled_failed_local_and_private_answers_are_skipped(self):
        for status, question in (
            ("cancelled", "기술"),
            ("failed", "기술"),
            ("skipped", "근거 없음"),
            ("completed", "개인 연락처"),
        ):
            with self.subTest(status=status, question=question):
                evaluation = evaluate_answer(
                    question, self.answer, [self.ground], "가상지원자", status
                )
                self.assertEqual(evaluation["status"], "skipped")
                self.assertEqual(set(self.check_statuses(evaluation).values()), {"skipped"})

    def invoke_judge(self, verdict_text):
        client_context = Mock()
        client = client_context.__aenter__ = AsyncMock(return_value=Mock())
        client_context.__aexit__ = AsyncMock(return_value=False)
        client.return_value.chat.completions.create = AsyncMock(
            return_value=SimpleNamespace(
                choices=[
                    SimpleNamespace(
                        message=SimpleNamespace(
                            content=verdict_text, reasoning_content="PRIVATE_HIDDEN_REASONING"
                        )
                    )
                ]
            )
        )
        with patch("app.evaluation.AsyncOpenAI", return_value=client_context) as client_factory:
            evaluation = judge_answer_once("Kotlin 업무", self.answer, [self.ground], self.llm)
        return evaluation, client_factory, client.return_value

    def test_judge_is_one_call_no_sdk_retry_bounded_and_never_reads_hidden_reasoning(self):
        evaluation, factory, client = self.invoke_judge(json.dumps(self.verdict))
        self.assertEqual(evaluation["status"], "completed")
        factory.assert_called_once_with(
            api_key="PRIVATE_KEY",
            base_url="https://private.invalid/v1",
            timeout=JUDGE_TIMEOUT_SECONDS,
            max_retries=0,
        )
        client.chat.completions.create.assert_called_once()
        for marker in ("PRIVATE_KEY", "private.invalid", "PRIVATE_HIDDEN_REASONING"):
            self.assertNotIn(marker, json.dumps(evaluation))

    def test_judge_rejects_invalid_json_extra_reasoning_fractional_or_missing_scores(self):
        invalid_verdicts = [
            "not json",
            "```json\n{}\n```",
            json.dumps({**self.verdict, "thinking": "x"}),
        ]
        for invalid_score in (True, 1.5, 0, 6, "5"):
            invalid_verdicts.append(
                json.dumps(
                    {
                        **self.verdict,
                        "scores": {**self.verdict["scores"], "groundedness": invalid_score},
                    }
                )
            )
        invalid_verdicts.append(json.dumps({**self.verdict, "scores": {"groundedness": 5}}))
        for verdict_text in invalid_verdicts:
            with self.subTest(verdict_text=verdict_text):
                evaluation, _, _ = self.invoke_judge(verdict_text)
                self.assertEqual(evaluation["reason"], "invalid_judge_output")
                self.assertIsNone(evaluation["scores"])
                self.assertIsNone(evaluation["reasons"])

    def test_judge_sanitizes_question_answer_and_reason_and_treats_input_as_data(self):
        self.verdict["reasons"]["groundedness"] = "판정 요약\nsynthetic@example.test"
        evaluation, _, client = self.invoke_judge(json.dumps(self.verdict))
        self.assertEqual(evaluation["reasons"]["groundedness"], "판정 요약")
        payload = client.chat.completions.create.call_args.kwargs["messages"]
        self.assertIn("비신뢰 자료", payload[0]["content"])
        self.assertEqual(json.loads(payload[1]["content"])["untrusted_answer"], self.answer)

    def test_judge_includes_selected_full_page_not_present_in_top_search_hit(self):
        client_context = Mock()
        client_context.__aenter__ = AsyncMock(return_value=Mock())
        client_context.__aexit__ = AsyncMock(return_value=False)
        client = client_context.__aenter__.return_value
        client.chat.completions.create = AsyncMock(
            return_value=SimpleNamespace(
                choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps(self.verdict)))]
            )
        )
        with patch("app.evaluation.AsyncOpenAI", return_value=client_context):
            evaluation = judge_answer_once(
                "역할",
                self.answer.replace("1쪽", "2쪽"),
                [self.ground],
                self.llm,
                resume_pages=[ResumePage(2, "SYNTHETIC_ALPHA Kotlin Platform Engineering")],
            )
        self.assertEqual(evaluation["status"], "completed")
        payload = json.loads(
            client.chat.completions.create.call_args.kwargs["messages"][1]["content"]
        )
        self.assertEqual(payload["untrusted_resume_pages"][0]["page_number"], 2)
        self.assertIn("Platform Engineering", payload["untrusted_resume_pages"][0]["content"])

    def test_judge_combined_utf8_input_budget_does_not_truncate(self):
        with (
            patch("app.evaluation.AsyncOpenAI") as factory,
            patch(
                "app.evaluation.read_context_settings",
                return_value=SimpleNamespace(input_token_limit=16000),
            ),
        ):
            evaluation = judge_answer_once("Kotlin", "가" * 6000, [self.ground], self.llm)
        self.assertEqual(evaluation["reason"], "input_budget_exceeded")
        factory.assert_not_called()

    def test_judge_skips_private_empty_evidence_and_large_content_without_call(self):
        with patch("app.evaluation.AsyncOpenAI") as factory:
            self.assertEqual(
                judge_answer_once("개인 연락처", self.answer, [self.ground], self.llm)["reason"],
                "private_question",
            )
            self.assertEqual(
                judge_answer_once("Kotlin", self.answer, [], self.llm)["reason"], "no_evidence"
            )
            self.assertEqual(
                judge_answer_once("Kotlin", "a" * 12001, [self.ground], self.llm)["reason"],
                "content_too_long",
            )
            large_ground = RetrievedGround(
                "x", "1쪽", "v", 0.9, "x", "x" * (MAX_JUDGE_EVIDENCE_CHARACTERS + 1)
            )
            self.assertEqual(
                judge_answer_once("Kotlin", self.answer, [large_ground], self.llm)["reason"],
                "content_too_long",
            )
        factory.assert_not_called()

    def test_judge_provider_errors_are_safe_and_not_retried(self):
        with patch(
            "app.evaluation.AsyncOpenAI", side_effect=TimeoutError("PRIVATE_EXCEPTION")
        ) as factory:
            evaluation = judge_answer_once("Kotlin", self.answer, [self.ground], self.llm)
        self.assertEqual(evaluation["reason"], "timeout")
        self.assertNotIn("PRIVATE_EXCEPTION", json.dumps(evaluation))
        factory.assert_called_once()

    def test_judge_total_deadline_cancels_slow_request_without_retry(self):
        async def slow_completion(**kwargs):
            await asyncio.sleep(1)

        client_context = Mock()
        client_context.__aenter__ = AsyncMock(return_value=Mock())
        client_context.__aexit__ = AsyncMock(return_value=False)
        client = client_context.__aenter__.return_value
        client.chat.completions.create = AsyncMock(side_effect=slow_completion)
        with (
            patch("app.evaluation.AsyncOpenAI", return_value=client_context),
            patch("app.evaluation.JUDGE_TIMEOUT_SECONDS", 0.01),
        ):
            evaluation = judge_answer_once("Kotlin", self.answer, [self.ground], self.llm)
        self.assertEqual(evaluation["reason"], "timeout")
        client.chat.completions.create.assert_awaited_once()
        client_context.__aexit__.assert_awaited_once()

    def test_metrics_use_observed_events_without_inventing_missing_measurements(self):
        metrics = summarize_execution_metrics(
            [
                [
                    {"event": "reply_attempt"},
                    {"event": "reply_attempt"},
                    {"event": "first_chunk", "elapsed_ms": 30},
                    {"event": "reply_completed", "elapsed_ms": 50, "request_id": "PRIVATE_ID"},
                ],
                [{"event": "reply_failed", "elapsed_ms": 10}],
                [{"event": "reply_attempt"}],
            ]
        )
        self.assertEqual(metrics["completion_rate"], 1 / 3)
        self.assertEqual(metrics["recovery_rate"], 1)
        self.assertEqual(metrics["mean_observed_attempts"], 1)
        self.assertEqual(metrics["ttft"], {"sample_count": 1, "p50_ms": 30, "p95_ms": 30})
        self.assertEqual(metrics["latency"]["p95_ms"], 50)
        self.assertEqual(metrics["incomplete_count"], 1)
        self.assertNotIn("PRIVATE_ID", json.dumps(metrics))
        self.assertIsNone(summarize_execution_metrics([])["completion_rate"])


class EvaluationRouteTests(unittest.TestCase):
    def setUp(self):
        app = FastAPI()
        app.include_router(evaluations.router, prefix="/api")
        self.client = TestClient(app)
        self.environment = patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"})
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.body = {
            "question": "SYNTHETIC_ALPHA 기술은?",
            "answer": "가상지원자님 Kotlin (1쪽)",
            "status": "completed",
            "resume_revision": 7,
            "ground_chunk_ids": ["x"],
        }
        self.context = ResumeReplyContext(
            [RetrievedGround("x", "1쪽", "v", 0.9, "Kotlin", "Kotlin")],
            7,
            ResumeSettings(Path("synthetic.pdf"), "가상지원자", "2026-10-01"),
            [ResumePage(1, "Kotlin")],
        )

    def test_debug_disabled_gate_runs_before_parsing_body(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"}):
            with patch("app.routes.evaluations.dolmen_rag_service") as factory:
                response = self.client.post(
                    "/api/evaluations/judge", content="PRIVATE_INVALID_JSON"
                )
        self.assertEqual(response.status_code, 404)
        factory.assert_not_called()
        self.assertNotIn("PRIVATE_INVALID_JSON", response.text)

    def test_invalid_oversized_and_extra_fields_never_echo_input(self):
        for body in (
            {**self.body, "answer": "PRIVATE_MARKER" * 13000},
            {**self.body, "api_key": "PRIVATE_MARKER"},
            {**self.body, "resume_revision": True},
        ):
            response = self.client.post("/api/evaluations/judge", json=body)
            self.assertIn(response.status_code, (413, 422))
            self.assertNotIn("PRIVATE_MARKER", response.text)

    def test_non_completed_and_private_answers_skip_model_and_retrieval(self):
        for body in (
            {**self.body, "status": "cancelled"},
            {**self.body, "question": "개인 연락처"},
        ):
            with patch("app.routes.evaluations.dolmen_rag_service") as factory:
                response = self.client.post("/api/evaluations/judge", json=body)
            self.assertEqual(response.json()["status"], "skipped")
            factory.assert_not_called()

    def test_changed_resume_or_forged_ground_ids_fail_before_model(self):
        for body in (
            {**self.body, "resume_revision": 6},
            {**self.body, "ground_chunk_ids": ["forged"]},
            {**self.body, "ground_chunk_ids": ["x", "x"]},
        ):
            with patch("app.routes.evaluations.dolmen_rag_service") as factory:
                factory.return_value.retrieve_reply_context.return_value = self.context
                with patch("app.routes.evaluations.get_dolmen_llm") as llm_factory:
                    response = self.client.post("/api/evaluations/judge", json=body)
            self.assertEqual(response.json()["reason"], "context_mismatch")
            llm_factory.assert_not_called()

    def test_retrieval_exception_uses_fixed_failure_without_private_exception(self):
        with patch(
            "app.routes.evaluations.dolmen_rag_service", side_effect=RuntimeError("PRIVATE")
        ):
            response = self.client.post("/api/evaluations/judge", json=self.body)
        self.assertEqual(response.json()["reason"], "evaluation_unavailable")
        self.assertNotIn("PRIVATE", response.text)

    def test_judge_rebuilds_current_selected_pages_and_sanitizes_question(self):
        selected_context = SimpleNamespace(
            status="ready",
            grounds=self.context.grounds,
            resume_pages=[ResumePage(2, "SYNTHETIC_ALPHA Kotlin Platform Engineering")],
        )
        with (
            patch("app.routes.evaluations.dolmen_rag_service") as factory,
            patch(
                "app.routes.evaluations.build_resume_context", return_value=selected_context
            ) as context_builder,
            patch("app.routes.evaluations.get_dolmen_llm") as llm_factory,
            patch(
                "app.routes.evaluations.judge_answer_once", return_value={"status": "completed"}
            ) as judge,
        ):
            factory.return_value.retrieve_reply_context.return_value = self.context
            response = self.client.post(
                "/api/evaluations/judge",
                json={
                    **self.body,
                    "question": "Ｋｏｔｌｉｎ",
                },
            )
        self.assertEqual(response.json()["status"], "completed")
        factory.return_value.retrieve_reply_context.assert_called_once_with("Ｋｏｔｌｉｎ", limit=5)
        context_builder.assert_called_once_with("Ｋｏｔｌｉｎ", self.context)
        judge.assert_called_once_with(
            "Kotlin",
            self.body["answer"],
            self.context.grounds,
            llm_factory.return_value,
            resume_pages=selected_context.resume_pages,
        )

    def test_judge_uses_generation_pages_when_question_sanitizing_changes_budget(self):
        original_question = "ALPHA" + " " * 1000 + "역할은?"
        alpha_text = "회사: ALPHA\n" + "A" * 500
        beta_text = "회사: BETA\n" + "B" * 500
        reply_context = ResumeReplyContext(
            [RetrievedGround("x", "등록 이력서 · 1쪽", "v", 0.9, "A" * 100, "A" * 500)],
            7,
            self.context.resume_settings,
            [ResumePage(1, alpha_text), ResumePage(2, beta_text)],
        )
        history = [
            SimpleNamespace(role="user", content="이전 질문"),
            SimpleNamespace(role="assistant", content="이전 답변 " * 300),
        ]
        with (
            patch.dict("os.environ", {"DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": "4900"}),
            patch("app.routes.evaluations.dolmen_rag_service") as factory,
            patch("app.routes.evaluations.get_dolmen_llm"),
            patch(
                "app.routes.evaluations.judge_answer_once", return_value={"status": "completed"}
            ) as judge,
        ):
            generation_context = build_resume_context(original_question, reply_context, history)
            replay_context = build_resume_context(original_question, reply_context)
            sanitized_context = build_resume_context(
                sanitize_resume_text(original_question), reply_context
            )
            self.assertEqual(generation_context.status, "ready")
            self.assertEqual([page.page_number for page in generation_context.resume_pages], [1])
            self.assertEqual(generation_context.history_messages, [])
            self.assertEqual(generation_context.resume_pages, replay_context.resume_pages)
            # 정제 질문으로 재구성하면 원래 예산에서 제외한 다른 회사 쪽까지 들어온다.
            self.assertEqual([page.page_number for page in sanitized_context.resume_pages], [1, 2])
            factory.return_value.retrieve_reply_context.return_value = reply_context
            response = self.client.post(
                "/api/evaluations/judge",
                json={
                    **self.body,
                    "question": original_question,
                    "answer": "가상지원자님은 BETA의 B 기술을 사용했습니다. (2쪽)",
                },
            )
        self.assertEqual(response.json()["status"], "completed")
        factory.return_value.retrieve_reply_context.assert_called_once_with(
            original_question, limit=5
        )
        self.assertEqual(judge.call_args.kwargs["resume_pages"], generation_context.resume_pages)
        self.assertNotIn(
            "BETA", "\n".join(page.text for page in judge.call_args.kwargs["resume_pages"])
        )
        self.assertEqual(judge.call_args.args[0], sanitize_resume_text(original_question))

    def test_context_over_budget_skips_judge_before_llm_access(self):
        with (
            patch("app.routes.evaluations.dolmen_rag_service") as factory,
            patch(
                "app.routes.evaluations.build_resume_context",
                return_value=SimpleNamespace(status="budget_exceeded"),
            ),
            patch("app.routes.evaluations.get_dolmen_llm") as llm_factory,
        ):
            factory.return_value.retrieve_reply_context.return_value = self.context
            response = self.client.post("/api/evaluations/judge", json=self.body)
        self.assertEqual(response.json()["reason"], "context_budget_exceeded")
        llm_factory.assert_not_called()


if __name__ == "__main__":
    unittest.main()
