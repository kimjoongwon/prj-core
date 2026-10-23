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
] as const;

export interface DolmenDebugEvent {
	event: (typeof DOLMEN_DEBUG_EVENT_NAMES)[number];
	elapsedMs: number;
	requestId: string;
	details: Record<string, string | number | boolean>;
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
	stage: ["retrieval", "configuration", "reply"],
	reason: [
		"resume_not_configured",
		"resume_not_ready",
		"llm_not_configured",
		"model_initialization_failed",
		"empty_reply",
		"reply_error",
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
