"""개발 관측의 허용 필드·오류 분류·실제 처리 분기와 실패 격리 검증."""

import json
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
from uuid import UUID

from fastapi.testclient import TestClient

from app.agent import DolmenAgentService, DolmenConfigError
from app.debug import ChatDebugTrace, safe_error_details
from app.main import create_app
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage, ResumeUnavailableError
from app.settings import ResumeSettings, read_debug_model_id


def sse_events(response):
    return [
        json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")
    ]


class DebugPolicyTests(unittest.TestCase):
    def test_disabled_trace_does_not_generate_identifiers_or_events(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"}):
            with patch("app.debug.uuid.uuid4") as issue_request_id:
                trace = ChatDebugTrace()
                self.assertEqual(trace.emit("request_received"), ())
        issue_request_id.assert_not_called()

    def test_trace_has_monotonic_milliseconds_uuid_and_allowlisted_details(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"}):
            with patch("app.debug.time.monotonic", side_effect=[10, 10.002, 10.001]):
                trace = ChatDebugTrace()
                first = json.loads(trace.emit("reply_attempt", attempt=1, answer_path="model",
                                              raw_exception="PRIVATE_EXCEPTION")[0][6:])
                second = json.loads(trace.emit("reply_failed", stage="reply", attempt=1,
                                               reason="reply_error", error_category="unknown",
                                               provider_code=123456789, http_status=999,
                                               message="PRIVATE_MESSAGE")[0][6:])
        UUID(first["request_id"])
        self.assertEqual(first["request_id"], second["request_id"])
        self.assertEqual(first["elapsed_ms"], 2.0)
        self.assertGreaterEqual(second["elapsed_ms"], first["elapsed_ms"])
        self.assertEqual(first["details"], {"attempt": 1, "answer_path": "model"})
        self.assertNotIn("provider_code", second["details"])
        self.assertNotIn("http_status", second["details"])
        self.assertNotIn("PRIVATE", json.dumps([first, second]))

    def test_trace_clock_and_construction_errors_are_silent(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"}):
            with patch("app.debug.uuid.uuid4", side_effect=RuntimeError("PRIVATE_UUID")):
                self.assertEqual(ChatDebugTrace().emit("request_received"), ())
            with patch("app.debug.time.monotonic", side_effect=[1, RuntimeError("PRIVATE_CLOCK")]):
                self.assertEqual(ChatDebugTrace().emit("request_received"), ())

    def test_only_safe_model_identifiers_are_visible(self):
        for unsafe_model_id in (
            "https://private.invalid/v1", "/private/server/model", "C:/private/model",
            "sk-PRIVATE_SECRET", "model\nPRIVATE", "model\n", "model@private", "a" * 161,
        ):
            with self.subTest(unsafe_model_id=unsafe_model_id):
                with patch.dict("os.environ", {"LLM_MODEL_ID": unsafe_model_id}):
                    self.assertEqual(read_debug_model_id(), "")
        with patch.dict("os.environ", {"LLM_MODEL_ID": "synthetic/model-v1:latest"}):
            self.assertEqual(read_debug_model_id(), "synthetic/model-v1:latest")

    def test_safe_provider_metadata_excludes_raw_body_message_and_headers(self):
        error = RuntimeError("PRIVATE_EXCEPTION https://private.invalid")
        error.status_code = 429
        error.body = {"error": {"code": "1305", "message": "PRIVATE_BODY"}}
        error.headers = {"authorization": "PRIVATE_KEY"}
        self.assertEqual(safe_error_details(error), {
            "error_category": "overloaded", "http_status": 429, "provider_code": 1305
        })
        self.assertEqual(safe_error_details(RuntimeError("PRIVATE_UNKNOWN")), {
            "error_category": "unknown"
        })
        self.assertEqual(safe_error_details(RuntimeError("error code: '1302'")), {
            "error_category": "rate_limit", "provider_code": 1302
        })
        self.assertEqual(safe_error_details(TimeoutError("PRIVATE_TIMEOUT")), {
            "error_category": "timeout"
        })

    def test_separate_traces_never_share_request_ids(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"}):
            first = json.loads(ChatDebugTrace().emit("request_received")[0][6:])
            second = json.loads(ChatDebugTrace().emit("request_received")[0][6:])
        self.assertNotEqual(first["request_id"], second["request_id"])


class DebugRouteTests(unittest.TestCase):
    def setUp(self):
        debug_env = patch.dict("os.environ", {
            "DOLMEN_DEBUG_ENABLED": "true", "LLM_MODEL_ID": "synthetic-model"
        })
        debug_env.start()
        self.addCleanup(debug_env.stop)
        self.client = TestClient(create_app())
        self.settings = ResumeSettings(Path("private.pdf"), "가상지원자", "2026-09-27")
        self.context = ResumeReplyContext(
            [RetrievedGround("chunk", "등록 이력서 · 1쪽", "version", 0.8,
                             "공개 발췌", "전체 정제 근거")],
            9, self.settings, [ResumePage(1, "전체 정제 근거")],
        )

    def post_chat(self, agent_service, message="경력은?"):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.return_value = self.context
            with patch("app.routes.chat.dolmen_agent_service", return_value=agent_service):
                return self.client.post("/api/chat", json={
                    "message": message, "session_id": "PRIVATE_SESSION_ID"
                })

    def test_normal_debug_event_order_metadata_and_original_terminal_contract(self):
        agent_service = Mock()
        agent_service.stream_assistant_reply.return_value = iter(["첫 조각", "다음 조각"])
        response = self.post_chat(agent_service)
        events = sse_events(response)
        self.assertEqual([event.get("event", event["type"]) for event in events], [
            "request_received", "retrieval_started", "context_ready", "sources",
            "reply_attempt", "first_chunk", "chunk", "chunk", "reply_completed", "done",
        ])
        debug_events = [event for event in events if event["type"] == "debug"]
        self.assertEqual(len({event["request_id"] for event in debug_events}), 1)
        self.assertEqual([event["elapsed_ms"] for event in debug_events],
                         sorted(event["elapsed_ms"] for event in debug_events))
        self.assertEqual(debug_events[2]["details"], {
            "revision": 9, "page_count": 1, "context_characters": len("전체 정제 근거"),
            "retrieved_count": 1, "retrieval_limit": 5,
        })
        self.assertEqual(debug_events[-1]["details"]["reply_characters"], len("첫 조각다음 조각"))
        self.assertNotIn("PRIVATE_SESSION_ID", response.text)
        self.assertNotIn("전체 정제 근거", response.text)
        self.assertEqual(events[-1], {"type": "done"})

    def test_retrieval_failure_has_no_attempt_or_completion_and_one_error(self):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.side_effect = ResumeUnavailableError(
                "resume_not_configured", "등록 이력서 없음"
            )
            with patch("app.routes.chat.dolmen_agent_service") as agent_factory:
                response = self.client.post(
                    "/api/chat", json={"message": "경력?", "session_id": "s"}
                )
        events = sse_events(response)
        self.assertEqual([event.get("event", event["type"]) for event in events], [
            "request_received", "retrieval_started", "reply_failed", "error",
        ])
        self.assertEqual(events[-2]["details"]["reason"], "resume_not_configured")
        agent_factory.assert_not_called()

    def test_configuration_failure_uses_safe_reason_without_raw_exception(self):
        for exception, expected_reason in (
            (DolmenConfigError("PRIVATE_CONFIG https://private.invalid"), "llm_not_configured"),
            (RuntimeError("PRIVATE_PROVIDER_INIT"), "model_initialization_failed"),
        ):
            with self.subTest(expected_reason=expected_reason):
                with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
                    rag_factory.return_value.retrieve_reply_context.return_value = self.context
                    with patch("app.routes.chat.dolmen_agent_service", side_effect=exception):
                        response = self.client.post(
                            "/api/chat", json={"message": "경력?", "session_id": "s"}
                        )
                events = sse_events(response)
                self.assertEqual(events[-2]["event"], "reply_failed")
                self.assertEqual(events[-2]["details"]["reason"], expected_reason)
                self.assertEqual(events[-2]["details"]["stage"], "configuration")
                self.assertEqual(events[-1]["type"], "error")
                self.assertNotIn("reply_attempt", [event.get("event") for event in events])
                self.assertNotIn("PRIVATE", response.text)
                self.assertNotIn("private.invalid", response.text)

    def test_local_guards_are_not_reported_as_model_attempts(self):
        for question, grounds, expected_path in (
            ("연봉과 주소는?", self.context.grounds, "private_refusal"),
            ("없는 경력은?", [], "no_evidence"),
        ):
            with self.subTest(expected_path=expected_path):
                self.context = ResumeReplyContext(
                    grounds, 9, self.settings, self.context.resume_pages
                )
                with patch("app.agent.SimpleAgent") as model_factory:
                    response = self.post_chat(DolmenAgentService(Mock()), question)
                events = sse_events(response)
                attempt = next(event for event in events if event.get("event") == "reply_attempt")
                self.assertEqual(attempt["details"]["answer_path"], expected_path)
                self.assertEqual(events[-1]["type"], "done")
                model_factory.assert_not_called()

    def test_retry_metadata_comes_from_actual_retry_branch_and_first_chunk_is_once(self):
        error = RuntimeError("PRIVATE_PROVIDER_BODY")
        error.code = "1305"
        error.status_code = 429
        agent_service = Mock()
        agent_service.stream_assistant_reply.side_effect = [error, iter(["재시도 답변"])]
        with patch("app.routes.chat.time.sleep") as sleep:
            response = self.post_chat(agent_service)
        events = sse_events(response)
        names = [event.get("event", event["type"]) for event in events]
        self.assertEqual(names, [
            "request_received", "retrieval_started", "context_ready", "sources", "reply_attempt",
            "retry_scheduled", "status", "reply_attempt", "first_chunk", "chunk",
            "reply_completed", "done",
        ])
        retry = next(event for event in events if event.get("event") == "retry_scheduled")
        self.assertEqual(retry["details"], {
            "attempt": 1, "next_attempt": 2, "backoff_seconds": 4,
            "error_category": "overloaded", "provider_code": 1305, "http_status": 429,
        })
        self.assertEqual(names.count("first_chunk"), 1)
        self.assertEqual(names.count("done"), 1)
        self.assertNotIn("PRIVATE_PROVIDER_BODY", response.text)
        sleep.assert_called_once_with(4)

    def test_empty_model_reply_has_failed_debug_before_error_and_no_first_chunk(self):
        with patch("app.agent.SimpleAgent") as model_factory:
            model_factory.return_value.stream_run.return_value = ["", " ", "\n"]
            response = self.post_chat(DolmenAgentService(Mock()))
        events = sse_events(response)
        names = [event.get("event", event["type"]) for event in events]
        self.assertEqual(names[-2:], ["reply_failed", "error"])
        self.assertNotIn("first_chunk", names)
        self.assertNotIn("reply_completed", names)
        self.assertNotIn("done", names)
        self.assertEqual(events[-2]["details"]["reason"], "empty_reply")

    def test_trace_factory_or_emit_failure_cannot_change_answer_or_terminal(self):
        for failure_mode in ("factory", "emit"):
            with self.subTest(failure_mode=failure_mode):
                agent_service = Mock()
                agent_service.stream_assistant_reply.return_value = iter(["답변 유지"])
                with patch("app.routes.chat.ChatDebugTrace") as trace_factory:
                    if failure_mode == "factory":
                        trace_factory.side_effect = RuntimeError("PRIVATE_TRACE_FACTORY")
                    else:
                        trace_factory.return_value.emit.side_effect = RuntimeError("PRIVATE_TRACE")
                    response = self.post_chat(agent_service)
                self.assertEqual(sse_events(response), [
                    {"type": "sources", "grounds": [{
                        "chunk_id": "chunk", "source": "등록 이력서 · 1쪽", "version": "version",
                        "score": 0.8, "snippet": "공개 발췌",
                    }]},
                    {"type": "chunk", "text": "답변 유지"}, {"type": "done"},
                ])

    def test_partial_answer_failure_does_not_retry_or_emit_completed(self):
        def partial_reply(*_):
            yield "실제 첫 조각"
            raise RuntimeError("rate limit PRIVATE_EXCEPTION")

        agent_service = Mock()
        agent_service.stream_assistant_reply.side_effect = partial_reply
        with patch("app.routes.chat.time.sleep") as sleep:
            response = self.post_chat(agent_service)
        events = sse_events(response)
        names = [event.get("event", event["type"]) for event in events]
        self.assertEqual(names[-2:], ["reply_failed", "error"])
        self.assertNotIn("retry_scheduled", names)
        self.assertNotIn("reply_completed", names)
        self.assertEqual(names.count("first_chunk"), 1)
        self.assertEqual(names.count("error"), 1)
        self.assertNotIn("PRIVATE_EXCEPTION", response.text)
        sleep.assert_not_called()


if __name__ == "__main__":
    unittest.main()
