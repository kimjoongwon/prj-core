"""HTTP·SSE 공개 계약과 등록본/모델 실패 시 차단 동작 검증."""

import json
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from fastapi.testclient import TestClient

from app.agent import DolmenAgentService
from app.main import create_app
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage, ResumeUnavailableError
from app.settings import ResumeSettings


def parse_sse_events(response):
    return [
        json.loads(event_line.removeprefix("data: "))
        for event_line in response.text.splitlines()
        if event_line.startswith("data: ")
    ]


class ResumeRouteTests(unittest.TestCase):
    def setUp(self):
        debug_env = patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"})
        debug_env.start()
        self.addCleanup(debug_env.stop)
        self.client = TestClient(create_app())
        self.settings = ResumeSettings(Path("private.pdf"), "가상지원자", "2026-09-27")
        self.reply_context = ResumeReplyContext(
            [RetrievedGround("chunk", "등록 이력서 · 2쪽", "version", 0.9,
                             "정제된 공개 발췌", "정제된 공개 근거 본문")],
            7, self.settings, [ResumePage(2, "정제된 공개 근거 본문")],
        )

    def test_only_read_status_and_chat_are_exposed(self):
        self.assertEqual(self.client.post("/api/documents", json={}).status_code, 405)
        self.assertEqual(self.client.post("/api/demo-doc/seed").status_code, 404)
        self.assertEqual(self.client.post("/api/search", json={}).status_code, 404)
        self.assertEqual(self.client.get("/private/resume.pdf").status_code, 404)

    def test_status_failure_preserves_stable_code_and_does_not_fake_ready(self):
        for error_code in ("resume_not_configured", "resume_not_ready"):
            with self.subTest(error_code=error_code):
                with patch("app.routes.documents.dolmen_rag_service") as rag_factory:
                    rag_factory.return_value.read_document_status.side_effect = (
                        ResumeUnavailableError(error_code, "안전한 안내")
                    )
                    response = self.client.get("/api/documents")
                self.assertEqual(response.status_code, 503)
                self.assertEqual(response.json(), {
                    "detail": {"code": error_code, "message": "안전한 안내"}
                })
                self.assertNotIn("resume_ready", response.json())

    def test_resume_failure_emits_only_error_and_never_constructs_model(self):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.side_effect = ResumeUnavailableError(
                "resume_not_ready", "등록 이력서 준비 실패"
            )
            with patch("app.routes.chat.dolmen_agent_service") as agent_factory:
                response = self.client.post("/api/chat", json={
                    "message": "경력은?", "session_id": "synthetic-session"
                })
        self.assertEqual(parse_sse_events(response), [
            {"type": "error", "message": "등록 이력서 준비 실패"}
        ])
        agent_factory.assert_not_called()

    def test_sse_sources_chunks_done_preserve_contract_without_full_content(self):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.return_value = self.reply_context
            with patch("app.routes.chat.dolmen_agent_service") as agent_factory:
                agent_factory.return_value.stream_assistant_reply_events.return_value = iter([
                    "가상지원자님은 ", "개발 경험이 있습니다. (2쪽)"
                ])
                response = self.client.post("/api/chat", json={
                    "message": "경력은?", "session_id": "synthetic-session"
                })
        stream_events = parse_sse_events(response)
        self.assertEqual([event["type"] for event in stream_events], [
            "sources", "chunk", "chunk", "done"
        ])
        self.assertEqual(set(stream_events[0]["grounds"][0]), {
            "chunk_id", "source", "version", "score", "snippet"
        })
        self.assertNotIn("정제된 공개 근거 본문", response.text)
        self.assertTrue(response.headers["content-type"].startswith("text/event-stream"))
        self.assertEqual(response.headers["x-accel-buffering"], "no")
        agent_factory.return_value.stream_assistant_reply_events.assert_called_once_with(
            "synthetic-session", "경력은?", self.reply_context.grounds, self.settings, 7,
            self.reply_context.resume_pages
        )

    def test_provider_exception_never_echoes_prompt_or_private_data(self):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.return_value = self.reply_context
            with patch("app.routes.chat.dolmen_agent_service") as agent_factory:
                agent_factory.return_value.stream_assistant_reply_events.side_effect = RuntimeError(
                    "PRIVATE_PROVIDER_EXCEPTION"
                )
                response = self.client.post("/api/chat", json={
                    "message": "경력은?", "session_id": "synthetic-session"
                })
        stream_events = parse_sse_events(response)
        self.assertEqual(stream_events[-1]["type"], "error")
        self.assertNotIn("PRIVATE_PROVIDER_EXCEPTION", response.text)
        self.assertNotIn("done", [event["type"] for event in stream_events])

    def test_rate_limit_before_first_chunk_preserves_status_retry_event(self):
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.return_value = self.reply_context
            agent_service = Mock()
            agent_service.stream_assistant_reply_events.side_effect = [
                RuntimeError("rate limit"), iter(["재시도 답변"])
            ]
            with patch("app.routes.chat.dolmen_agent_service", return_value=agent_service):
                with patch("app.routes.chat.time.sleep") as sleep:
                    response = self.client.post("/api/chat", json={
                        "message": "경력은?", "session_id": "synthetic-session"
                    })
        stream_events = parse_sse_events(response)
        self.assertEqual([event["type"] for event in stream_events], [
            "sources", "status", "chunk", "done"
        ])
        sleep.assert_called_once_with(4)

    def test_real_agent_empty_reply_has_error_terminal_without_prefix_or_done(self):
        for model_chunks in ([], [" ", "\n"]):
            with self.subTest(model_chunks=model_chunks):
                agent_service = DolmenAgentService(Mock())
                with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
                    rag_factory.return_value.retrieve_reply_context.return_value = (
                        self.reply_context
                    )
                    with patch("app.routes.chat.dolmen_agent_service", return_value=agent_service):
                        with patch("app.agent.SimpleAgent") as agent_factory:
                            agent_factory.return_value.stream_run.return_value = model_chunks
                            response = self.client.post("/api/chat", json={
                                "message": "경력은?", "session_id": "synthetic-session"
                            })
                stream_events = parse_sse_events(response)
                self.assertEqual([event["type"] for event in stream_events], ["sources", "error"])
                self.assertNotIn("작성 이력서 기준입니다", response.text)

    def test_retry_with_real_agent_emits_date_once_in_first_answer_chunk(self):
        agent_service = DolmenAgentService(Mock())
        with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
            rag_factory.return_value.retrieve_reply_context.return_value = self.reply_context
            with patch("app.routes.chat.dolmen_agent_service", return_value=agent_service):
                with patch("app.agent.SimpleAgent") as agent_factory:
                    agent_factory.return_value.stream_run.side_effect = [
                        RuntimeError("rate limit"), ["경력 소개입니다."]
                    ]
                    with patch("app.routes.chat.time.sleep"):
                        response = self.client.post("/api/chat", json={
                            "message": "경력은?", "session_id": "synthetic-session"
                        })
        stream_events = parse_sse_events(response)
        self.assertEqual([event["type"] for event in stream_events], [
            "sources", "status", "chunk", "done"
        ])
        self.assertEqual(stream_events[2]["text"],
                         "2026-09-27 작성 이력서 기준입니다.\n\n경력 소개입니다.")
        self.assertEqual(response.text.count("작성 이력서 기준입니다"), 1)

    def test_health_keeps_llm_configuration_fields(self):
        with patch("app.routes.chat.missing_llm_env_names", return_value=["LLM_API_KEY"]):
            response = self.client.get("/api/health")
        self.assertEqual(response.json(), {
            "status": "ok", "llm_configured": False, "missing_llm_env": ["LLM_API_KEY"]
        })


if __name__ == "__main__":
    unittest.main()
