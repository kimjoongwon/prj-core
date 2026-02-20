export type StudioEventType =
	| "run.started"
	| "run.completed"
	| "run.failed"
	| "tool.call.started"
	| "tool.call.completed"
	| "tool.call.failed"
	| "subagent.started"
	| "subagent.completed"
	| "subagent.failed"
	| "skill.loaded";

export interface StudioEvent {
	id: string;
	runId: string;
	timestamp: number;
	type: StudioEventType;
	payload: Record<string, unknown>;
}

export interface StudioRun {
	id: string;
	prompt: string;
	createdAt: number;
	updatedAt: number;
	status: "running" | "completed" | "failed";
	sessionId?: string;
	resultText?: string;
	error?: string;
	events: StudioEvent[];
}
