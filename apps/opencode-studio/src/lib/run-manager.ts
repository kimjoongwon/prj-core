import { execFile } from "node:child_process";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import type { StudioEvent, StudioRun } from "./types";

const execFileAsync = promisify(execFile);

interface SessionListItem {
	id: string;
	title: string;
	updated: number;
	created: number;
	directory: string;
}

interface SessionExport {
	info: {
		id: string;
		title: string;
		directory: string;
		time?: {
			created?: number;
			updated?: number;
		};
	};
	messages: SessionMessage[];
}

const OPENCODE_COMMANDS = new Set([
	"completion",
	"acp",
	"mcp",
	"attach",
	"run",
	"debug",
	"auth",
	"agent",
	"upgrade",
	"uninstall",
	"serve",
	"web",
	"models",
	"stats",
	"export",
	"import",
	"github",
	"pr",
	"session",
	"db",
	"help",
]);

const ACTIVE_TOOL_SIGNAL_MAX_AGE_MS = 10 * 60 * 1000;

interface ToolPart {
	id: string;
	type: "tool";
	callID?: string;
	callId?: string;
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
	lastFetchedUpdated: number;
}

class RunManager {
	private readonly emitter = new EventEmitter();
	private readonly runs = new Map<string, RunState>();
	private readonly projectDirectory = resolveProjectDirectory();
	private readonly availableSubagents = discoverAvailableSubagents(
		this.projectDirectory,
	);
	private terminals: string[] = [];
	private runtimeIssue = "";
	private isPolling = false;

	constructor() {
		setInterval(() => {
			void this.pollSessions();
		}, 700);
		void this.pollSessions();
	}

	listRuns() {
		return Array.from(this.runs.values())
			.map((entry) => entry.run)
			.sort((a, b) => b.createdAt - a.createdAt);
	}

	listTerminals() {
		return this.terminals;
	}

	listAvailableSubagents() {
		return this.availableSubagents;
	}

	getRuntimeIssue() {
		return this.runtimeIssue;
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
			this.terminals = await listInteractiveTerminals();

			const sessions = await runOpencodeJson<SessionListItem[]>([
				"session",
				"list",
				"--format",
				"json",
				"-n",
				"20",
			]);

			for (const session of sessions) {
				if (
					this.projectDirectory &&
					session.directory !== this.projectDirectory
				) {
					continue;
				}

				this.ensureRunShell(session);

				const existing = this.runs.get(session.id);
				const shouldProbeActiveRun = existing?.run.status === "running";
				if (
					existing &&
					!shouldProbeActiveRun &&
					existing.lastFetchedUpdated >= session.updated
				) {
					continue;
				}

				let exported: SessionExport;
				try {
					exported = await runOpencodeJson<SessionExport>([
						"export",
						session.id,
					]);
				} catch {
					continue;
				}

				const messages = exported.messages.slice(-140);
				const state = this.ensureRun(session, messages);
				state.lastFetchedUpdated = session.updated;
				this.consumeMessageParts(state, messages, session.updated);

				const assistantText = extractAssistantText(messages);
				if (assistantText) {
					state.run.resultText = assistantText;
				}

				const nextStatus = deriveRunStatus(messages, session.updated);
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

			this.runtimeIssue = "";
		} catch (error) {
			this.runtimeIssue = toRuntimeIssue(error);
			return;
		} finally {
			this.isPolling = false;
		}
	}

	private ensureRunShell(session: SessionListItem) {
		if (this.runs.has(session.id)) {
			return;
		}

		const run: StudioRun = {
			id: session.id,
			prompt: session.title || session.id,
			createdAt: session.created,
			updatedAt: session.updated,
			status: "running",
			sessionId: session.id,
			events: [],
		};

		this.runs.set(session.id, {
			run,
			seenPartState: new Set(),
			lastFetchedUpdated: 0,
		});
	}

	private ensureRun(session: SessionListItem, messages: SessionMessage[]) {
		const existing = this.runs.get(session.id);
		if (existing) {
			return existing;
		}

		const now = Date.now();
		const run: StudioRun = {
			id: session.id,
			prompt: extractRunPrompt(messages) || session.title || session.id,
			createdAt: extractFirstMessageTime(messages) ?? session.created ?? now,
			updatedAt: now,
			status: "running",
			sessionId: session.id,
			events: [],
		};

		const nextState: RunState = {
			run,
			seenPartState: new Set(),
			lastFetchedUpdated: session.updated,
		};

		this.runs.set(session.id, nextState);
		this.pushEvent(run.id, "run.started", { prompt: run.prompt });
		return nextState;
	}

	private consumeMessageParts(
		state: RunState,
		messages: SessionMessage[],
		sessionUpdatedAt: number,
	) {
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

				const signaturePrefix = `${message.info.id}:${toolPart.id}:`;
				const sawInFlightState =
					state.seenPartState.has(`${signaturePrefix}pending`) ||
					state.seenPartState.has(`${signaturePrefix}running`);

				const payload = {
					messageId: message.info.id,
					callId: toolPart.callID ?? toolPart.callId ?? toolPart.id,
					tool: toolPart.tool,
					input: toolPart.state.input,
				};
				const taskAgent =
					toolPart.tool === "task"
						? this.resolveKnownSubagent(
								extractTaskAgentName(toolPart.state.input),
							)
						: null;

				if (
					toolPart.state.status === "pending" ||
					toolPart.state.status === "running"
				) {
					this.pushEvent(state.run.id, "tool.call.started", payload);
					if (taskAgent) {
						this.pushEvent(state.run.id, "subagent.started", {
							...payload,
							agent: taskAgent,
						});
					}

					if (isInFlightToolSignalStale(message, sessionUpdatedAt)) {
						this.pushEvent(state.run.id, "tool.call.completed", {
							...payload,
							output: "",
						});
						if (taskAgent) {
							this.pushEvent(state.run.id, "subagent.completed", {
								...payload,
								agent: taskAgent,
							});
						}
						continue;
					}
				}

				if (toolPart.state.status === "completed") {
					if (!sawInFlightState) {
						this.pushEvent(state.run.id, "tool.call.started", payload);
						if (taskAgent) {
							this.pushEvent(state.run.id, "subagent.started", {
								...payload,
								agent: taskAgent,
							});
						}
					}

					this.pushEvent(state.run.id, "tool.call.completed", {
						...payload,
						output: toolPart.state.output ?? "",
					});

					if (taskAgent) {
						this.pushEvent(state.run.id, "subagent.completed", {
							...payload,
							agent: taskAgent,
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
					if (!sawInFlightState) {
						this.pushEvent(state.run.id, "tool.call.started", payload);
						if (taskAgent) {
							this.pushEvent(state.run.id, "subagent.started", {
								...payload,
								agent: taskAgent,
							});
						}
					}

					this.pushEvent(state.run.id, "tool.call.failed", {
						...payload,
						error: toolPart.state.error ?? "tool call failed",
					});

					if (taskAgent) {
						this.pushEvent(state.run.id, "subagent.failed", {
							...payload,
							agent: taskAgent,
						});
					}
				}
			}
		}
	}

	private resolveKnownSubagent(agentName: string) {
		const normalized = agentName.trim().toLowerCase();
		if (!normalized) {
			return null;
		}

		for (const candidate of this.availableSubagents) {
			if (candidate.toLowerCase() === normalized) {
				return candidate;
			}
		}

		return agentName.trim();
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

function extractTaskAgentName(input: Record<string, unknown>) {
	const candidates = [input.subagent_type, input.subagentType, input.agent];

	for (const candidate of candidates) {
		if (typeof candidate !== "string") {
			continue;
		}

		const normalized = candidate.trim();
		if (normalized) {
			return normalized;
		}
	}

	return "task";
}

function deriveRunStatus(
	messages: SessionMessage[],
	sessionUpdatedAt: number,
): StudioRun["status"] {
	let hasError = false;
	let hasRunning = false;

	for (const message of messages) {
		for (const part of message.parts) {
			if (part.type !== "tool") {
				continue;
			}
			const toolPart = part as ToolPart;
			if (toolPart.state.status === "error") {
				hasError = true;
			}
			if (
				toolPart.state.status === "pending" ||
				toolPart.state.status === "running"
			) {
				hasRunning = true;
			}
		}
	}

	if (hasRunning && !isTimestampStale(sessionUpdatedAt)) {
		return "running";
	}
	if (hasError) {
		return "failed";
	}
	return "completed";
}

function isInFlightToolSignalStale(
	message: SessionMessage,
	sessionUpdatedAt: number,
) {
	const observedAt = newestTimestamp(
		message.info.time?.created,
		sessionUpdatedAt,
	);
	return isTimestampStale(observedAt);
}

function newestTimestamp(...candidates: Array<number | undefined>) {
	let newest: number | undefined;

	for (const candidate of candidates) {
		if (typeof candidate !== "number" || !Number.isFinite(candidate)) {
			continue;
		}

		if (newest === undefined || candidate > newest) {
			newest = candidate;
		}
	}

	return newest;
}

function isTimestampStale(timestamp: number | undefined) {
	const normalized = normalizeEpochMs(timestamp);
	if (normalized === undefined) {
		return false;
	}

	return Date.now() - normalized > ACTIVE_TOOL_SIGNAL_MAX_AGE_MS;
}

function normalizeEpochMs(timestamp: number | undefined) {
	if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
		return undefined;
	}

	if (timestamp < 1_000_000_000_000) {
		return Math.trunc(timestamp * 1000);
	}

	return Math.trunc(timestamp);
}

function toRuntimeIssue(error: unknown) {
	const code =
		typeof error === "object" && error !== null && "code" in error
			? String((error as { code?: unknown }).code ?? "")
			: "";

	if (code === "ENOENT") {
		return "opencode CLI를 찾을 수 없습니다. PATH에 opencode를 추가한 뒤 앱을 다시 실행해 주세요.";
	}

	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return "OpenCode 세션 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.";
}

async function runOpencodeJson<T>(args: string[]) {
	const { stdout } = await execFileAsync("opencode", args, {
		env: process.env,
		maxBuffer: 12 * 1024 * 1024,
	});

	const text = stripAnsi(stdout).trim();
	const objectStart = text.indexOf("{");
	const arrayStart = text.indexOf("[");
	const starts = [objectStart, arrayStart].filter((value) => value >= 0);
	const jsonStart = starts.length > 0 ? Math.min(...starts) : -1;
	const payload = jsonStart >= 0 ? text.slice(jsonStart) : text;
	return JSON.parse(payload) as T;
}

function stripAnsi(value: string) {
	const ansiPattern = new RegExp(
		`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`,
		"g",
	);
	return value.replace(ansiPattern, "");
}

function resolveProjectDirectory() {
	const envDirectory = process.env.OPENCODE_PROJECT_DIR?.trim();
	if (envDirectory) {
		return envDirectory;
	}

	const candidates = [process.cwd(), path.resolve(process.cwd(), "../..")];

	for (const candidate of candidates) {
		if (fs.existsSync(path.join(candidate, ".opencode"))) {
			return candidate;
		}
	}

	return "";
}

function discoverAvailableSubagents(projectDirectory: string) {
	if (!projectDirectory) {
		return [];
	}

	const roots = [path.join(projectDirectory, ".opencode", "agents")];
	const names = new Map<string, string>();

	for (const root of roots) {
		if (!fs.existsSync(root)) {
			continue;
		}

		let entries: string[] = [];
		try {
			entries = fs.readdirSync(root);
		} catch {
			continue;
		}

		for (const fileName of entries) {
			if (!fileName.endsWith(".md")) {
				continue;
			}

			const agentName = fileName.slice(0, -3).trim();
			if (!agentName) {
				continue;
			}

			const key = agentName.toLowerCase();
			if (!names.has(key)) {
				names.set(key, agentName);
			}
		}
	}

	return Array.from(names.values()).sort((a, b) => a.localeCompare(b));
}

async function listInteractiveTerminals() {
	const { stdout } = await execFileAsync("ps", ["-axo", "pid=,tty=,command="], {
		env: process.env,
		maxBuffer: 1024 * 1024,
	});

	const terminals = new Set<string>();
	for (const line of stdout.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) {
			continue;
		}

		const match = trimmed.match(/^(\d+)\s+(\S+)\s+(.+)$/);
		if (!match) {
			continue;
		}

		const tty = match[2];
		const command = match[3];
		if (tty === "??") {
			continue;
		}

		if (!isInteractiveOpencodeCommand(command)) {
			continue;
		}

		terminals.add(tty);
	}

	return Array.from(terminals).sort();
}

function isInteractiveOpencodeCommand(command: string) {
	const tokens = command.trim().split(/\s+/);
	const opencodeIndex = tokens.findIndex(
		(token) => token === "opencode" || token.endsWith("/opencode"),
	);
	if (opencodeIndex < 0) {
		return false;
	}

	const nextToken = tokens[opencodeIndex + 1];
	if (!nextToken) {
		return true;
	}

	if (nextToken.startsWith("-")) {
		return true;
	}

	if (OPENCODE_COMMANDS.has(nextToken)) {
		return false;
	}

	return true;
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
