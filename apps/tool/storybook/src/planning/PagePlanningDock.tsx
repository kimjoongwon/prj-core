import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import type { OverviewManifest } from "../overview/manifest";
import { PagePlanningPanelView } from "./PagePlanningPanel";

const COLLAPSED_VIEWPORT_WIDTH = 1180;
const EXPANDED_SHELF_HEIGHT = "min(46vh, 420px)";

export function PagePlanningDock({
	children,
	manifest,
	storyId,
}: {
	children: ReactNode;
	manifest: OverviewManifest;
	storyId: string | null;
}) {
	const [isExpanded, setIsExpanded] = useState(() => {
		if (typeof window === "undefined") {
			return true;
		}

		return window.innerWidth >= COLLAPSED_VIEWPORT_WIDTH;
	});

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const syncExpandedState = () => {
			if (window.innerWidth < COLLAPSED_VIEWPORT_WIDTH) {
				setIsExpanded(false);
			}
		};

		syncExpandedState();
		window.addEventListener("resize", syncExpandedState);

		return () => {
			window.removeEventListener("resize", syncExpandedState);
		};
	}, []);

	const handleToggleClick = () => {
		setIsExpanded((current) => !current);
	};

	return (
		<div style={shellStyle}>
			<div
				style={{
					...canvasPaneStyle,
					paddingBottom: isExpanded ? "calc(24px + 46vh)" : 96,
				}}
			>
				{children}
			</div>
			<div style={shelfLayerStyle}>
				{isExpanded ? (
					<section aria-label="Planning shelf" style={shelfStyle}>
						<header style={shelfHeaderStyle}>
							<div style={shelfHeaderTextStyle}>
								<p style={shelfEyebrowStyle}>Planning Shelf</p>
								<strong style={shelfTitleStyle}>
									문서를 카드처럼 펼쳐 두고 필요한 것만 접고 펼칩니다.
								</strong>
							</div>
							<button
								aria-label="Collapse planning shelf"
								onClick={handleToggleClick}
								style={actionButtonStyle}
								type="button"
							>
								Shelf 접기
							</button>
						</header>
						<div style={shelfBodyStyle}>
							<PagePlanningPanelView
								manifest={manifest}
								storyId={storyId}
								variant="board"
							/>
						</div>
					</section>
				) : (
					<button
						aria-label="Expand planning shelf"
						onClick={handleToggleClick}
						style={launcherButtonStyle}
						type="button"
					>
						Planning Shelf 열기
					</button>
				)}
			</div>
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

const shelfLayerStyle: CSSProperties = {
	position: "fixed",
	left: 16,
	right: 16,
	bottom: 16,
	zIndex: 30,
	pointerEvents: "none",
};

const shelfStyle: CSSProperties = {
	display: "grid",
	gridTemplateRows: "auto minmax(0, 1fr)",
	height: EXPANDED_SHELF_HEIGHT,
	borderRadius: 24,
	border: "1px solid rgba(148, 163, 184, 0.18)",
	background:
		"linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.9))",
	boxShadow: "0 24px 64px rgba(2, 6, 23, 0.42)",
	backdropFilter: "blur(20px)",
	overflow: "hidden",
	pointerEvents: "auto",
};

const shelfHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 16,
	padding: "14px 18px",
	borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const shelfHeaderTextStyle: CSSProperties = {
	display: "grid",
	gap: 4,
};

const shelfEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#5EEAD4",
};

const shelfTitleStyle: CSSProperties = {
	fontSize: 14,
	color: "#F8FAFC",
};

const shelfBodyStyle: CSSProperties = {
	overflow: "auto",
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
	pointerEvents: "auto",
	boxShadow: "0 16px 40px rgba(2, 6, 23, 0.35)",
};
