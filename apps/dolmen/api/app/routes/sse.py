"""동기 응답 생성 중에도 SSE 연결을 유지하고 iterator를 순서대로 정리한다."""

import asyncio
from collections.abc import AsyncIterator, Iterator
from contextlib import suppress
from contextvars import copy_context

import anyio
from fastapi.responses import StreamingResponse
from starlette.types import Receive, Scope, Send

SSE_KEEP_ALIVE_SECONDS = 15.0
SSE_KEEP_ALIVE_COMMENT = ": keep-alive\n\n"


async def stream_sse_with_keep_alive(
    reply_events: Iterator[str], *, keep_alive_seconds: float = SSE_KEEP_ALIVE_SECONDS
) -> AsyncIterator[str]:
    """next 하나만 worker에서 실행하고 JSON 이벤트 사이의 유휴 시간에 comment를 보낸다."""
    loop = asyncio.get_running_loop()
    exhausted = object()
    pending_event = None
    try:
        while True:
            pending_event = loop.run_in_executor(
                None, copy_context().run, next, reply_events, exhausted
            )
            while True:
                completed, _ = await asyncio.wait({pending_event}, timeout=keep_alive_seconds)
                if completed:
                    break
                yield SSE_KEEP_ALIVE_COMMENT
            reply_event = pending_event.result()
            pending_event = None
            if reply_event is exhausted:
                return
            yield reply_event
    finally:
        was_cancelled_during_cleanup = False

        async def finish_worker_call(worker_future):
            nonlocal was_cancelled_during_cleanup
            while not worker_future.done():
                try:
                    await asyncio.shield(worker_future)
                except asyncio.CancelledError:
                    # 직접 Task.cancel()은 AnyIO shield도 통과한다. worker 완료 전
                    # close하지 않고 재대기한 뒤 cleanup 이후 취소를 다시 전파한다.
                    was_cancelled_during_cleanup = True
                except Exception:
                    break
            return worker_future.result()

        # http.disconnect는 AnyIO cancel scope를 반복 취소할 수 있다. 동기 SDK next를
        # 강제로 중단할 수 없으므로 끝날 때까지 기다린 다음 close하여 generator 경합과
        # SDK의 중단 턴 commit 이후 history rollback 순서 역전을 막는다.
        try:
            with anyio.CancelScope(shield=True):
                try:
                    if pending_event is not None:
                        # 이미 전달 중인 취소/오류를 뒤늦은 SDK 오류로 덮지 않는다.
                        with suppress(Exception):
                            await finish_worker_call(pending_event)
                finally:
                    close_events = getattr(reply_events, "close", None)
                    if callable(close_events):
                        await finish_worker_call(
                            loop.run_in_executor(None, copy_context().run, close_events)
                        )
        finally:
            if was_cancelled_during_cleanup:
                raise asyncio.CancelledError


class KeepAliveStreamingResponse(StreamingResponse):
    def __init__(
        self, reply_events: Iterator[str], *, keep_alive_seconds: float = SSE_KEEP_ALIVE_SECONDS
    ) -> None:
        self._reply_stream = stream_sse_with_keep_alive(
            reply_events, keep_alive_seconds=keep_alive_seconds
        )
        super().__init__(
            self._reply_stream,
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        try:
            await super().__call__(scope, receive, send)
        finally:
            # send 실패/취소는 async generator가 yield에서 멈춘 상태로 발생할 수 있다.
            # Starlette가 다음 값을 요청하지 않아도 SDK와 세션을 명시적으로 정리한다.
            with anyio.CancelScope(shield=True):
                await self._reply_stream.aclose()
