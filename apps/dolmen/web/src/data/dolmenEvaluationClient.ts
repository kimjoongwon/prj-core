export const RULE_CHECK_NAMES = [
	"non_empty",
	"citations_present",
	"citations_match",
	"third_person",
	"no_private_information",
] as const;
export interface DolmenRuleEvaluation {
	kind: "deterministic_checks";
	status: "completed" | "skipped";
	checks: {
		name: (typeof RULE_CHECK_NAMES)[number];
		status: "passed" | "failed" | "skipped";
		reason: string;
	}[];
	disclaimer: string;
}
export const JUDGE_DIMENSIONS = [
	"groundedness",
	"relevance",
	"completeness",
] as const;
const JUDGE_REASONS = [
	"completed",
	"evaluation_unavailable",
	"non_completed_answer",
	"private_question",
	"no_evidence",
	"context_mismatch",
	"invalid_judge_output",
	"provider_error",
	"timeout",
	"unsupported_provider",
	"sanitized_empty",
	"content_too_long",
	"input_budget_exceeded",
	"context_budget_exceeded",
] as const;
export interface DolmenJudgeEvaluation {
	kind: "llm_judge";
	status: "completed" | "skipped" | "failed";
	scores: Record<(typeof JUDGE_DIMENSIONS)[number], number> | null;
	reasons: Record<(typeof JUDGE_DIMENSIONS)[number], string> | null;
	reason: (typeof JUDGE_REASONS)[number];
	disclaimer: string;
	modelId: string;
}
function isRecord(field: unknown): field is Record<string, unknown> {
	return !!field && typeof field === "object" && !Array.isArray(field);
}
export function parseDolmenRuleEvaluation(
	evaluation: unknown,
): DolmenRuleEvaluation | undefined {
	if (
		!isRecord(evaluation) ||
		evaluation.kind !== "deterministic_checks" ||
		!["completed", "skipped"].includes(String(evaluation.status)) ||
		typeof evaluation.disclaimer !== "string" ||
		!Array.isArray(evaluation.checks)
	)
		return undefined;
	const checks: DolmenRuleEvaluation["checks"] = [];
	for (const check of evaluation.checks) {
		if (
			!isRecord(check) ||
			!RULE_CHECK_NAMES.includes(
				check.name as (typeof RULE_CHECK_NAMES)[number],
			) ||
			!["passed", "failed", "skipped"].includes(String(check.status)) ||
			typeof check.reason !== "string" ||
			check.reason.length > 500 ||
			checks.some((existing) => existing.name === check.name)
		)
			return undefined;
		checks.push({
			name: check.name as (typeof RULE_CHECK_NAMES)[number],
			status: check.status as "passed" | "failed" | "skipped",
			reason: check.reason,
		});
	}
	return {
		kind: "deterministic_checks",
		status: evaluation.status as "completed" | "skipped",
		checks,
		disclaimer: evaluation.disclaimer.slice(0, 500),
	};
}
export function parseDolmenJudgeEvaluation(
	evaluation: unknown,
): DolmenJudgeEvaluation | undefined {
	if (
		!isRecord(evaluation) ||
		evaluation.kind !== "llm_judge" ||
		!["completed", "skipped", "failed"].includes(String(evaluation.status)) ||
		!JUDGE_REASONS.includes(
			evaluation.reason as (typeof JUDGE_REASONS)[number],
		) ||
		typeof evaluation.disclaimer !== "string" ||
		typeof evaluation.model_id !== "string"
	)
		return undefined;
	let scores: DolmenJudgeEvaluation["scores"] = null;
	let reasons: DolmenJudgeEvaluation["reasons"] = null;
	if (evaluation.status === "completed") {
		if (!isRecord(evaluation.scores) || !isRecord(evaluation.reasons))
			return undefined;
		scores = {} as NonNullable<DolmenJudgeEvaluation["scores"]>;
		reasons = {} as NonNullable<DolmenJudgeEvaluation["reasons"]>;
		for (const dimension of JUDGE_DIMENSIONS) {
			const score = evaluation.scores[dimension];
			const reason = evaluation.reasons[dimension];
			if (
				typeof score !== "number" ||
				!Number.isInteger(score) ||
				score < 1 ||
				score > 5 ||
				typeof reason !== "string" ||
				reason.length > 240
			)
				return undefined;
			scores[dimension] = score;
			reasons[dimension] = reason;
		}
	} else if (evaluation.scores !== null || evaluation.reasons !== null)
		return undefined;
	return {
		kind: "llm_judge",
		status: evaluation.status as DolmenJudgeEvaluation["status"],
		scores,
		reasons,
		reason: evaluation.reason as DolmenJudgeEvaluation["reason"],
		disclaimer: evaluation.disclaimer.slice(0, 500),
		modelId: evaluation.model_id.slice(0, 120),
	};
}
export interface DolmenJudgeInput {
	question: string;
	answer: string;
	status: "completed";
	resumeRevision: number;
	groundChunkIds: string[];
}
export class DolmenJudgeRequestError extends Error {}
export async function judgeDolmenAnswer(
	input: DolmenJudgeInput,
	signal: AbortSignal,
): Promise<DolmenJudgeEvaluation> {
	const response = await fetch("/dolmen/api/evaluations/judge", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		signal,
		body: JSON.stringify({
			question: input.question,
			answer: input.answer,
			status: input.status,
			resume_revision: input.resumeRevision,
			ground_chunk_ids: input.groundChunkIds,
		}),
	});
	if (!response.ok)
		throw new DolmenJudgeRequestError(
			response.status === 404
				? "평가를 사용할 수 없습니다. 개발 수집 설정 또는 API 지원을 확인해 주세요."
				: "평가 요청을 완료하지 못했습니다. 잠시 후 다시 실행해 주세요.",
		);
	const evaluation = parseDolmenJudgeEvaluation(await response.json());
	if (!evaluation)
		throw new DolmenJudgeRequestError("평가 응답 형식을 확인할 수 없습니다.");
	return evaluation;
}
