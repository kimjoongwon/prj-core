import { EventEmitter } from "node:events";
import { getOpencodeContext, opencodeRequest } from "./opencode-adapter";
import type { StudioEvent, StudioRun } from "./types";

interface ToolPart {
	id: string;
	type: "tool";
	callID: string;
	tool: string;
	state: {
		status: "pending" | "running" | "completed" | "error";
		input: Record<string, unknown>;
		output?: string;
		error?: string;
	};
}

interface TextPart {
	type: "text";
	text: string;
}

type MessagePart =
	| ToolPart
	| TextPart
	| { type: string; [key: string]: unknown };

interface SessionMessage {
	info: {
		id: string;
		role: "user" | "assistant";
		time?: {
			created?: number;
		};
	};
	parts: MessagePart[];
}

interface RunState {
	run: StudioRun;
	seenPartState: Set<string>;
}

class RunManager {
	private readonly emitter = new EventEmitter();
	private readonly runs = new Map<string, RunState>();
	private isPolling = false;

	constructor() {
		setInterval(() => {
			void this.pollSessions();
		}, 1200);
		void this.pollSessions();
	}

	listRuns() {
		return Array.from(this.runs.values())
			.map((entry) => entry.run)
			.sort((a, b) => b.createdAt - a.createdAt);
	}

	onEvent(handler: (event: StudioEvent) => void) {
		this.emitter.on("event", handler);
		return () => {
			this.emitter.off("event", handler);
		};
	}

	private async pollSessions() {
		if (this.isPolling) {
			return;
		}
		this.isPolling = true;

		try {
			const context = await getOpencodeContext();
			const statuses = await opencodeRequest<Record<string, { type: string }>>({
				path: "/session/status",
				method: "GET",
				directory: context.projectDirectory,
			});

			const sessionIds = Object.keys(statuses);

			for (const sessionId of sessionIds) {
				const messages = await opencodeRequest<SessionMessage[]>({
					path: `/session/${sessionId}/message?limit=120`,
					method: "GET",
					directory: context.projectDirectory,
				});

				const state = this.ensureRun(sessionId, messages);
				this.consumeMessageParts(state, messages);

				const assistantText = extractAssistantText(messages);
				if (assistantText) {
					state.run.resultText = assistantText;
				}

				const statusType = statuses[sessionId]?.type;
				const nextStatus =
					statusType === "error"
						? "failed"
						: statusType === "idle"
							? "completed"
							: "running";
				if (state.run.status !== nextStatus) {
					state.run.status = nextStatus;
					state.run.updatedAt = Date.now();
					if (nextStatus === "completed") {
						this.pushEvent(state.run.id, "run.completed", {
							text: state.run.resultText ?? "",
						});
					}
					if (nextStatus === "failed") {
						this.pushEvent(state.run.id, "run.failed", {
							error: state.run.error ?? "Run failed",
						});
					}
				}
			}
		} catch {
			return;
		} finally {
			this.isPolling = false;
		}
	}

	private ensureRun(sessionId: string, messages: SessionMessage[]) {
		const existing = this.runs.get(sessionId);
		if (existing) {
			return existing;
		}

		const now = Date.now();
		const run: StudioRun = {
			id: sessionId,
			prompt: extractRunPrompt(messages) || sessionId,
			createdAt: extractFirstMessageTime(messages) ?? now,
			updatedAt: now,
			status: "running",
			sessionId,
			events: [],
		};

		const nextState: RunState = {
			run,
			seenPartState: new Set(),
		};

		this.runs.set(sessionId, nextState);
		this.pushEvent(run.id, "run.started", { prompt: run.prompt });
		return nextState;
	}

	private consumeMessageParts(state: RunState, messages: SessionMessage[]) {
		for (const message of messages) {
			for (const part of message.parts) {
				if (part.type !== "tool") {
					continue;
				}
				const toolPart = part as ToolPart;

				const signature = `${message.info.id}:${toolPart.id}:${toolPart.state.status}`;
				if (state.seenPartState.has(signature)) {
					continue;
				}
				state.seenPartState.add(signature);

				const payload = {
					messageId: message.info.id,
					callId: toolPart.callID,
					tool: toolPart.tool,
					input: toolPart.state.input,
				};

				if (
					toolPart.state.status === "pending" ||
					toolPart.state.status === "running"
				) {
					this.pushEvent(state.run.id, "tool.call.started", payload);
					if (toolPart.tool === "task") {
						this.pushEvent(state.run.id, "subagent.started", {
							...payload,
							agent: String(toolPart.state.input.subagent_type ?? "unknown"),
						});
					}
				}

				if (toolPart.state.status === "completed") {
					this.pushEvent(state.run.id, "tool.call.completed", {
						...payload,
						output: toolPart.state.output ?? "",
					});

					if (toolPart.tool === "task") {
						this.pushEvent(state.run.id, "subagent.completed", {
							...payload,
							agent: String(toolPart.state.input.subagent_type ?? "unknown"),
						});
					}

					if (toolPart.tool === "skill") {
						this.pushEvent(state.run.id, "skill.loaded", {
							...payload,
							skill: String(toolPart.state.input.name ?? "unknown"),
						});
					}
				}

				if (toolPart.state.status === "error") {
					this.pushEvent(state.run.id, "tool.call.failed", {
						...payload,
						error: toolPart.state.error ?? "tool call failed",
					});

					if (toolPart.tool === "task") {
						this.pushEvent(state.run.id, "subagent.failed", {
							...payload,
							agent: String(toolPart.state.input.subagent_type ?? "unknown"),
						});
					}
				}
			}
		}
	}

	private pushEvent(
		runId: string,
		type: StudioEvent["type"],
		payload: StudioEvent["payload"],
	) {
		const state = this.runs.get(runId);
		if (!state) {
			return;
		}

		const event: StudioEvent = {
			id: `${runId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
			runId,
			type,
			timestamp: Date.now(),
			payload,
		};

		state.run.events.push(event);
		state.run.updatedAt = event.timestamp;
		this.emitter.emit("event", event);
	}
}

function extractAssistantText(messages: SessionMessage[]) {
	const assistant = messages
		.filter((message) => message.info.role === "assistant")
		.at(-1);
	if (!assistant) {
		return "";
	}

	return assistant.parts
		.filter((part): part is TextPart => part.type === "text")
		.map((part) => part.text)
		.join("\n")
		.trim();
}

function extractRunPrompt(messages: SessionMessage[]) {
	const user = messages.find((message) => message.info.role === "user");
	if (!user) {
		return "";
	}

	return user.parts
		.filter((part): part is TextPart => part.type === "text")
		.map((part) => part.text)
		.join("\n")
		.trim();
}

function extractFirstMessageTime(messages: SessionMessage[]) {
	const created = messages
		.map((message) => message.info.time?.created)
		.find((value): value is number => typeof value === "number");

	return created;
}

declare global {
	var __opencodeStudioRunManager__: RunManager | undefined;
}

const existingRunManager = globalThis.__opencodeStudioRunManager__;

if (!existingRunManager) {
	globalThis.__opencodeStudioRunManager__ = new RunManager();
}

const ensuredRunManager =
	globalThis.__opencodeStudioRunManager__ ?? new RunManager();

if (!globalThis.__opencodeStudioRunManager__) {
	globalThis.__opencodeStudioRunManager__ = ensuredRunManager;
}

export const runManager = ensuredRunManager;
