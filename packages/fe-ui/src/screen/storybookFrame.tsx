import type { CSSProperties, PropsWithChildren } from "react";
import { Typography } from "../data-display/Typography";

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
					<Typography.Paragraph
						size="xs"
						weight="bold"
						className="text-accent uppercase tracking-widest"
					>
						Page Story Scaffold
					</Typography.Paragraph>
					<Typography.Heading level={2}>{componentName}</Typography.Heading>
				</div>
				<Typography.Paragraph color="muted">{description}</Typography.Paragraph>
				<div className="rounded-xl border border-border bg-surface-secondary p-4">
					<Typography.Paragraph
						size="xs"
						weight="semibold"
						color="muted"
						className="mb-2"
					>
						Target component
					</Typography.Paragraph>
					<Typography.Code className="break-words">
						{componentPath}
					</Typography.Code>
				</div>
			</div>
		</PageStoryCard>
	);
}
