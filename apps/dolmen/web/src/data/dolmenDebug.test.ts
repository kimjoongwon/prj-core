// @vitest-environment node
import { expect, it } from "vitest";
import { TEST_REQUEST_ID } from "../test/dolmenFixtures";
import { parseDolmenDebugEvent } from "./dolmenDebug";

function metricsFrame(details: Record<string, unknown>) {
	return {
		type: "debug",
		event: "reply_metrics",
		request_id: TEST_REQUEST_ID,
		elapsed_ms: 12,
		details,
	};
}
it("실제 제공된 토큰만 보관하고 0과 미수집을 구분한다", () => {
	expect(
		parseDolmenDebugEvent(
			metricsFrame({
				attempt: 1,
				run_status: "output_limit",
				stop_reason: "length",
				prompt_tokens: 0,
				completion_tokens: 100,
				raw_prompt: "비공개",
			}),
		)?.details,
	).toEqual({
		attempt: 1,
		run_status: "output_limit",
		stop_reason: "length",
		prompt_tokens: 0,
		completion_tokens: 100,
	});
	expect(
		parseDolmenDebugEvent(metricsFrame({ attempt: 2, run_status: "unknown" }))
			?.details,
	).not.toHaveProperty("total_tokens");
});
it.each([
	{ attempt: 0.5, run_status: "completed" },
	{ attempt: 1, run_status: "raw exception" },
	{ run_status: "completed" },
])("잘못된 필수 실행 상태는 무시한다 %#", (details) => {
	expect(parseDolmenDebugEvent(metricsFrame(details))).toBeUndefined();
});
it("잘못된 optional 숫자와 종료 사유는 합성하지 않는다", () => {
	expect(
		parseDolmenDebugEvent(
			metricsFrame({
				attempt: 1,
				run_status: "completed",
				stop_reason: "private detail",
				prompt_tokens: -1,
				completion_tokens: 2.5,
				total_tokens: Number.MAX_SAFE_INTEGER + 1,
			}),
		)?.details,
	).toEqual({ attempt: 1, run_status: "completed" });
});
