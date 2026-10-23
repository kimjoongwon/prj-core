export const CONTEXT_PACKET_REASONS = [
	"required_system",
	"required_query",
	"full_resume_retained",
	"selected_resume_group",
	"resume_group_budget",
	"recent_history",
	"history_turn_limit",
	"history_budget",
	"duplicate_history",
	"duplicate_resume_ground",
] as const;
export interface DolmenContextSnapshot {
	version: "gssc-v1";
	status: "ready" | "budget_exceeded";
	revision: number;
	policy: "full_sanitized_resume" | "selected_resume_groups";
	estimator: "utf8_bytes_upper_bound_v1";
	budget: {
		inputLimit: number;
		outputReserve: number;
		estimatedInputTokens: number;
		remainingInputTokens: number;
	};
	stages: {
		stage: "gather" | "select" | "structure" | "compress";
		inputCount: number;
		outputCount: number;
	}[];
	packets: {
		packetId: string;
		kind: "system" | "query" | "resume" | "history" | "retrieval";
		source: string;
		selected: boolean;
		reason: (typeof CONTEXT_PACKET_REASONS)[number];
		estimatedTokens: number;
		characterCount: number;
		snippet?: string;
	}[];
	history: {
		availableTurns: number;
		selectedTurns: number;
		droppedTurns: number;
		deduplicatedTurns: number;
	};
}
function isRecord(field: unknown): field is Record<string, unknown> {
	return !!field && typeof field === "object" && !Array.isArray(field);
}
function isCount(field: unknown): field is number {
	return typeof field === "number" && Number.isInteger(field) && field >= 0;
}

/** 알 수 없는 구조를 저장하지 않고 검증된 관측 snapshot만 반환한다. */
export function parseDolmenContextSnapshot(
	context: unknown,
): DolmenContextSnapshot | undefined {
	if (
		!isRecord(context) ||
		context.version !== "gssc-v1" ||
		!["ready", "budget_exceeded"].includes(String(context.status)) ||
		!isCount(context.revision) ||
		!["full_sanitized_resume", "selected_resume_groups"].includes(
			String(context.policy),
		) ||
		context.estimator !== "utf8_bytes_upper_bound_v1" ||
		!isRecord(context.budget) ||
		!isRecord(context.history) ||
		!Array.isArray(context.stages) ||
		!Array.isArray(context.packets)
	)
		return undefined;
	const budget = context.budget;
	const history = context.history;
	if (
		![
			budget.input_limit,
			budget.output_reserve,
			budget.estimated_input_tokens,
			budget.remaining_input_tokens,
			history.available_turns,
			history.selected_turns,
			history.dropped_turns,
			history.deduplicated_turns,
		].every(isCount)
	)
		return undefined;
	const stages: DolmenContextSnapshot["stages"] = [];
	for (const [index, stage] of context.stages.entries()) {
		if (
			!isRecord(stage) ||
			stage.stage !== ["gather", "select", "structure", "compress"][index] ||
			!isCount(stage.input_count) ||
			!isCount(stage.output_count)
		)
			return undefined;
		stages.push({
			stage: stage.stage as DolmenContextSnapshot["stages"][number]["stage"],
			inputCount: stage.input_count,
			outputCount: stage.output_count,
		});
	}
	if (stages.length !== 4) return undefined;
	const packets: DolmenContextSnapshot["packets"] = [];
	for (const packet of context.packets) {
		if (
			!isRecord(packet) ||
			typeof packet.packet_id !== "string" ||
			!/^(system|query|resume-group-\d+|history-turn-\d+|retrieval-\d+)$/.test(
				packet.packet_id,
			) ||
			!["system", "query", "resume", "history", "retrieval"].includes(
				String(packet.kind),
			) ||
			typeof packet.source !== "string" ||
			packet.source.length > 80 ||
			typeof packet.selected !== "boolean" ||
			!CONTEXT_PACKET_REASONS.includes(
				packet.reason as (typeof CONTEXT_PACKET_REASONS)[number],
			) ||
			!isCount(packet.estimated_tokens) ||
			!isCount(packet.character_count)
		)
			return undefined;
		if (
			packet.kind === "resume" &&
			typeof packet.snippet === "string" &&
			Array.from(packet.snippet).length > 220
		)
			return undefined;
		packets.push({
			packetId: packet.packet_id,
			kind: packet.kind as DolmenContextSnapshot["packets"][number]["kind"],
			source: packet.source,
			selected: packet.selected,
			reason: packet.reason as (typeof CONTEXT_PACKET_REASONS)[number],
			estimatedTokens: packet.estimated_tokens,
			characterCount: packet.character_count,
			...(packet.kind === "resume" && typeof packet.snippet === "string"
				? { snippet: packet.snippet }
				: {}),
		});
	}
	return {
		version: "gssc-v1",
		status: context.status as DolmenContextSnapshot["status"],
		revision: context.revision,
		policy: context.policy as DolmenContextSnapshot["policy"],
		estimator: context.estimator,
		budget: {
			inputLimit: budget.input_limit as number,
			outputReserve: budget.output_reserve as number,
			estimatedInputTokens: budget.estimated_input_tokens as number,
			remainingInputTokens: budget.remaining_input_tokens as number,
		},
		stages,
		packets,
		history: {
			availableTurns: history.available_turns as number,
			selectedTurns: history.selected_turns as number,
			droppedTurns: history.dropped_turns as number,
			deduplicatedTurns: history.deduplicated_turns as number,
		},
	};
}
