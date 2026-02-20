"use client";

import { makeAutoObservable, runInAction } from "mobx";
import type { StudioEvent, StudioRun } from "@/lib/types";

class StudioStore {
	runs: StudioRun[] = [];
	activeRunId = "";
	terminalFilterId = "all";
	terminals: string[] = [];
	runTerminalMap: Record<string, string> = {};
	streamConnected = false;
	availableSubagents: string[] = [];
	private source?: EventSource;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
		this.loadTerminalBindings();
	}

	get activeRun() {
		const targetRuns = this.filteredRuns;
		return (
			targetRuns.find((run) => run.id === this.activeRunId) ?? targetRuns[0]
		);
	}

	get filteredRuns() {
		if (this.terminalFilterId === "all") {
			return this.runs;
		}

		return this.runs.filter(
			(run) => this.runTerminalMap[run.id] === this.terminalFilterId,
		);
	}

	setActiveRun(runId: string) {
		this.activeRunId = runId;
	}

	setTerminalFilter(value: string) {
		this.terminalFilterId = value;
		if (value === "all") {
			if (!this.activeRunId && this.runs[0]) {
				this.activeRunId = this.runs[0].id;
			}
			return;
		}

		const selected = this.runs.find(
			(run) => this.runTerminalMap[run.id] === value,
		);
		if (selected) {
			this.activeRunId = selected.id;
			return;
		}

		this.activeRunId = "";
	}

	bindRunTerminal(runId: string, terminalId: string) {
		if (!terminalId) {
			delete this.runTerminalMap[runId];
			this.persistTerminalBindings();
			return;
		}

		this.runTerminalMap[runId] = terminalId;
		this.persistTerminalBindings();
	}

	getRunTerminal(runId: string) {
		return this.runTerminalMap[runId] ?? "";
	}

	private loadTerminalBindings() {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const raw = window.localStorage.getItem("opencode-studio-terminal-map");
			if (!raw) {
				return;
			}
			const parsed = JSON.parse(raw) as Record<string, string>;
			if (parsed && typeof parsed === "object") {
				this.runTerminalMap = parsed;
			}
		} catch {
			return;
		}
	}

	private persistTerminalBindings() {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem(
			"opencode-studio-terminal-map",
			JSON.stringify(this.runTerminalMap),
		);
	}

	connectStream() {
		if (this.source) {
			return;
		}

		const source = new EventSource("/api/runs/stream");
		source.onopen = () => {
			runInAction(() => {
				this.streamConnected = true;
			});
		};

		source.onerror = () => {
			runInAction(() => {
				this.streamConnected = false;
			});
		};

		source.onmessage = (message) => {
			const parsed = JSON.parse(message.data) as
				| {
						type: "snapshot";
						runs: StudioRun[];
						terminals?: string[];
						availableSubagents?: string[];
				  }
				| { type: "event"; event: StudioEvent };

			runInAction(() => {
				if (parsed.type === "snapshot") {
					this.runs = parsed.runs;
					this.terminals = parsed.terminals ?? this.terminals;
					this.availableSubagents =
						parsed.availableSubagents ?? this.availableSubagents;
					if (
						this.terminalFilterId !== "all" &&
						!this.terminals.includes(this.terminalFilterId)
					) {
						this.terminalFilterId = "all";
					}
					if (
						!this.activeRunId ||
						!this.filteredRuns.some((run) => run.id === this.activeRunId)
					) {
						this.activeRunId = this.filteredRuns[0]?.id ?? "";
					}
					return;
				}

				this.mergeEvent(parsed.event);
			});
		};

		this.source = source;
	}

	disconnectStream() {
		if (!this.source) {
			return;
		}

		this.source.close();
		this.source = undefined;
		this.streamConnected = false;
	}

	private mergeEvent(event: StudioEvent) {
		const index = this.runs.findIndex((run) => run.id === event.runId);
		if (index < 0) {
			return;
		}

		const current = this.runs[index];
		const nextRun: StudioRun = {
			...current,
			updatedAt: event.timestamp,
			events: [...current.events, event],
		};

		if (event.type === "run.completed") {
			nextRun.status = "completed";
			nextRun.resultText = String(event.payload.text ?? "");
		}

		if (event.type === "run.failed") {
			nextRun.status = "failed";
			nextRun.error = String(event.payload.error ?? "Run failed");
		}

		this.runs[index] = nextRun;
		if (!this.activeRunId) {
			this.activeRunId = nextRun.id;
		}
	}
}

declare global {
	var __opencodeStudioClientStore__: StudioStore | undefined;
}

const existingStudioStore = globalThis.__opencodeStudioClientStore__;

if (!existingStudioStore) {
	globalThis.__opencodeStudioClientStore__ = new StudioStore();
}

const ensuredStudioStore =
	globalThis.__opencodeStudioClientStore__ ?? new StudioStore();

if (!globalThis.__opencodeStudioClientStore__) {
	globalThis.__opencodeStudioClientStore__ = ensuredStudioStore;
}

export const studioStore = ensuredStudioStore;
