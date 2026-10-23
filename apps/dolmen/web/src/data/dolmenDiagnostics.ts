import type { DolmenAgentActivity } from "./dolmenChatClient";
import {
	DOLMEN_RUN_STATUSES,
	DOLMEN_STOP_REASONS,
	type DolmenReplyMetrics,
} from "./dolmenDebug";
export function getActivityContext(activity: DolmenAgentActivity) {
	return activity.debugEvents.findLast((event) => event.context)?.context;
}
export function getActivityRuleEvaluation(activity: DolmenAgentActivity) {
	return activity.debugEvents.findLast((event) => event.evaluation)?.evaluation;
}
/** 시도별 마지막 보고만 남긴다. 재시도 사이의 토큰은 합산하지 않는다. */
export function getActivityReplyMetrics(
	activity: DolmenAgentActivity,
): DolmenReplyMetrics[] {
	const metricsByAttempt = new Map<number, DolmenReplyMetrics>();
	for (const event of activity.debugEvents) {
		if (event.event !== "reply_metrics") continue;
		const details = event.details;
		if (
			typeof details.attempt !== "number" ||
			!Number.isSafeInteger(details.attempt) ||
			details.attempt < 0 ||
			!DOLMEN_RUN_STATUSES.includes(
				details.run_status as DolmenReplyMetrics["runStatus"],
			)
		)
			continue;
		const metrics: DolmenReplyMetrics = {
			attempt: details.attempt,
			runStatus: details.run_status as DolmenReplyMetrics["runStatus"],
		};
		if (
			DOLMEN_STOP_REASONS.includes(
				details.stop_reason as NonNullable<DolmenReplyMetrics["stopReason"]>,
			)
		)
			metrics.stopReason =
				details.stop_reason as DolmenReplyMetrics["stopReason"];
		for (const [wireKey, uiKey] of Object.entries({
			prompt_tokens: "promptTokens",
			completion_tokens: "completionTokens",
			total_tokens: "totalTokens",
		} as const)) {
			const tokenCount = details[wireKey];
			if (
				typeof tokenCount === "number" &&
				Number.isSafeInteger(tokenCount) &&
				tokenCount >= 0
			)
				metrics[uiKey] = tokenCount;
		}
		metricsByAttempt.set(metrics.attempt, metrics);
	}
	return [...metricsByAttempt.values()];
}
function hasReportedTokens(metrics: DolmenReplyMetrics): boolean {
	return (
		metrics.promptTokens !== undefined ||
		metrics.completionTokens !== undefined ||
		metrics.totalTokens !== undefined
	);
}
export function getActivityMeasurements(activity: DolmenAgentActivity) {
	const firstServerChunk = activity.debugEvents.find(
		(event) => event.event === "first_chunk",
	);
	const serverTerminal = activity.debugEvents.findLast(
		(event) =>
			event.event === "reply_completed" || event.event === "reply_failed",
	);
	const clientTerminal = activity.clientObservations.findLast((observation) =>
		["done_received", "error_received", "cancelled"].includes(
			observation.event,
		),
	);
	const attempts = activity.debugEvents
		.filter((event) => event.event === "reply_attempt")
		.map((event) => event.details.attempt)
		.filter((attempt): attempt is number => typeof attempt === "number");
	return {
		serverTtftMs: firstServerChunk?.elapsedMs,
		serverTotalMs: serverTerminal?.elapsedMs,
		clientTtftMs: activity.clientObservations.find(
			(event) => event.event === "first_chunk_received",
		)?.elapsedMs,
		clientTotalMs: clientTerminal?.elapsedMs,
		attempts: attempts.length ? Math.max(...attempts) : undefined,
	};
}
export function getJudgeUnavailableReason(
	activity: DolmenAgentActivity,
	answer: string,
): string {
	if (activity.phase === "error" || activity.phase === "cancelled")
		return "오류·취소된 답변은 LLM 평가 대상이 아닙니다.";
	if (activity.phase !== "done")
		return "정상 완료된 답변에서만 평가할 수 있습니다.";
	if (activity.questionText.length > 4000 || answer.length > 12000)
		return "평가 입력 한도(질문 4,000자·답변 12,000자)를 초과했습니다.";
	if (
		activity.retrievedEvidence.length > 5 ||
		activity.retrievedEvidence.some(
			(ground) =>
				typeof ground.chunkId !== "string" || ground.chunkId.length > 160,
		)
	)
		return "평가 근거 입력 한도를 초과했습니다.";
	if (!answer.trim()) return "평가할 답변 본문이 없습니다.";
	const answerPath = activity.debugEvents.findLast(
		(event) => event.event === "reply_attempt",
	)?.details.answer_path;
	if (answerPath === "private_refusal" || answerPath === "no_evidence")
		return "개인정보 보호·근거 없음 응답은 LLM 평가 대상이 아닙니다.";
	const context = getActivityContext(activity);
	if (!context) return "컨텍스트 미수신 · 개발 수집 꺼짐 또는 API 미지원";
	if (context.status !== "ready")
		return "입력 예산을 초과한 요청은 평가하지 않습니다.";
	return "";
}
/** 현재 브라우저의 검증된 진단만 내보낸다. 질문·답변 본문과 세션 ID는 제외한다. */
export function serializeDolmenDiagnostics(
	activities: DolmenAgentActivity[],
): string {
	return JSON.stringify(
		{
			version: "dolmen-browser-diagnostics-v1",
			scope: "current_browser_only",
			actualTokenUsage: activities.some((activity) =>
				getActivityReplyMetrics(activity).some(hasReportedTokens),
			)
				? { source: "provider_reported", aggregation: "per_attempt_no_sum" }
				: "not_collected",
			requests: activities.map((activity) => ({
				activityId: activity.activityId,
				requestId: activity.debugEvents[0]?.requestId ?? null,
				phase: activity.phase,
				replyCharacterCount: activity.replyCharacterCount,
				measurements: getActivityMeasurements(activity),
				replyMetrics: getActivityReplyMetrics(activity),
				serverEvents: activity.debugEvents,
				clientObservations: activity.clientObservations,
				judgeEvaluation: activity.judgeEvaluation,
			})),
		},
		null,
		2,
	);
}
