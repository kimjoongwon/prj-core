"use client";

import type { ReactElement } from "react";
import { ThemeToggleButton } from "../../theme/ThemeToggleButton";
import { PlanningApiRequestList } from "./PlanningApiRequestList";
import { PlanningNotesList } from "./PlanningNotesList";
import { PlanningPreviewField } from "./PlanningPreviewField";
import { PlanningSessionBar } from "./PlanningSessionBar";
import { formatPlanningStatus } from "./planningPreviewFormat";
import type { PlanningPreviewFrameProps } from "./types";

type PlanningPreviewFrameComponent = {
	<THandler = unknown>(
		props: PlanningPreviewFrameProps<THandler>,
	): ReactElement;
	displayName?: string;
};

export const PlanningPreviewFrame = (<THandler = unknown>({
	children,
	onSpaceChange,
	scenario,
}: PlanningPreviewFrameProps<THandler>) => {
	const { api, context } = scenario;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto grid max-w-[1440px] gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
				<PlanningSessionBar context={context} onSpaceChange={onSpaceChange} />

				<header className="rounded-lg border border-border bg-surface p-4 xl:col-span-2">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="grid min-w-0 gap-1">
							<p className="text-xs font-semibold uppercase text-primary">
								Planning Preview
							</p>
							<h1 className="break-words text-2xl font-semibold">
								{scenario.title}
							</h1>
							{scenario.description ? (
								<p className="max-w-3xl text-sm text-muted">
									{scenario.description}
								</p>
							) : null}
						</div>
						<div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
							<span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
								{formatPlanningStatus(scenario.status)}
							</span>
							<ThemeToggleButton />
						</div>
					</div>
				</header>

				<main className="min-w-0 rounded-lg border border-border bg-surface-secondary p-3">
					<div className="rounded-md border border-border bg-background p-4">
						{children}
					</div>
				</main>

				<aside className="grid content-start gap-4">
					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">API Scenario</h2>
						<PlanningPreviewField label="mode" value={api?.mode ?? "none"} />
						<PlanningPreviewField label="name" value={api?.name} />
						<PlanningApiRequestList requests={api?.requests} />
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Notes</h2>
						<PlanningNotesList items={scenario.notes} />
					</section>
				</aside>
			</div>
		</div>
	);
}) as PlanningPreviewFrameComponent;

PlanningPreviewFrame.displayName = "PlanningPreviewFrame";
