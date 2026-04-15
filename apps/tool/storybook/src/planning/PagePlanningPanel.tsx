import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import type {
	OverviewManifest,
	PlanningDocument,
	PlanningDocumentKind,
} from "../overview/manifest";

type PlanningPanelMode = "summary" | "raw";
type PlanningPanelVariant = "board" | "compact" | "full";

const routeSectionHeadings = [
	"사용자 시나리오",
	"Rendering Decision",
	"API 호출",
	"이벤트 핸들러",
];

const purePageSectionHeadings = ["역할", "공개 계약", "구성 요소", "의존성"];

export function PagePlanningPanelView({
	manifest,
	storyId,
	variant = "full",
}: {
	manifest: OverviewManifest;
	storyId: string | null;
	variant?: PlanningPanelVariant;
}) {
	const [mode, setMode] = useState<PlanningPanelMode>("summary");
	const isCompact = variant === "compact";
	const isBoard = variant === "board";

	useEffect(() => {
		setMode("summary");
	}, [storyId]);

	if (!storyId) {
		return (
			<div style={panelStyle}>
				<EmptyState
					description="현재 선택된 스토리가 없습니다."
					title="No Story Selected"
				/>
			</div>
		);
	}

	const entry = findCatalogEntryForStory(manifest, storyId);

	if (!entry) {
		return (
			<div style={panelStyle}>
				<EmptyState
					description="page overview manifest에 연결된 page story를 선택하면 우측에서 기획 요약과 raw spec을 함께 볼 수 있습니다."
					title="Planning Not Available"
				/>
			</div>
		);
	}

	const purePageDocument = getPlanningDocument(
		manifest,
		entry.planning.purePageId,
	);
	const routeDocuments = entry.planning.routePageIds
		.map((documentId) => getPlanningDocument(manifest, documentId))
		.filter((document): document is PlanningDocument => document !== null);
	const handleSummaryModeClick = () => {
		setMode("summary");
	};
	const handleRawModeClick = () => {
		setMode("raw");
	};

	return (
		<div style={panelStyle}>
			<header style={headerStyle}>
				<p style={eyebrowStyle}>Page Planning</p>
				<h2 style={titleStyle}>{entry.componentName}</h2>
				<p style={descriptionStyle}>
					{entry.bindings.length === 0
						? "Standalone page story입니다. pure page spec를 중심으로 확인합니다."
						: isCompact
							? `${entry.bindings.length}개의 route context 중 핵심 요약만 빠르게 보여줍니다.`
							: isBoard
								? `${entry.bindings.length}개의 route context를 planning card로 배치했습니다. 필요한 카드만 펼쳐서 확인하세요.`
							: `${entry.bindings.length}개의 route context와 pure page spec를 함께 보여줍니다.`}
				</p>
				<div style={chipRowStyle}>
					<InfoChip
						label={entry.maturity === "scenario" ? "Scenario" : "Scaffold"}
					/>
					<InfoChip
						label={
							entry.bindings.length === 0
								? "Standalone"
								: `${entry.bindings.length} Route`
						}
					/>
				</div>
				{entry.storyHref ? (
					<a href={entry.storyHref} style={storyLinkStyle} target="_top">
						Open Canonical Story
					</a>
				) : null}
			</header>

			{isCompact || isBoard ? null : (
				<div style={toggleRowStyle}>
					<ToggleButton
						isActive={mode === "summary"}
						label="Summary"
						onClick={handleSummaryModeClick}
					/>
					<ToggleButton
						isActive={mode === "raw"}
						label="Raw Spec"
						onClick={handleRawModeClick}
					/>
				</div>
			)}

			{mode === "summary" || isCompact || isBoard ? (
				<div style={sectionStackStyle}>
					{routeDocuments.length > 0 ? (
						<PlanningDocumentGroup
							documents={routeDocuments}
							groupLabel="Route Planning"
							isCompact={isCompact}
							variant={variant}
						/>
					) : null}
					{purePageDocument ? (
						<PlanningDocumentGroup
							documents={[purePageDocument]}
							groupLabel="Pure Page"
							isCompact={isCompact}
							variant={variant}
						/>
					) : null}
					{routeDocuments.length === 0 && !purePageDocument ? (
						<EmptyState
							description="story와 연결된 spec sidecar를 찾지 못했습니다."
							title="Spec Missing"
						/>
					) : null}
				</div>
			) : (
				<div style={sectionStackStyle}>
					{routeDocuments.map((document) => (
						<RawDocumentCard document={document} key={document.id} />
					))}
					{purePageDocument ? (
						<RawDocumentCard
							document={purePageDocument}
							key={purePageDocument.id}
						/>
					) : null}
					{routeDocuments.length === 0 && !purePageDocument ? (
						<EmptyState
							description="render할 raw markdown spec가 없습니다."
							title="Spec Missing"
						/>
					) : null}
				</div>
			)}
		</div>
	);
}

function PlanningDocumentGroup({
	documents,
	groupLabel,
	isCompact = false,
	variant = "full",
}: {
	documents: PlanningDocument[];
	groupLabel: string;
	isCompact?: boolean;
	variant?: PlanningPanelVariant;
}) {
	const isBoard = variant === "board";
	const visibleDocuments = isCompact ? documents.slice(0, 1) : documents;

	return (
		<section style={groupStyle}>
			<div style={groupHeaderStyle}>
				<p style={groupEyebrowStyle}>{groupLabel}</p>
				<strong style={groupValueStyle}>{documents.length}</strong>
			</div>
			<div style={isBoard ? boardGridStyle : sectionStackStyle}>
				{visibleDocuments.map((document) => (
					<SummaryDocumentCard
						document={document}
						isCompact={isCompact}
						variant={variant}
						key={document.id}
					/>
				))}
			</div>
		</section>
	);
}

function SummaryDocumentCard({
	document,
	isCompact = false,
	variant = "full",
}: {
	document: PlanningDocument;
	isCompact?: boolean;
	variant?: PlanningPanelVariant;
}) {
	const isBoard = variant === "board";
	const [isExpanded, setIsExpanded] = useState(!isBoard);
	const summarySections = getSummarySections(document, isCompact);
	const visibleSections =
		isBoard && !isExpanded ? summarySections.slice(0, 1) : summarySections;
	const handleToggleClick = () => {
		setIsExpanded((current) => !current);
	};

	return (
		<article style={documentCardStyle}>
			<div style={documentHeaderStyle}>
				<div style={sectionStackCompactStyle}>
					<p style={documentKindStyle}>{getDocumentKindLabel(document.kind)}</p>
					<h3 style={documentTitleStyle}>{document.title}</h3>
				</div>
				{document.routePath ? (
					<code style={routePathStyle}>{document.routePath}</code>
				) : null}
			</div>
			{document.metadata.length > 0 ? (
				<ul style={metadataListStyle}>
					{document.metadata.map((metadataLine) => (
						<li key={metadataLine}>{metadataLine}</li>
					))}
				</ul>
			) : null}
			{document.summary ? (
				<div style={markdownBlockStyle}>
					<Markdown>{document.summary}</Markdown>
				</div>
			) : null}
			<div style={sectionStackCompactStyle}>
				{visibleSections.map((section) => (
					<section
						key={`${document.id}:${section.heading}`}
						style={summarySectionStyle}
					>
						<h4 style={summaryHeadingStyle}>{section.heading}</h4>
						<div style={markdownBlockStyle}>
							<Markdown>{section.content}</Markdown>
						</div>
					</section>
				))}
			</div>
			{isBoard && summarySections.length > 1 ? (
				<button
					onClick={handleToggleClick}
					style={secondaryButtonStyle}
					type="button"
				>
					{isExpanded ? "접기" : "더 보기"}
				</button>
			) : null}
		</article>
	);
}

function RawDocumentCard({ document }: { document: PlanningDocument }) {
	return (
		<article style={documentCardStyle}>
			<div style={documentHeaderStyle}>
				<div style={sectionStackCompactStyle}>
					<p style={documentKindStyle}>{getDocumentKindLabel(document.kind)}</p>
					<h3 style={documentTitleStyle}>{document.title}</h3>
				</div>
				{document.routePath ? (
					<code style={routePathStyle}>{document.routePath}</code>
				) : null}
			</div>
			<div style={markdownBlockStyle}>
				<Markdown>{document.rawMarkdown}</Markdown>
			</div>
		</article>
	);
}

function ToggleButton({
	isActive,
	label,
	onClick,
}: {
	isActive: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			style={{
				...toggleButtonStyle,
				...(isActive ? toggleButtonActiveStyle : null),
			}}
			type="button"
		>
			{label}
		</button>
	);
}

function InfoChip({ label }: { label: string }) {
	return <span style={infoChipStyle}>{label}</span>;
}

function EmptyState({
	description,
	title,
}: {
	description: string;
	title: string;
}) {
	return (
		<section style={emptyStateStyle}>
			<h3 style={emptyStateTitleStyle}>{title}</h3>
			<p style={emptyStateDescriptionStyle}>{description}</p>
		</section>
	);
}

function findCatalogEntryForStory(
	manifest: OverviewManifest,
	storyId: string,
) {
	return (
		manifest.entries.find((entry) => entry.storyIds.includes(storyId)) ?? null
	);
}

function getPlanningDocument(
	manifest: OverviewManifest,
	documentId: string | null,
) {
	if (!documentId) {
		return null;
	}

	return manifest.planningDocuments[documentId] ?? null;
}

function getSummarySections(
	document: PlanningDocument,
	isCompact = false,
) {
	const preferredHeadings =
		document.kind === "route-page"
			? routeSectionHeadings
			: purePageSectionHeadings;
	const matchedSections = preferredHeadings
		.map((heading) =>
			document.sections.find((section) => section.heading === heading),
		)
		.filter(
			(section): section is NonNullable<typeof section> =>
				section !== undefined,
		);

	if (matchedSections.length > 0) {
		return isCompact ? matchedSections.slice(0, 1) : matchedSections;
	}

	return document.sections
		.filter((section) => section.heading !== "변경 이력")
		.slice(0, isCompact ? 1 : 3);
}

function getDocumentKindLabel(kind: PlanningDocumentKind) {
	return kind === "route-page" ? "Route Spec" : "Pure Page Spec";
}

const panelStyle: CSSProperties = {
	display: "grid",
	gap: 16,
	padding: 16,
	color: "#E5E7EB",
};

const headerStyle: CSSProperties = {
	display: "grid",
	gap: 10,
	padding: 16,
	borderRadius: 18,
	background:
		"radial-gradient(circle at top right, rgba(94, 234, 212, 0.18), transparent 36%), rgba(15, 23, 42, 0.92)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
};

const eyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#5EEAD4",
};

const titleStyle: CSSProperties = {
	margin: 0,
	fontSize: 22,
	lineHeight: 1.2,
	color: "#F8FAFC",
};

const descriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#CBD5E1",
};

const chipRowStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 8,
};

const infoChipStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	padding: "4px 10px",
	borderRadius: 999,
	background: "rgba(30, 41, 59, 0.9)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
	fontSize: 12,
	fontWeight: 700,
	color: "#E2E8F0",
};

const storyLinkStyle: CSSProperties = {
	color: "#5EEAD4",
	fontSize: 13,
	fontWeight: 700,
	textDecoration: "none",
};

const toggleRowStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
	gap: 8,
};

const toggleButtonStyle: CSSProperties = {
	border: "1px solid rgba(148, 163, 184, 0.18)",
	borderRadius: 12,
	background: "rgba(15, 23, 42, 0.78)",
	color: "#CBD5E1",
	cursor: "pointer",
	fontSize: 13,
	fontWeight: 700,
	padding: "10px 12px",
};

const toggleButtonActiveStyle: CSSProperties = {
	background: "rgba(14, 165, 233, 0.18)",
	border: "1px solid rgba(56, 189, 248, 0.42)",
	color: "#F8FAFC",
};

const groupStyle: CSSProperties = {
	display: "grid",
	gap: 12,
};

const groupHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 12,
};

const groupEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#93C5FD",
};

const groupValueStyle: CSSProperties = {
	fontSize: 13,
	color: "#CBD5E1",
};

const sectionStackStyle: CSSProperties = {
	display: "grid",
	gap: 12,
};

const boardGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
	gap: 12,
	alignItems: "start",
};

const sectionStackCompactStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const documentCardStyle: CSSProperties = {
	display: "grid",
	gap: 12,
	padding: 16,
	borderRadius: 16,
	background: "rgba(15, 23, 42, 0.82)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const documentHeaderStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const documentKindStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#94A3B8",
};

const documentTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 16,
	lineHeight: 1.35,
	color: "#F8FAFC",
};

const routePathStyle: CSSProperties = {
	fontSize: 12,
	color: "#93C5FD",
	wordBreak: "break-word",
};

const metadataListStyle: CSSProperties = {
	display: "grid",
	gap: 6,
	margin: 0,
	paddingLeft: 16,
	fontSize: 12,
	color: "#94A3B8",
};

const summarySectionStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const summaryHeadingStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	color: "#E2E8F0",
};

const markdownBlockStyle: CSSProperties = {
	fontSize: 13,
	lineHeight: 1.7,
	color: "#CBD5E1",
};

const secondaryButtonStyle: CSSProperties = {
	border: "1px solid rgba(148, 163, 184, 0.18)",
	borderRadius: 12,
	background: "rgba(30, 41, 59, 0.72)",
	color: "#E2E8F0",
	cursor: "pointer",
	fontSize: 12,
	fontWeight: 700,
	padding: "8px 10px",
	justifySelf: "start",
};

const emptyStateStyle: CSSProperties = {
	display: "grid",
	gap: 8,
	padding: 16,
	borderRadius: 16,
	background: "rgba(15, 23, 42, 0.72)",
	border: "1px dashed rgba(148, 163, 184, 0.2)",
};

const emptyStateTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 16,
	color: "#F8FAFC",
};

const emptyStateDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#94A3B8",
};
