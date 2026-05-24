import type { CSSProperties, PropsWithChildren } from "react";

const stageStyle: CSSProperties = {
	minHeight: "100vh",
	display: "grid",
	placeItems: "center",
	padding: "32px 24px",
	background:
		"radial-gradient(circle at top, rgba(59, 130, 246, 0.18), transparent 38%), linear-gradient(180deg, #0b1120 0%, #111827 100%)",
};

const cardStyle: CSSProperties = {
	width: "100%",
	borderRadius: "24px",
	padding: "24px",
	background: "rgba(15, 23, 42, 0.84)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
	boxShadow: "0 24px 60px rgba(2, 6, 23, 0.42)",
	backdropFilter: "blur(14px)",
};

export function PageStoryCard({
	children,
	maxWidth = 460,
}: PropsWithChildren<{ maxWidth?: number }>) {
	return (
		<div style={stageStyle}>
			<div style={{ ...cardStyle, maxWidth }}>{children}</div>
		</div>
	);
}

export function PageStoryStage({ children }: PropsWithChildren) {
	return <div style={stageStyle}>{children}</div>;
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
			<div style={{ display: "grid", gap: 16 }}>
				<div style={{ display: "grid", gap: 6 }}>
					<p
						style={{
							margin: 0,
							fontSize: 12,
							fontWeight: 700,
							letterSpacing: "0.08em",
							textTransform: "uppercase",
							color: "#93c5fd",
						}}
					>
						Page Story Scaffold
					</p>
					<h2
						style={{
							margin: 0,
							fontSize: 28,
							lineHeight: 1.2,
							fontWeight: 700,
							color: "#f8fafc",
						}}
					>
						{componentName}
					</h2>
				</div>
				<p
					style={{
						margin: 0,
						fontSize: 15,
						lineHeight: 1.6,
						color: "#cbd5e1",
					}}
				>
					{description}
				</p>
				<div
					style={{
						borderRadius: 16,
						border: "1px solid rgba(148, 163, 184, 0.2)",
						background: "rgba(2, 6, 23, 0.4)",
						padding: 16,
					}}
				>
					<p
						style={{
							margin: "0 0 8px",
							fontSize: 12,
							fontWeight: 600,
							color: "#94a3b8",
						}}
					>
						Target component
					</p>
					<code
						style={{
							fontSize: 13,
							lineHeight: 1.6,
							color: "#e2e8f0",
							wordBreak: "break-word",
						}}
					>
						{componentPath}
					</code>
				</div>
			</div>
		</PageStoryCard>
	);
}
