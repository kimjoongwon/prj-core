import type { PlanningAcceptance, PlanningScenario } from "@cocrepo/type";
import type { PropsWithChildren, ReactNode } from "react";

export interface PlanningPreviewFrameProps<THandler = unknown>
	extends PropsWithChildren {
	scenario: PlanningScenario<THandler>;
}

function joinList(values?: readonly string[]) {
	return values && values.length > 0 ? values.join(", ") : "-";
}

function formatStatus(status: PlanningScenario["status"]) {
	if (!status) {
		return "draft";
	}

	return status;
}

function Field({ label, value }: { label: string; value?: ReactNode }) {
	return (
		<div className="min-w-0 rounded-md border border-border bg-surface px-3 py-2">
			<p className="text-[11px] font-semibold uppercase text-muted">{label}</p>
			<p className="mt-1 break-words text-sm text-foreground">{value || "-"}</p>
		</div>
	);
}

function AcceptanceList({ items }: { items?: readonly PlanningAcceptance[] }) {
	if (!items || items.length === 0) {
		return (
			<p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted">
				acceptance 항목 없음
			</p>
		);
	}

	return (
		<ul className="grid gap-2">
			{items.map((item) => (
				<li
					className="flex gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
					key={item.label}
				>
					<span aria-hidden className="font-semibold text-success">
						✓
					</span>
					<span className="min-w-0 flex-1 break-words">{item.label}</span>
					{item.required === false ? (
						<span className="text-xs text-muted">optional</span>
					) : null}
				</li>
			))}
		</ul>
	);
}

export function PlanningPreviewFrame<THandler = unknown>({
	children,
	scenario,
}: PlanningPreviewFrameProps<THandler>) {
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
							{formatStatus(scenario.status)}
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
						<Field label="id" value={scenario.id} />
						<Field label="route" value={scenario.routePath} />
						<Field label="owner" value={scenario.owner} />
						<Field label="status" value={formatStatus(scenario.status)} />
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Context</h2>
						<div className="grid gap-2">
							<Field label="realm" value={context.realm} />
							<Field label="role" value={context.role} />
							<Field label="tenant" value={context.tenantId} />
							<Field label="space" value={context.spaceId} />
							<Field label="abilities" value={joinList(context.abilities)} />
							<Field label="viewport" value={context.viewport} />
							<Field label="locale" value={context.locale} />
						</div>
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">API Scenario</h2>
						<Field label="mode" value={api?.mode ?? "none"} />
						<Field label="name" value={api?.name} />
						{api?.requests?.map((request) => (
							<div
								className="rounded-md border border-border bg-background px-3 py-2 text-sm"
								key={`${request.method}:${request.path}:${request.status}`}
							>
								<p className="font-semibold">
									{request.method} {request.path}
								</p>
								<p className="text-xs text-muted">status {request.status}</p>
								{request.description ? (
									<p className="mt-1 text-xs text-muted">
										{request.description}
									</p>
								) : null}
							</div>
						))}
					</section>

					<section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
						<h2 className="text-sm font-semibold">Acceptance</h2>
						<AcceptanceList items={scenario.acceptance} />
					</section>
				</aside>
			</div>
		</div>
	);
}
