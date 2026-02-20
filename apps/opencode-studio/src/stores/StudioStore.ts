"use client";

import { makeAutoObservable, runInAction } from "mobx";
import type { StudioEvent, StudioRun } from "@/lib/types";

class StudioStore {
	runs: StudioRun[] = [];
	activeRunId = "";
	prompt =
		"@be-seed-maker timeline session exercise 관련 시드데이터 만들어줘 (현실반영)";
	isSubmitting = false;
	streamConnected = false;
	private source?: EventSource;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get activeRun() {
		return this.runs.find((run) => run.id === this.activeRunId) ?? this.runs[0];
	}

	setPrompt(value: string) {
		this.prompt = value;
	}

	setActiveRun(runId: string) {
		this.activeRunId = runId;
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
				| { type: "snapshot"; runs: StudioRun[] }
				| { type: "event"; event: StudioEvent };

			runInAction(() => {
				if (parsed.type === "snapshot") {
					this.runs = parsed.runs;
					if (!this.activeRunId && parsed.runs[0]) {
						this.activeRunId = parsed.runs[0].id;
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

	async submitPrompt() {
		if (!this.prompt.trim() || this.isSubmitting) {
			return;
		}

		this.isSubmitting = true;
		try {
			const response = await fetch("/api/runs/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: this.prompt.trim() }),
			});

			if (!response.ok) {
				throw new Error("Failed to start run");
			}

			const payload = (await response.json()) as { run: StudioRun };
			runInAction(() => {
				this.runs = [
					payload.run,
					...this.runs.filter((run) => run.id !== payload.run.id),
				];
				this.activeRunId = payload.run.id;
			});
		} finally {
			runInAction(() => {
				this.isSubmitting = false;
			});
		}
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
