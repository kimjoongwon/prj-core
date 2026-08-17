"use client";

import type { ReactElement } from "react";
import { ThemeToggleButton } from "../../theme/ThemeToggleButton";
import { PlanningSessionBar } from "./PlanningSessionBar";
import { formatPlanningStatus } from "./planningPreviewFormat";
import type { PlanningPreviewFrameProps } from "./types";

type PlanningPreviewFrameComponent = {
	(props: PlanningPreviewFrameProps): ReactElement;
	displayName?: string;
};

export const PlanningPreviewFrame = (({
	children,
	onSpaceChange,
	scenario,
}: PlanningPreviewFrameProps) => {
	const { context } = scenario;

	return (
		<div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background text-foreground">
			<div className="mx-auto grid min-w-0 w-full max-w-[1440px] gap-4 p-4">
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

			<main className="w-full min-w-0 overflow-x-auto rounded-lg border border-border bg-background p-4">
				{children}
			</main>
			</div>
		</div>
	);
}) as PlanningPreviewFrameComponent;

PlanningPreviewFrame.displayName = "PlanningPreviewFrame";
