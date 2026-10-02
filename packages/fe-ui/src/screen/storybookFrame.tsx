import type { CSSProperties, PropsWithChildren } from "react";

const stageClassName =
	"grid min-h-screen place-items-center bg-background px-6 py-8 text-foreground";

const cardClassName =
	"w-full rounded-3xl border border-border bg-surface p-6 shadow-surface";

export function PageStoryCard({
	children,
	maxWidth = 460,
}: PropsWithChildren<{ maxWidth?: number }>) {
	const cardStyle: CSSProperties = { maxWidth };

	return (
		<div className={stageClassName}>
			<div className={cardClassName} style={cardStyle}>
				{children}
			</div>
		</div>
	);
}

export function PageStoryStage({ children }: PropsWithChildren) {
	return <div className={stageClassName}>{children}</div>;
}

export interface PageStoryScaffoldProps {
	componentName: string;
	componentPath: string;
	description?: string;
}

export function PageStoryScaffold({
	componentName,
	componentPath,
	description = "Generated baseline page story. Replace this scaffold with stateful scenarios when fixtures and mock props are ready.",
}: PageStoryScaffoldProps) {
	return (
		<PageStoryCard maxWidth={560}>
			<div className="grid gap-4">
				<div className="grid gap-1.5">
					<p className="text-xs font-bold tracking-widest text-accent uppercase">
						Page Story Scaffold
					</p>
					<h2 className="text-[28px] leading-tight font-bold text-foreground">
						{componentName}
					</h2>
				</div>
				<p className="text-[15px] leading-relaxed text-muted">{description}</p>
				<div className="rounded-xl border border-border bg-surface-secondary p-4">
					<p className="mb-2 text-xs font-semibold text-muted">
						Target component
					</p>
					<code className="text-[13px] leading-relaxed break-words text-foreground">
						{componentPath}
					</code>
				</div>
			</div>
		</PageStoryCard>
	);
}
