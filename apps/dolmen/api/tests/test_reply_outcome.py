"""native LangChain chunk 종료 사유와 요청별 usage의 안전한 전달 검증."""

import json
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

import httpx
from fastapi.testclient import TestClient
from langchain_core.messages import AIMessageChunk

from app.agent import (
    BuiltReplyDiagnostics,
    DolmenAgentService,
    DolmenOutputLimitError,
    build_reply_diagnostics,
)
from app.llm import LLMConfig, create_chat_model
from app.main import create_app
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage
from app.settings import ResumeSettings


class PerRequestFixtureLlm:
    model = "synthetic-fixture"
    provider = "fixture"

    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    @property
    def last_call_stats(self):
        raise AssertionError("공유 LLM stats를 읽으면 안 됩니다.")

    def stream(self, messages, **kwargs):
        self.calls.append(kwargs)
        response_chunk = self.responses.pop(0)
        if isinstance(response_chunk, Exception):
            raise response_chunk
        if response_chunk.content:
            yield AIMessageChunk(content=response_chunk.content)
        yield response_chunk.model_copy(update={"content": ""})


def response(text="가상지원자님은 Python을 사용했습니다. (1쪽)", reason="stop", usage=None):
    usage = usage or {}
    metadata = {"finish_reason": reason}
    native_usage = None
    if set(usage) == {"prompt_tokens", "completion_tokens", "total_tokens"}:
        native_usage = {
            "input_tokens": usage["prompt_tokens"],
            "output_tokens": usage["completion_tokens"],
            "total_tokens": usage["total_tokens"],
        }
    elif usage:
        metadata["token_usage"] = usage
    return AIMessageChunk(
        content=text,
        response_metadata=metadata,
        usage_metadata=native_usage,
        additional_kwargs={"reasoning_content": "PRIVATE_HIDDEN_REASONING"},
    )


def parse_events(http_response):
    return [
        json.loads(line[6:])
        for line in http_response.text.splitlines()
        if line.startswith("data: ")
    ]


class ReplyOutcomeTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(
            "os.environ",
            {
                "DOLMEN_DEBUG_ENABLED": "true",
                "DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": "32768",
                "DOLMEN_CONTEXT_OUTPUT_TOKEN_RESERVE": "2048",
            },
        )
        self.env.start()
        self.addCleanup(self.env.stop)
        self.settings = ResumeSettings(Path("private.pdf"), "가상지원자", "2026-09-27")
        self.ground = RetrievedGround(
            "synthetic", "등록 이력서 · 1쪽", "version", 0.9, "Python", "합성회사 Python"
        )
        self.context = ResumeReplyContext(
            [self.ground], 5, self.settings, [ResumePage(1, self.ground.content)]
        )
        self.client = TestClient(create_app())

    def post(self, service):
        with patch("app.routes.chat.dolmen_rag_service") as rag:
            rag.return_value.retrieve_reply_context.return_value = self.context
            with patch("app.routes.chat.dolmen_agent_service", return_value=service):
                return self.client.post(
                    "/api/chat",
                    json={
                        "message": "합성회사 기술은?",
                        "session_id": "session",
                    },
                )

    def test_real_sdk_output_limit_with_partial_or_empty_body_is_error_and_rolls_back(self):
        for text in ("", "불완전한 합성 답변"):
            with self.subTest(has_partial=bool(text)):
                llm = PerRequestFixtureLlm(
                    [
                        response(),
                        response(
                            text,
                            "length",
                            {
                                "prompt_tokens": 100,
                                "completion_tokens": 2048,
                                "total_tokens": 2148,
                            },
                        ),
                    ]
                )
                service = DolmenAgentService(llm)
                self.assertEqual(parse_events(self.post(service))[-1], {"type": "done"})
                original_history = [
                    message.content for message in service._history_by_session_id["session"]
                ]
                http_response = self.post(service)
                events = parse_events(http_response)
                self.assertEqual(
                    [event["type"] for event in events if event["type"] in {"done", "error"}],
                    ["error"],
                )
                failed = next(event for event in events if event.get("event") == "reply_failed")
                self.assertEqual(failed["details"]["reason"], "output_limit")
                metrics = next(event for event in events if event.get("event") == "reply_metrics")
                self.assertEqual(
                    metrics["details"],
                    {
                        "attempt": 1,
                        "run_status": "output_limit",
                        "stop_reason": "length",
                        "prompt_tokens": 100,
                        "completion_tokens": 2048,
                        "total_tokens": 2148,
                    },
                )
                self.assertEqual(
                    len([event for event in events if event["type"] == "chunk"]), int(bool(text))
                )
                self.assertEqual(
                    [message.content for message in service._history_by_session_id["session"]],
                    original_history,
                )
                self.assertEqual(service._active_sessions, set())
                self.assertNotIn("PRIVATE_HIDDEN_REASONING", http_response.text)
                self.assertEqual(len(llm.calls), 2)
                self.assertEqual(llm.calls[-1]["max_tokens"], 2048)

    def test_content_filter_with_sdk_completed_status_is_incomplete_error(self):
        service = DolmenAgentService(
            PerRequestFixtureLlm([response("일부 본문", "content_filter")])
        )
        events = parse_events(self.post(service))
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(metrics["details"]["run_status"], "completed")
        self.assertEqual(metrics["details"]["stop_reason"], "content_filter")
        failed = next(event for event in events if event.get("event") == "reply_failed")
        self.assertEqual(failed["details"]["reason"], "incomplete_reply")
        self.assertEqual(events[-1]["type"], "error")
        self.assertEqual(service._history_by_session_id["session"], [])

    def test_completed_usage_is_request_local_and_missing_values_are_not_zero_filled(self):
        llm = PerRequestFixtureLlm(
            [
                response(usage={"prompt_tokens": 12, "completion_tokens": 8, "total_tokens": 20}),
                response(usage={"completion_tokens": 4}),
            ]
        )
        service = DolmenAgentService(llm)
        first, second = parse_events(self.post(service)), parse_events(self.post(service))
        first_metrics = next(event for event in first if event.get("event") == "reply_metrics")
        second_metrics = next(event for event in second if event.get("event") == "reply_metrics")
        self.assertEqual(first_metrics["details"]["total_tokens"], 20)
        self.assertEqual(
            second_metrics["details"],
            {
                "attempt": 1,
                "run_status": "completed",
                "stop_reason": "stop",
                "completion_tokens": 4,
            },
        )
        self.assertEqual(first[-1], {"type": "done"})
        self.assertEqual(second[-1], {"type": "done"})

    def test_usage_and_stop_reason_allowlist_does_not_emit_raw_values(self):
        diagnostics = build_reply_diagnostics(
            SimpleNamespace(
                status="PRIVATE_STATUS",
                stop_reason="https://PRIVATE_URL",
                usage={
                    "prompt_tokens": True,
                    "completion_tokens": -1,
                    "total_tokens": 10**12,
                    "reasoning_tokens": "PRIVATE_REASONING",
                },
            )
        )
        self.assertEqual(diagnostics.details, {"run_status": "unknown", "stop_reason": "unknown"})
        diagnostics = build_reply_diagnostics(
            SimpleNamespace(
                status="completed",
                stop_reason=None,
                usage={"prompt_tokens": 0, "completion_tokens": "12", "total_tokens": 1.5},
            )
        )
        self.assertEqual(diagnostics.details, {"run_status": "completed", "prompt_tokens": 0})

    def test_failed_attempt_metrics_do_not_reuse_usage_or_failed_history_on_retry(self):
        overloaded = RuntimeError("PRIVATE_PROVIDER_ERROR")
        overloaded.code = "1305"
        llm = PerRequestFixtureLlm(
            [
                overloaded,
                response(usage={"prompt_tokens": 10, "completion_tokens": 2}),
            ]
        )
        with patch("app.routes.chat.time.sleep") as sleep:
            http_response = self.post(DolmenAgentService(llm))
        events = parse_events(http_response)
        metrics = [event["details"] for event in events if event.get("event") == "reply_metrics"]
        self.assertEqual(metrics[0], {"attempt": 1, "run_status": "failed"})
        self.assertEqual(
            metrics[1],
            {
                "attempt": 2,
                "run_status": "completed",
                "stop_reason": "stop",
                "prompt_tokens": 10,
                "completion_tokens": 2,
            },
        )
        histories = [
            event["context"]["history"]["available_turns"]
            for event in events
            if event.get("event") == "context_built"
        ]
        self.assertEqual(histories, [0, 0])
        self.assertEqual(events[-1], {"type": "done"})
        self.assertNotIn("PRIVATE_PROVIDER_ERROR", http_response.text)
        sleep.assert_called_once_with(4)

    def test_shared_model_diagnostics_are_not_read_or_used_for_current_outcome(self):
        class IsolatedLlm(PerRequestFixtureLlm):
            @property
            def last_run(self):
                raise AssertionError("공유 모델 결과를 읽으면 안 됩니다.")

        events = parse_events(self.post(DolmenAgentService(IsolatedLlm([response()]))))
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(
            metrics["details"], {"attempt": 1, "run_status": "completed", "stop_reason": "stop"}
        )
        self.assertEqual(events[-1], {"type": "done"})

    def test_missing_unknown_and_tool_call_finish_cannot_be_done(self):
        for finish_reason in (None, "unrecognized", "tool_calls"):
            with self.subTest(finish_reason=finish_reason):
                service = DolmenAgentService(PerRequestFixtureLlm([response(reason=finish_reason)]))
                events = parse_events(self.post(service))
                failed = next(event for event in events if event.get("event") == "reply_failed")
                self.assertEqual(failed["details"]["reason"], "incomplete_reply")
                self.assertEqual(events[-1]["type"], "error")
                self.assertEqual(service._history_by_session_id["session"], [])

    def test_native_usage_only_trailing_chunk_preserves_finish_and_input_output_mapping(self):
        model = Mock()
        model.stream.return_value = iter(
            [
                AIMessageChunk(content="가상지원자님 (1쪽)"),
                AIMessageChunk(content="", response_metadata={"finish_reason": "stop"}),
                AIMessageChunk(
                    content="",
                    usage_metadata={"input_tokens": 7, "output_tokens": 3, "total_tokens": 10},
                ),
            ]
        )
        events = parse_events(self.post(DolmenAgentService(model)))
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(
            metrics["details"],
            {
                "attempt": 1,
                "run_status": "completed",
                "stop_reason": "stop",
                "prompt_tokens": 7,
                "completion_tokens": 3,
                "total_tokens": 10,
            },
        )
        self.assertEqual(events[-1], {"type": "done"})

    def test_observed_output_limit_is_not_overwritten_by_later_stop_chunk(self):
        model = Mock()
        model.stream.return_value = iter(
            [
                AIMessageChunk(content="부분 답변", response_metadata={"finish_reason": "length"}),
                AIMessageChunk(content="", response_metadata={"finish_reason": "stop"}),
            ]
        )
        events = parse_events(self.post(DolmenAgentService(model)))
        failed = next(event for event in events if event.get("event") == "reply_failed")
        self.assertEqual(failed["details"]["reason"], "output_limit")
        self.assertEqual(events[-1]["type"], "error")

    def test_repeated_native_usage_snapshots_keep_latest_values_without_sum(self):
        model = Mock()
        model.stream.return_value = iter(
            [
                AIMessageChunk(
                    content="가상지원자님 ",
                    usage_metadata={"input_tokens": 1371, "output_tokens": 2, "total_tokens": 1373},
                ),
                AIMessageChunk(
                    content="Python 경험. (1쪽)",
                    usage_metadata={"input_tokens": 1371, "output_tokens": 8, "total_tokens": 1379},
                ),
                AIMessageChunk(
                    content="",
                    response_metadata={"finish_reason": "stop"},
                    usage_metadata={"input_tokens": 1371, "output_tokens": 8, "total_tokens": 1379},
                ),
                AIMessageChunk(
                    content="",
                    usage_metadata={
                        "input_tokens": 1371,
                        "output_tokens": 10,
                        "total_tokens": 1381,
                    },
                ),
                AIMessageChunk(content=""),
            ]
        )
        events = parse_events(self.post(DolmenAgentService(model)))
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(
            metrics["details"],
            {
                "attempt": 1,
                "run_status": "completed",
                "stop_reason": "stop",
                "prompt_tokens": 1371,
                "completion_tokens": 10,
                "total_tokens": 1381,
            },
        )
        self.assertEqual(events[-1], {"type": "done"})

    def test_native_sdk_transport_repeated_usage_is_counted_once_in_wire_metrics(self):
        stream_events = []
        for text, output_tokens, finish_reason in (
            ("가상지원자님 ", 2, None),
            ("Python 경험. (1쪽)", 8, None),
            ("", 8, "stop"),
        ):
            stream_events.append(
                {
                    "id": "synthetic",
                    "object": "chat.completion.chunk",
                    "created": 0,
                    "model": "synthetic-model",
                    "choices": [
                        {"index": 0, "delta": {"content": text}, "finish_reason": finish_reason}
                    ],
                    "usage": {
                        "prompt_tokens": 1371,
                        "completion_tokens": output_tokens,
                        "total_tokens": 1371 + output_tokens,
                    },
                }
            )
        stream_events.append(
            {
                "id": "synthetic",
                "object": "chat.completion.chunk",
                "created": 0,
                "model": "synthetic-model",
                "choices": [],
                "usage": {"prompt_tokens": 1371, "completion_tokens": 10, "total_tokens": 1381},
            }
        )
        sse_payload = (
            "".join(f"data: {json.dumps(event)}\n\n" for event in stream_events)
            + "data: [DONE]\n\n"
        )
        observed_requests = []

        def synthetic_transport(client, request, **kwargs):
            observed_requests.append(request)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=sse_payload,
                request=request,
            )

        model = create_chat_model(
            LLMConfig("synthetic-key", "synthetic-model", "https://synthetic.invalid/v1")
        )
        try:
            with patch.object(httpx.Client, "send", autospec=True, side_effect=synthetic_transport):
                events = parse_events(self.post(DolmenAgentService(model)))
        finally:
            model.root_client.close()
        self.assertEqual(len(observed_requests), 1)
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(
            metrics["details"],
            {
                "attempt": 1,
                "run_status": "completed",
                "stop_reason": "stop",
                "prompt_tokens": 1371,
                "completion_tokens": 10,
                "total_tokens": 1381,
            },
        )
        self.assertEqual(events[-1], {"type": "done"})

    def test_latest_partial_usage_snapshot_does_not_keep_previous_missing_token_fields(self):
        model = Mock()
        model.stream.return_value = iter(
            [
                AIMessageChunk(
                    content="가상지원자님 (1쪽)",
                    usage_metadata={"input_tokens": 100, "output_tokens": 8, "total_tokens": 108},
                ),
                AIMessageChunk(
                    content="",
                    response_metadata={
                        "finish_reason": "stop",
                        "token_usage": {"completion_tokens": 10},
                    },
                ),
                AIMessageChunk(content="", response_metadata={"token_usage": {"total_tokens": -1}}),
            ]
        )
        events = parse_events(self.post(DolmenAgentService(model)))
        metrics = next(event for event in events if event.get("event") == "reply_metrics")
        self.assertEqual(
            metrics["details"],
            {
                "attempt": 1,
                "run_status": "completed",
                "stop_reason": "stop",
                "completion_tokens": 10,
            },
        )

    def test_tool_call_payload_is_rejected_even_if_provider_reports_stop(self):
        model = Mock()
        model.stream.return_value = iter(
            [
                AIMessageChunk(
                    content="부분 답변",
                    tool_call_chunks=[
                        {"name": "unexpected_tool", "args": "{}", "id": "synthetic", "index": 0}
                    ],
                    response_metadata={"finish_reason": "stop"},
                )
            ]
        )
        service = DolmenAgentService(model)
        events = parse_events(self.post(service))
        failed = next(event for event in events if event.get("event") == "reply_failed")
        self.assertEqual(failed["details"]["reason"], "incomplete_reply")
        self.assertEqual(service._history_by_session_id["session"], [])

    def test_post_text_provider_failure_is_not_retried(self):
        def interrupted_stream(*args, **kwargs):
            yield AIMessageChunk(content="부분 답변")
            error = RuntimeError("PRIVATE_PROVIDER_ERROR")
            error.code = "1305"
            raise error

        model = Mock()
        model.stream.side_effect = interrupted_stream
        with patch("app.routes.chat.time.sleep") as sleep:
            events = parse_events(self.post(DolmenAgentService(model)))
        sleep.assert_not_called()
        model.stream.assert_called_once()
        self.assertEqual(events[-1]["type"], "error")
        self.assertEqual(len([event for event in events if event["type"] == "chunk"]), 1)

    def test_optional_metrics_failure_does_not_change_success_or_output_limit(self):
        for finish_reason, expected_terminal in (("stop", "done"), ("length", "error")):
            with self.subTest(finish_reason=finish_reason):
                service = DolmenAgentService(PerRequestFixtureLlm([response(reason=finish_reason)]))
                with patch(
                    "app.agent.build_reply_diagnostics", side_effect=RuntimeError("PRIVATE")
                ):
                    http_response = self.post(service)
                events = parse_events(http_response)
                self.assertEqual(events[-1]["type"], expected_terminal)
                self.assertNotIn("reply_metrics", [event.get("event") for event in events])
                self.assertNotIn("PRIVATE", http_response.text)

    def test_text_only_compatibility_filters_metrics_and_preserves_output_limit_error(self):
        service = DolmenAgentService(PerRequestFixtureLlm([response("partial", "max_tokens")]))
        chunks = []
        with self.assertRaises(DolmenOutputLimitError):
            for chunk in service.stream_assistant_reply(
                "session",
                "경력",
                [self.ground],
                self.settings,
                5,
                self.context.resume_pages,
            ):
                chunks.append(chunk)
        self.assertEqual(len(chunks), 1)
        self.assertIsInstance(chunks[0], str)
        self.assertFalse(any(isinstance(chunk, BuiltReplyDiagnostics) for chunk in chunks))


if __name__ == "__main__":
    unittest.main()
