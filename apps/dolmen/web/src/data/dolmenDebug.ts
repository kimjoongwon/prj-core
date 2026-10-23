import {
	type DolmenContextSnapshot,
	parseDolmenContextSnapshot,
} from "./dolmenContext";
import {
	type DolmenRuleEvaluation,
	parseDolmenRuleEvaluation,
} from "./dolmenEvaluationClient";

/** 개발 모드에서 서버가 공개한 관측 정보만 소비한다. */
export const DOLMEN_DEBUG_EVENT_NAMES = [
	"request_received",
	"retrieval_started",
	"context_ready",
	"reply_attempt",
	"retry_scheduled",
	"first_chunk",
	"reply_completed",
	"reply_failed",
	"context_built",
	"answer_evaluated",
	"reply_metrics",
] as const;

export const DOLMEN_RUN_STATUSES = [
	"completed",
	"output_limit",
	"max_iterations",
	"cancelled",
	"budget_exhausted",
	"failed",
	"running",
	"unknown",
] as const;
export const DOLMEN_STOP_REASONS = [
	"stop",
	"length",
	"max_tokens",
	"max_output_tokens",
	"tool_calls",
	"content_filter",
	"unknown",
] as const;
export interface DolmenReplyMetrics {
	attempt: number;
	runStatus: (typeof DOLMEN_RUN_STATUSES)[number];
	stopReason?: (typeof DOLMEN_STOP_REASONS)[number];
	promptTokens?: number;
	completionTokens?: number;
	totalTokens?: number;
}
const TOKEN_DETAIL_KEYS = new Set([
	"prompt_tokens",
	"completion_tokens",
	"total_tokens",
]);

export interface DolmenDebugEvent {
	event: (typeof DOLMEN_DEBUG_EVENT_NAMES)[number];
	elapsedMs: number;
	requestId: string;
	details: Record<string, string | number | boolean>;
	context?: DolmenContextSnapshot;
	evaluation?: DolmenRuleEvaluation;
}

export interface DolmenClientObservation {
	event:
		| "request_sent"
		| "sources_received"
		| "status_received"
		| "first_chunk_received"
		| "done_received"
		| "error_received"
		| "cancelled";
	elapsedMs: number;
}

const NUMERIC_DETAIL_KEYS = new Set([
	"retrieval_limit",
	"revision",
	"page_count",
	"context_characters",
	"retrieved_count",
	"attempt",
	"next_attempt",
	"backoff_seconds",
	"chunk_characters",
	"attempts",
	"reply_characters",
]);
const ENUM_DETAIL_VALUES: Record<string, readonly string[]> = {
	answer_path: ["model", "private_refusal", "no_evidence"],
	run_status: DOLMEN_RUN_STATUSES,
	stop_reason: DOLMEN_STOP_REASONS,
	stage: ["retrieval", "configuration", "context", "reply"],
	reason: [
		"resume_not_configured",
		"resume_not_ready",
		"llm_not_configured",
		"model_initialization_failed",
		"empty_reply",
		"reply_error",
		"context_budget_exceeded",
		"output_limit",
		"incomplete_reply",
	],
	error_category: [
		"rate_limit",
		"overloaded",
		"timeout",
		"authentication",
		"connection",
		"provider_error",
		"unknown",
	],
};

export function parseDolmenDebugEvent(
	streamEvent: Record<string, unknown>,
): DolmenDebugEvent | undefined {
	if (
		!DOLMEN_DEBUG_EVENT_NAMES.includes(
			streamEvent.event as DolmenDebugEvent["event"],
		) ||
		typeof streamEvent.elapsed_ms !== "number" ||
		!Number.isFinite(streamEvent.elapsed_ms) ||
		streamEvent.elapsed_ms < 0 ||
		typeof streamEvent.request_id !== "string" ||
		!/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(
			streamEvent.request_id,
		) ||
		!streamEvent.details ||
		typeof streamEvent.details !== "object" ||
		Array.isArray(streamEvent.details)
	)
		return undefined;
	if (streamEvent.event === "reply_metrics") {
		const metrics = streamEvent.details as Record<string, unknown>;
		if (
			typeof metrics.attempt !== "number" ||
			!Number.isSafeInteger(metrics.attempt) ||
			metrics.attempt < 0 ||
			!DOLMEN_RUN_STATUSES.includes(
				metrics.run_status as (typeof DOLMEN_RUN_STATUSES)[number],
			)
		)
			return undefined;
	}
	const context =
		streamEvent.event === "context_built"
			? parseDolmenContextSnapshot(streamEvent.context)
			: undefined;
	const evaluation =
		streamEvent.event === "answer_evaluated"
			? parseDolmenRuleEvaluation(streamEvent.evaluation)
			: undefined;
	if (
		(streamEvent.event === "context_built" && !context) ||
		(streamEvent.event === "answer_evaluated" && !evaluation)
	)
		return undefined;
	const details: DolmenDebugEvent["details"] = {};
	for (const [detailKey, detailValue] of Object.entries(streamEvent.details)) {
		if (
			NUMERIC_DETAIL_KEYS.has(detailKey) &&
			typeof detailValue === "number" &&
			Number.isFinite(detailValue) &&
			detailValue >= 0
		)
			details[detailKey] = detailValue;
		if (
			TOKEN_DETAIL_KEYS.has(detailKey) &&
			typeof detailValue === "number" &&
			Number.isSafeInteger(detailValue) &&
			detailValue >= 0
		)
			details[detailKey] = detailValue;
		if (
			typeof detailValue === "string" &&
			Object.hasOwn(ENUM_DETAIL_VALUES, detailKey) &&
			ENUM_DETAIL_VALUES[detailKey]?.includes(detailValue)
		)
			details[detailKey] = detailValue;
		if (
			detailKey === "provider_code" &&
			typeof detailValue === "number" &&
			Number.isInteger(detailValue) &&
			detailValue >= 0 &&
			detailValue <= 999999
		)
			details[detailKey] = detailValue;
		if (
			detailKey === "http_status" &&
			typeof detailValue === "number" &&
			Number.isInteger(detailValue) &&
			detailValue >= 100 &&
			detailValue <= 599
		)
			details[detailKey] = detailValue;
	}
	return {
		event: streamEvent.event as DolmenDebugEvent["event"],
		elapsedMs: streamEvent.elapsed_ms,
		requestId: streamEvent.request_id,
		details,
		...(context ? { context } : {}),
		...(evaluation ? { evaluation } : {}),
	};
}

export interface DolmenResumeDebugSection {
	documentId: string;
	source: string;
	version: string;
	characterCount: number;
	snippet: string;
}

export interface DolmenResumeDebug {
	pageCount?: number;
	sanitizedCharacterCount?: number;
	embeddingModel?: string;
	retrievalLimit?: number;
	contextPolicy?: string;
	privacyFilterVersion?: string;
	indexVersion?: string;
	modelId?: string;
	historyTurnLimit?: number;
	sessionLimit?: number;
	sections?: DolmenResumeDebugSection[];
}

export function parseDolmenResumeDebug(
	debugBody: unknown,
): DolmenResumeDebug | undefined {
	if (!debugBody || typeof debugBody !== "object" || Array.isArray(debugBody))
		return undefined;
	const debugFields = debugBody as Record<string, unknown>;
	const debug: DolmenResumeDebug = {};
	for (const [apiKey, uiKey] of Object.entries({
		page_count: "pageCount",
		sanitized_character_count: "sanitizedCharacterCount",
		retrieval_limit: "retrievalLimit",
		history_turn_limit: "historyTurnLimit",
		session_limit: "sessionLimit",
	} as const)) {
		const numericField = debugFields[apiKey];
		if (
			typeof numericField === "number" &&
			Number.isInteger(numericField) &&
			numericField >= 0
		)
			debug[uiKey] = numericField;
	}
	for (const [apiKey, uiKey] of Object.entries({
		embedding_model: "embeddingModel",
		context_policy: "contextPolicy",
		privacy_filter_version: "privacyFilterVersion",
		index_version: "indexVersion",
		model_id: "modelId",
	} as const)) {
		if (typeof debugFields[apiKey] === "string")
			debug[uiKey] = debugFields[apiKey];
	}
	if (Array.isArray(debugFields.sections)) {
		const parsedSections = debugFields.sections.flatMap((section: unknown) => {
			if (!section || typeof section !== "object") return [];
			const sectionFields = section as Record<string, unknown>;
			if (
				typeof sectionFields.document_id !== "string" ||
				typeof sectionFields.source !== "string" ||
				typeof sectionFields.version !== "string" ||
				typeof sectionFields.snippet !== "string" ||
				typeof sectionFields.character_count !== "number" ||
				!Number.isInteger(sectionFields.character_count) ||
				sectionFields.character_count < 0
			)
				return [];
			return [
				{
					documentId: sectionFields.document_id,
					source: sectionFields.source,
					version: sectionFields.version,
					characterCount: sectionFields.character_count,
					snippet: sectionFields.snippet,
				},
			];
		});
		if (parsedSections.length === debugFields.sections.length)
			debug.sections = parsedSections;
	}
	return debug;
}
