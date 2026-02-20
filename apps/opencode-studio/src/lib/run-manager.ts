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
	};
	parts: MessagePart[];
}

interface RunState {
	run: StudioRun;
	seenPartState: Set<string>;
	poller?: NodeJS.Timeout;
	pollCount: number;
}

class RunManager {
	private readonly emitter = new EventEmitter();
	private readonly runs = new Map<string, RunState>();

	createRun(prompt: string) {
		const now = Date.now();
		const runId = `run_${now}_${Math.random().toString(36).slice(2, 9)}`;
		const run: StudioRun = {
			id: runId,
			prompt,
			createdAt: now,
			updatedAt: now,
			status: "running",
			events: [],
		};

		this.runs.set(runId, {
			run,
			seenPartState: new Set(),
			pollCount: 0,
		});

		this.pushEvent(runId, "run.started", { prompt });
		void this.executeRun(runId);

		return run;
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

	private async executeRun(runId: string) {
		const state = this.runs.get(runId);
		if (!state) {
			return;
		}

		try {
			const context = await getOpencodeContext();
			const created = await opencodeRequest<{ id: string }>({
				path: "/session",
				method: "POST",
				body: { title: `OpenCode Studio ${new Date().toLocaleTimeString()}` },
				directory: context.projectDirectory,
			});

			state.run.sessionId = created.id;

			await opencodeRequest({
				path: `/session/${created.id}/message`,
				method: "POST",
				body: {
					parts: [{ type: "text", text: state.run.prompt }],
				},
				directory: context.projectDirectory,
			});

			state.poller = setInterval(() => {
				void this.pollRun(runId);
			}, 1200);
		} catch (error) {
			this.failRun(runId, toErrorMessage(error));
		}
	}

	private async pollRun(runId: string) {
		const state = this.runs.get(runId);
		if (!state || !state.run.sessionId || state.run.status !== "running") {
			return;
		}

		state.pollCount += 1;

		try {
			const context = await getOpencodeContext();
			const sessionId = state.run.sessionId;

			const messages = await opencodeRequest<SessionMessage[]>({
				path: `/session/${sessionId}/message?limit=120`,
				method: "GET",
				directory: context.projectDirectory,
			});

			const statuses = await opencodeRequest<Record<string, { type: string }>>({
				path: "/session/status",
				method: "GET",
				directory: context.projectDirectory,
			});

			this.consumeMessageParts(state, messages);

			const assistantText = extractAssistantText(messages);
			if (assistantText) {
				state.run.resultText = assistantText;
			}

			if (statuses[sessionId]?.type === "idle" && state.pollCount > 1) {
				this.completeRun(runId);
			}
		} catch (error) {
			this.failRun(runId, toErrorMessage(error));
		}
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

	private completeRun(runId: string) {
		const state = this.runs.get(runId);
		if (!state || state.run.status !== "running") {
			return;
		}

		if (state.poller) {
			clearInterval(state.poller);
		}

		state.run.status = "completed";
		state.run.updatedAt = Date.now();
		this.pushEvent(runId, "run.completed", {
			text: state.run.resultText ?? "",
		});
	}

	private failRun(runId: string, message: string) {
		const state = this.runs.get(runId);
		if (!state || state.run.status !== "running") {
			return;
		}

		if (state.poller) {
			clearInterval(state.poller);
		}

		state.run.status = "failed";
		state.run.error = message;
		state.run.updatedAt = Date.now();
		this.pushEvent(runId, "run.failed", { error: message });
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

function toErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unknown error";
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
