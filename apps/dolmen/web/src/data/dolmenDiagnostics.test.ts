// @vitest-environment node
import { expect, it } from "vitest";
import {
	activityFixture,
	contextWireFixture,
	TEST_REQUEST_ID,
} from "../test/dolmenFixtures";
import { parseDolmenContextSnapshot } from "./dolmenContext";
import {
	getActivityMeasurements,
	getActivityReplyMetrics,
	getJudgeUnavailableReason,
	serializeDolmenDiagnostics,
} from "./dolmenDiagnostics";

it("관측한 서버/브라우저 시간만 별도로 계산하고 미수집을 0으로 만들지 않는다", () => {
	const activity = activityFixture();
	expect(getActivityMeasurements(activity).serverTtftMs).toBeUndefined();
	activity.debugEvents = [
		{
			event: "first_chunk",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 0,
			details: {},
		},
		{
			event: "reply_attempt",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 1,
			details: { attempt: 2 },
		},
		{
			event: "reply_completed",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 30,
			details: {},
		},
	];
	activity.clientObservations = [
		{ event: "first_chunk_received", elapsedMs: 5 },
		{ event: "done_received", elapsedMs: 40 },
	];
	expect(getActivityMeasurements(activity)).toEqual({
		serverTtftMs: 0,
		serverTotalMs: 30,
		clientTtftMs: 5,
		clientTotalMs: 40,
		attempts: 2,
	});
});
it("진단 JSON에서 질문/답변 원문·상태 오류·세션을 제외한다", () => {
	const activity = activityFixture();
	activity.debugEvents = [
		{
			event: "context_built",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 1,
			details: {},
			context: parseDolmenContextSnapshot(contextWireFixture()),
		},
	];
	const serialized = serializeDolmenDiagnostics([activity]);
	expect(serialized).toContain("합성 테스트의 정제 발췌");
	expect(serialized).not.toMatch(
		/내보내지 않는|questionText|assistantMessageId|sessionId|raw_prompt/,
	);
	expect(JSON.parse(serialized).requests).toHaveLength(1);
});
it("구 API·미완료·긴 답변은 평가할 수 없으며 정상 context만 허용한다", () => {
	const activity = activityFixture();
	expect(getJudgeUnavailableReason(activity, "본문")).toMatch(/미수신/);
	activity.debugEvents = [
		{
			event: "context_built",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 1,
			details: {},
			context: parseDolmenContextSnapshot(contextWireFixture()),
		},
	];
	expect(getJudgeUnavailableReason(activity, "본문")).toBe("");
	expect(getJudgeUnavailableReason(activity, "a".repeat(12001))).toMatch(
		/한도/,
	);
	activity.phase = "cancelled";
	expect(getJudgeUnavailableReason(activity, "본문")).toMatch(/오류·취소/);
});

it("시도별 마지막 제공자 보고를 합산하지 않고 JSON 사용량 출처를 바로잡는다", () => {
	const activity = activityFixture();
	const frame = (attempt: number, totalTokens?: number) => ({
		event: "reply_metrics" as const,
		elapsedMs: 1,
		requestId: TEST_REQUEST_ID,
		details: {
			attempt,
			run_status: "completed",
			...(totalTokens !== undefined ? { total_tokens: totalTokens } : {}),
		},
	});
	activity.debugEvents = [frame(1, 10), frame(1, 12), frame(2)];
	expect(getActivityReplyMetrics(activity)).toEqual([
		{ attempt: 1, runStatus: "completed", totalTokens: 12 },
		{ attempt: 2, runStatus: "completed" },
	]);
	const exported = JSON.parse(serializeDolmenDiagnostics([activity]));
	expect(exported.actualTokenUsage).toEqual({
		source: "provider_reported",
		aggregation: "per_attempt_no_sum",
	});
	expect(exported.requests[0].replyMetrics[1]).not.toHaveProperty(
		"totalTokens",
	);
	activity.debugEvents = [frame(1)];
	expect(
		JSON.parse(serializeDolmenDiagnostics([activity])).actualTokenUsage,
	).toBe("not_collected");
});
