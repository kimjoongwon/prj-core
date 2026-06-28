import type { ReactElement } from "react";
import { PlanningAcceptanceList } from "./PlanningAcceptanceList";
import { PlanningApiRequestList } from "./PlanningApiRequestList";
import { PlanningPreviewField } from "./PlanningPreviewField";
import {
	formatPlanningList,
	formatPlanningStatus,
} from "./planningPreviewFormat";
import type { PlanningPreviewFrameProps } from "./types";

type PlanningPreviewFrameComponent = {
	<THandler = unknown>(
		props: PlanningPreviewFrameProps<THandler>,
	): ReactElement;
	displayName?: string;
};

export const PlanningPreviewFrame = (<THandler = unknown,>({
	children,
	scenario,
}: PlanningPreviewFrameProps<THandler>) => {
	const { api, context } = scenario;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto grid max-w-[1440px] gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
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
						<span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
							{formatPlanningStatus(scenario.status)}
						</span>
					</div>
				</header>

				<main className="min-w-0 rounded-lg border border-border bg-surface-secondary p-3">
					<div className="rounded-md border border-border bg-background p-4">
						{children}
					</div>
				</main>

				<aside className="grid content-start gap-4">
					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Planning</h2>
						<PlanningPreviewField label="id" value={scenario.id} />
						<PlanningPreviewField label="route" value={scenario.routePath} />
						<PlanningPreviewField label="owner" value={scenario.owner} />
						<PlanningPreviewField
							label="status"
							value={formatPlanningStatus(scenario.status)}
						/>
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Context</h2>
						<div className="grid gap-2">
							<PlanningPreviewField label="realm" value={context.realm} />
							<PlanningPreviewField label="role" value={context.role} />
							<PlanningPreviewField label="tenant" value={context.tenantId} />
							<PlanningPreviewField label="space" value={context.spaceId} />
							<PlanningPreviewField
								label="abilities"
								value={formatPlanningList(context.abilities)}
							/>
							<PlanningPreviewField label="viewport" value={context.viewport} />
							<PlanningPreviewField label="locale" value={context.locale} />
						</div>
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">API Scenario</h2>
						<PlanningPreviewField label="mode" value={api?.mode ?? "none"} />
						<PlanningPreviewField label="name" value={api?.name} />
						<PlanningApiRequestList requests={api?.requests} />
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Acceptance</h2>
						<PlanningAcceptanceList items={scenario.acceptance} />
					</section>
				</aside>
			</div>
		</div>
	);
}) as PlanningPreviewFrameComponent;

PlanningPreviewFrame.displayName = "PlanningPreviewFrame";
