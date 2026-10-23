"""실제 모델 없이 SSE 유휴 연결 유지와 disconnect 정리 경계를 검증한다."""

import asyncio
import json
import threading
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

from starlette.requests import ClientDisconnect

from app.agent import DolmenAgentService
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage
from app.routes.chat import ChatRequestBody, stream_chat_reply
from app.routes.sse import (
    SSE_KEEP_ALIVE_COMMENT,
    KeepAliveStreamingResponse,
    stream_sse_with_keep_alive,
)
from app.settings import ResumeSettings


class SSEKeepAliveTests(unittest.IsolatedAsyncioTestCase):
    async def test_delayed_next_emits_comments_without_parallel_or_repeated_next(self):
        release_reply = threading.Event()
        next_calls = []
        close_calls = []

        def delayed_reply_events():
            try:
                next_calls.append(threading.get_ident())
                if not release_reply.wait(2):
                    raise AssertionError("테스트가 worker를 해제하지 않았습니다.")
                yield 'data: {"type":"chunk","text":"합성 답변"}\n\n'
                next_calls.append(threading.get_ident())
                yield 'data: {"type":"done"}\n\n'
            finally:
                close_calls.append(threading.get_ident())

        reply_stream = stream_sse_with_keep_alive(
            delayed_reply_events(), keep_alive_seconds=0.005
        )
        try:
            self.assertEqual(await anext(reply_stream), SSE_KEEP_ALIVE_COMMENT)
            self.assertEqual(await anext(reply_stream), SSE_KEEP_ALIVE_COMMENT)
            self.assertEqual(len(next_calls), 1)
            self.assertNotEqual(next_calls[0], threading.get_ident())
            release_reply.set()
            frames = [frame async for frame in reply_stream]
        finally:
            release_reply.set()
            await reply_stream.aclose()
        self.assertEqual(
            [json.loads(frame[6:])["type"] for frame in frames if frame.startswith("data:")],
            ["chunk", "done"],
        )
        self.assertEqual(len(close_calls), 1)
        self.assertNotEqual(close_calls[0], threading.get_ident())

    async def test_iterator_error_propagates_after_prior_event_and_closes_once(self):
        closed = []

        def failing_reply_events():
            try:
                yield 'data: {"type":"sources","grounds":[]}\n\n'
                raise RuntimeError("synthetic iterator error")
            finally:
                closed.append(True)

        reply_stream = stream_sse_with_keep_alive(failing_reply_events())
        self.assertIn('"sources"', await anext(reply_stream))
        with self.assertRaisesRegex(RuntimeError, "synthetic iterator error"):
            await anext(reply_stream)
        await reply_stream.aclose()
        self.assertEqual(closed, [True])

    async def test_aclose_waits_for_blocked_next_before_closing_the_iterator(self):
        release_reply = threading.Event()
        closed = []

        def delayed_reply_events():
            try:
                if not release_reply.wait(2):
                    raise AssertionError("테스트가 worker를 해제하지 않았습니다.")
                yield "unconsumed reply"
            finally:
                closed.append(True)

        reply_stream = stream_sse_with_keep_alive(
            delayed_reply_events(), keep_alive_seconds=0.005
        )
        try:
            self.assertEqual(await anext(reply_stream), SSE_KEEP_ALIVE_COMMENT)
            close_task = asyncio.create_task(reply_stream.aclose())
            await asyncio.sleep(0)
            self.assertFalse(close_task.done())
            self.assertEqual(closed, [])
            release_reply.set()
            await close_task
        finally:
            release_reply.set()
            await reply_stream.aclose()
        self.assertEqual(closed, [True])

    async def test_send_failure_explicitly_closes_iterator_suspended_at_yield(self):
        closed = []

        def reply_events():
            try:
                yield 'data: {"type":"chunk","text":"partial"}\n\n'
                yield 'data: {"type":"done"}\n\n'
            finally:
                closed.append(True)

        async def send(message):
            if message["type"] == "http.response.body":
                raise OSError("synthetic disconnected socket")

        response = KeepAliveStreamingResponse(reply_events())
        with self.assertRaises(ClientDisconnect):
            await response({"type": "http", "asgi": {"spec_version": "2.4"}}, Mock(), send)
        self.assertEqual(closed, [True])

    async def test_repeated_task_cancellation_never_closes_an_executing_generator(self):
        release_reply = threading.Event()
        closed = threading.Event()

        def delayed_reply_events():
            try:
                if not release_reply.wait(2):
                    raise AssertionError("테스트가 worker를 해제하지 않았습니다.")
                yield "unconsumed reply"
            finally:
                closed.set()

        reply_stream = stream_sse_with_keep_alive(
            delayed_reply_events(), keep_alive_seconds=0.005
        )
        try:
            self.assertEqual(await anext(reply_stream), SSE_KEEP_ALIVE_COMMENT)
            pending_read = asyncio.create_task(anext(reply_stream))
            await asyncio.sleep(0)
            pending_read.cancel()
            await asyncio.sleep(0)
            pending_read.cancel()
            await asyncio.sleep(0)
            self.assertFalse(pending_read.done())
            self.assertFalse(closed.is_set())
            release_reply.set()
            with self.assertRaises(asyncio.CancelledError):
                await pending_read
        finally:
            release_reply.set()
            await reply_stream.aclose()
        self.assertTrue(closed.is_set())

    async def test_cancellation_during_worker_close_waits_for_cleanup_before_propagating(self):
        close_started = threading.Event()
        release_close = threading.Event()
        closed = threading.Event()

        def reply_events():
            try:
                yield "partial reply"
            finally:
                close_started.set()
                if not release_close.wait(2):
                    raise AssertionError("테스트가 close worker를 해제하지 않았습니다.")
                closed.set()

        reply_stream = stream_sse_with_keep_alive(reply_events())
        try:
            self.assertEqual(await anext(reply_stream), "partial reply")
            close_task = asyncio.create_task(reply_stream.aclose())
            self.assertTrue(await asyncio.to_thread(close_started.wait, 1))
            close_task.cancel()
            await asyncio.sleep(0)
            close_task.cancel()
            await asyncio.sleep(0)
            self.assertFalse(close_task.done())
            self.assertFalse(closed.is_set())
            release_close.set()
            with self.assertRaises(asyncio.CancelledError):
                await close_task
        finally:
            release_close.set()
            await reply_stream.aclose()
        self.assertTrue(closed.is_set())

    async def test_http_disconnect_waits_for_sdk_cleanup_then_restores_history_and_session(self):
        release_reply = threading.Event()
        sdk_closed = threading.Event()
        disconnect = asyncio.Event()
        saw_keep_alive = asyncio.Event()
        history = [
            SimpleNamespace(
                role="user",
                content=json.dumps({"untrusted_interviewer_question": "이전 정상 질문"},
                                   ensure_ascii=False),
            ),
            SimpleNamespace(role="assistant", content="이전 정상 답변"),
        ]
        original_history = list(history)
        fake_agent = Mock(last_run=None)
        fake_agent.get_history.side_effect = lambda: list(history)
        fake_agent.clear_history.side_effect = history.clear
        fake_agent.add_message.side_effect = history.append

        def delayed_model_reply(prompt, **kwargs):
            try:
                if not release_reply.wait(2):
                    raise AssertionError("테스트가 SDK를 해제하지 않았습니다.")
                yield "취소 직후 반환된 미완료 답변"
            finally:
                history.extend([
                    SimpleNamespace(role="user", content=prompt),
                    SimpleNamespace(role="assistant", content="SDK_SYNTHETIC_INTERRUPTED"),
                ])
                sdk_closed.set()

        fake_agent.stream_run.side_effect = delayed_model_reply
        agent_service = DolmenAgentService(Mock())
        agent_service._resume_revision = 1
        agent_service._agents_by_session_id["session"] = fake_agent
        ground = RetrievedGround("chunk", "등록 이력서 · 1쪽", "version", 0.9, "합성", "합성 경력")
        reply_context = ResumeReplyContext(
            [ground], 1, ResumeSettings(Path("private.pdf"), "합성지원자", "2026-09-27"),
            [ResumePage(1, ground.content)],
        )
        frames = []

        async def receive():
            await disconnect.wait()
            return {"type": "http.disconnect"}

        async def send(message):
            if message["type"] == "http.response.body":
                frames.append(message["body"].decode())
                if frames[-1] == SSE_KEEP_ALIVE_COMMENT:
                    saw_keep_alive.set()

        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"}):
            with patch("app.routes.chat.dolmen_rag_service") as rag_factory:
                rag_factory.return_value.retrieve_reply_context.return_value = reply_context
                with patch("app.routes.chat.dolmen_agent_service", return_value=agent_service):
                    with patch(
                        "app.routes.chat.KeepAliveStreamingResponse",
                        side_effect=lambda events: KeepAliveStreamingResponse(
                            events, keep_alive_seconds=0.005
                        ),
                    ):
                        response = await stream_chat_reply(
                            ChatRequestBody(message="합성 경력은?", session_id="session")
                        )
                    response_task = asyncio.create_task(response(
                        {"type": "http", "asgi": {"spec_version": "2.3"}}, receive, send
                    ))
                    try:
                        await asyncio.wait_for(saw_keep_alive.wait(), timeout=1)
                        self.assertEqual(agent_service._active_sessions, {(1, "session")})
                        disconnect.set()
                        # AnyIO의 level cancellation이 전달된 뒤에도 cleanup은 보호된다.
                        await asyncio.sleep(0.01)
                        self.assertFalse(response_task.done())
                        self.assertFalse(sdk_closed.is_set())
                        release_reply.set()
                        await asyncio.wait_for(response_task, timeout=1)
                    finally:
                        release_reply.set()
                        disconnect.set()
                        await response_task
        self.assertTrue(sdk_closed.is_set())
        self.assertEqual(agent_service._active_sessions, set())
        self.assertEqual(
            [(message.role, message.content) for message in history],
            [(message.role, message.content) for message in original_history],
        )
        self.assertNotIn("SDK_SYNTHETIC", str(history))
        self.assertEqual(
            [json.loads(frame[6:])["type"] for frame in frames if frame.startswith("data:")],
            ["sources"],
        )


if __name__ == "__main__":
    unittest.main()
