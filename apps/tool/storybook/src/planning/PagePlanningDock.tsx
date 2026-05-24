import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import type { OverviewManifest } from "../overview/manifest";
import { PagePlanningPanelView } from "./PagePlanningPanel";

export function PagePlanningDock({
	children,
	codexEnabled = true,
	manifest,
	storyId,
}: {
	children: ReactNode;
	codexEnabled?: boolean;
	manifest: OverviewManifest;
	storyId: string | null;
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleExpandClick = () => {
		setIsExpanded(true);
	};
	const handleCloseClick = () => {
		setIsExpanded(false);
	};

	return (
		<div style={shellStyle}>
			<div style={canvasPaneStyle}>{children}</div>
			<div style={launcherLayerStyle}>
				<button
					aria-label="Open planning overlay"
					onClick={handleExpandClick}
					style={launcherButtonStyle}
					type="button"
				>
					기획서 열기
				</button>
			</div>
			{isExpanded ? (
				<div style={overlayStyle}>
					<section aria-label="Planning overlay" style={dialogStyle}>
						<header style={dialogHeaderStyle}>
							<div style={dialogHeaderTextStyle}>
								<p style={dialogEyebrowStyle}>Planning Overlay</p>
								<strong style={dialogTitleStyle}>
									기획서를 전체 화면으로 펼쳐 route/pure screen spec를 한 번에
									확인합니다.
								</strong>
							</div>
							<button
								aria-label="Close planning overlay"
								onClick={handleCloseClick}
								style={actionButtonStyle}
								type="button"
							>
								닫기
							</button>
						</header>
						<div style={dialogBodyStyle}>
							<PagePlanningPanelView
								codexEnabled={codexEnabled}
								manifest={manifest}
								storyId={storyId}
								variant="full"
							/>
						</div>
					</section>
				</div>
			) : null}
		</div>
	);
}

const shellStyle: CSSProperties = {
	position: "relative",
	minHeight: "100vh",
	background:
		"radial-gradient(circle at top right, rgba(242,178,54,0.12), transparent 28%), #0e1116",
};

const canvasPaneStyle: CSSProperties = {
	minWidth: 0,
	padding: 24,
};

const launcherLayerStyle: CSSProperties = {
	position: "fixed",
	right: 24,
	bottom: 24,
	zIndex: 30,
};

const actionButtonStyle: CSSProperties = {
	border: "1px solid rgba(148, 163, 184, 0.18)",
	borderRadius: 999,
	padding: "8px 12px",
	background: "rgba(30, 41, 59, 0.9)",
	color: "#E2E8F0",
	cursor: "pointer",
	fontSize: 12,
	fontWeight: 700,
};

const launcherButtonStyle: CSSProperties = {
	...actionButtonStyle,
	border: "1px solid rgba(94, 234, 212, 0.24)",
	padding: "12px 16px",
	background:
		"linear-gradient(135deg, rgba(15, 118, 110, 0.94), rgba(8, 47, 73, 0.94))",
	boxShadow: "0 16px 40px rgba(2, 6, 23, 0.35)",
};

const overlayStyle: CSSProperties = {
	position: "fixed",
	inset: 0,
	zIndex: 40,
	display: "grid",
	padding: 20,
	background: "rgba(2, 6, 23, 0.68)",
	backdropFilter: "blur(18px)",
};

const dialogStyle: CSSProperties = {
	display: "grid",
	gridTemplateRows: "auto minmax(0, 1fr)",
	minHeight: 0,
	borderRadius: 28,
	border: "1px solid rgba(148, 163, 184, 0.18)",
	background:
		"radial-gradient(circle at top right, rgba(94, 234, 212, 0.14), transparent 28%), rgba(15, 23, 42, 0.98)",
	boxShadow: "0 32px 80px rgba(2, 6, 23, 0.48)",
	overflow: "hidden",
};

const dialogHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "space-between",
	gap: 16,
	padding: "18px 22px",
	borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const dialogHeaderTextStyle: CSSProperties = {
	display: "grid",
	gap: 4,
};

const dialogEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#5EEAD4",
};

const dialogTitleStyle: CSSProperties = {
	fontSize: 15,
	lineHeight: 1.5,
	color: "#F8FAFC",
};

const dialogBodyStyle: CSSProperties = {
	minHeight: 0,
	overflow: "auto",
};
