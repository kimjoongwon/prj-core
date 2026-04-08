import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { useId, useState } from "react";
import type {
	FlowLane,
	FlowNode,
	OverviewManifest,
	PageCatalogEntry,
	PageKind,
	StoryMaturity,
} from "./manifest";

type AppFilter = "all" | "admin" | "idp" | "standalone";
type KindFilter = "all" | PageKind;
type MaturityFilter = "all" | StoryMaturity;

const pageKindLabels: Record<PageKind, string> = {
	list: "List",
	new: "New",
	detail: "Detail",
	edit: "Edit",
	custom: "Custom",
};

const maturityLabels: Record<StoryMaturity, string> = {
	scaffold: "Scaffold",
	scenario: "Scenario",
};

const appLabels: Record<AppFilter, string> = {
	all: "All",
	admin: "Admin",
	idp: "IDP",
	standalone: "Standalone",
};

export function PageOverview({ manifest }: { manifest: OverviewManifest }) {
	const appFilterId = useId();
	const laneFilterId = useId();
	const kindFilterId = useId();
	const maturityFilterId = useId();
	const searchFilterId = useId();
	const [appFilter, setAppFilter] = useState<AppFilter>("all");
	const [laneFilter, setLaneFilter] = useState("all");
	const [kindFilter, setKindFilter] = useState<KindFilter>("all");
	const [maturityFilter, setMaturityFilter] = useState<MaturityFilter>("all");
	const [searchValue, setSearchValue] = useState("");
	const handleAppFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setAppFilter(event.target.value as AppFilter);
		setLaneFilter("all");
	};
	const handleLaneFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setLaneFilter(event.target.value);
	};
	const handleKindFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setKindFilter(event.target.value as KindFilter);
	};
	const handleMaturityFilterChange = (
		event: ChangeEvent<HTMLSelectElement>,
	) => {
		setMaturityFilter(event.target.value as MaturityFilter);
	};
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};
	const searchableQuery = searchValue.trim().toLowerCase();
	const laneOptions = buildLaneOptions(
		manifest.lanes,
		manifest.entries,
		appFilter,
	);
	const visibleEntries = manifest.entries.filter((entry) =>
		matchesEntryFilters(entry, {
			appFilter,
			laneFilter,
			kindFilter,
			maturityFilter,
			searchableQuery,
		}),
	);
	const visibleEntryNames = new Set(
		visibleEntries.map((entry) => entry.componentName),
	);
	const visibleLanes =
		appFilter === "standalone"
			? []
			: manifest.lanes
					.map((lane) =>
						filterLane(lane, visibleEntryNames, {
							appFilter,
							laneFilter,
							kindFilter,
						}),
					)
					.filter(
						(lane): lane is FlowLane => lane !== null && lane.nodes.length > 0,
					);

	return (
		<div style={pageStyle}>
			<header style={heroStyle}>
				<div style={heroCopyStyle}>
					<p style={eyebrowStyle}>Storybook Overview</p>
					<h1 style={titleStyle}>Page Catalog + Flow Map</h1>
					<p style={descriptionStyle}>
						`packages/fe-ui/src/page` 기준 화면 자산과 앱 라우트 연결 관계를 한
						화면에서 점검합니다.
					</p>
				</div>
				<div style={summaryGridStyle}>
					<SummaryCard
						label="Total Pages"
						value={manifest.summary.totalPages}
						description="page folder 기준"
					/>
					<SummaryCard
						label="Routed"
						value={manifest.summary.routedPages}
						description="admin/idp route 연결"
					/>
					<SummaryCard
						label="Standalone"
						value={manifest.summary.standalonePages}
						description="route 미연결 page"
					/>
					<SummaryCard
						label="Scenario"
						value={manifest.summary.scenarioPages}
						description="scenario story 보유"
					/>
					<SummaryCard
						label="Scaffold"
						value={manifest.summary.scaffoldPages}
						description="baseline scaffold 상태"
					/>
				</div>
			</header>

			<section style={sectionStyle}>
				<div style={sectionHeaderStyle}>
					<div>
						<p style={sectionEyebrowStyle}>Filters</p>
						<h2 style={sectionTitleStyle}>Review Scope</h2>
					</div>
					<p style={sectionDescriptionStyle}>
						앱, lane, page kind, story 성숙도를 기준으로 화면과 흐름을 좁혀볼 수
						있습니다.
					</p>
				</div>
				<div style={filterGridStyle}>
					<FilterField label="App" htmlFor={appFilterId}>
						<select
							id={appFilterId}
							onChange={handleAppFilterChange}
							style={controlStyle}
							value={appFilter}
						>
							{Object.entries(appLabels).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</FilterField>
					<FilterField label="Lane" htmlFor={laneFilterId}>
						<select
							id={laneFilterId}
							onChange={handleLaneFilterChange}
							style={controlStyle}
							value={laneFilter}
						>
							<option value="all">All</option>
							{laneOptions.map((lane) => (
								<option key={lane.id} value={lane.id}>
									{lane.label}
								</option>
							))}
						</select>
					</FilterField>
					<FilterField label="Page Kind" htmlFor={kindFilterId}>
						<select
							id={kindFilterId}
							onChange={handleKindFilterChange}
							style={controlStyle}
							value={kindFilter}
						>
							<option value="all">All</option>
							{Object.entries(pageKindLabels).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</FilterField>
					<FilterField label="Story Status" htmlFor={maturityFilterId}>
						<select
							id={maturityFilterId}
							onChange={handleMaturityFilterChange}
							style={controlStyle}
							value={maturityFilter}
						>
							<option value="all">All</option>
							{Object.entries(maturityLabels).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</FilterField>
					<FilterField label="Search" htmlFor={searchFilterId}>
						<input
							id={searchFilterId}
							onChange={handleSearchChange}
							placeholder="component, label, path 검색"
							style={controlStyle}
							type="search"
							value={searchValue}
						/>
					</FilterField>
				</div>
			</section>

			<section style={sectionStyle}>
				<div style={sectionHeaderStyle}>
					<div>
						<p style={sectionEyebrowStyle}>Catalog</p>
						<h2 style={sectionTitleStyle}>Page Inventory</h2>
					</div>
					<p style={sectionDescriptionStyle}>
						스토리 진입점은 canonical `Default` export 기준으로 연결됩니다.
					</p>
				</div>
				<div style={tableFrameStyle}>
					<table style={tableStyle}>
						<thead>
							<tr>
								<TableHeaderCell>Component</TableHeaderCell>
								<TableHeaderCell>Apps</TableHeaderCell>
								<TableHeaderCell>Bound Routes</TableHeaderCell>
								<TableHeaderCell>Story</TableHeaderCell>
							</tr>
						</thead>
						<tbody>
							{visibleEntries.map((entry) => (
								<tr key={entry.componentName}>
									<TableCell>
										<div style={primaryCellStyle}>
											<strong style={componentNameStyle}>
												{entry.componentName}
											</strong>
											<code style={componentPathStyle}>
												{entry.componentPath}
											</code>
										</div>
									</TableCell>
									<TableCell>
										<div style={chipWrapStyle}>
											{entry.appIds.map((appId) => (
												<StatusChip
													key={`${entry.componentName}:${appId}`}
													label={getAppLabel(appId)}
													tone={appId === "standalone" ? "neutral" : "accent"}
												/>
											))}
										</div>
									</TableCell>
									<TableCell>
										<div style={routeListStyle}>
											{entry.bindings.length === 0 ? (
												<span style={emptyStateStyle}>
													Standalone page component
												</span>
											) : (
												entry.bindings.map((binding) => (
													<div key={binding.id} style={routeItemStyle}>
														<span style={routeLabelStyle}>
															{binding.pageLabel}
														</span>
														<code style={routePathStyle}>{binding.path}</code>
													</div>
												))
											)}
										</div>
									</TableCell>
									<TableCell>
										<div style={storyCellStyle}>
											<StatusChip
												label={maturityLabels[entry.maturity]}
												tone={
													entry.maturity === "scenario" ? "success" : "warning"
												}
											/>
											{entry.storyHref ? (
												<a
													href={entry.storyHref}
													style={storyLinkStyle}
													target="_top"
												>
													Open Story
												</a>
											) : (
												<span style={emptyStateStyle}>No Default export</span>
											)}
										</div>
									</TableCell>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{visibleEntries.length === 0 ? (
					<p style={emptyPanelStyle}>현재 필터에 맞는 page entry가 없습니다.</p>
				) : null}
			</section>

			<section style={sectionStyle}>
				<div style={sectionHeaderStyle}>
					<div>
						<p style={sectionEyebrowStyle}>Flows</p>
						<h2 style={sectionTitleStyle}>Lane Map</h2>
					</div>
					<p style={sectionDescriptionStyle}>
						라우트 기반 연결은 lane별로 정리되고, edge는 상위 경로 또는 CRUD
						패턴을 기준으로 자동 계산됩니다.
					</p>
				</div>
				{visibleLanes.length === 0 ? (
					<p style={emptyPanelStyle}>
						현재 필터에는 표시할 routed flow가 없습니다.
					</p>
				) : (
					<div style={laneStackStyle}>
						{visibleLanes.map((lane) => (
							<LaneCard key={lane.id} lane={lane} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}

function buildLaneOptions(
	lanes: FlowLane[],
	entries: PageCatalogEntry[],
	appFilter: AppFilter,
) {
	const filteredLanes =
		appFilter === "all"
			? lanes
			: appFilter === "standalone"
				? []
				: lanes.filter((lane) => lane.appId === appFilter);
	const laneOptions = filteredLanes.map((lane) => ({
		id: lane.id,
		label: lane.label,
	}));

	if (
		(appFilter === "all" || appFilter === "standalone") &&
		entries.some((entry) => entry.bindings.length === 0)
	) {
		laneOptions.push({
			id: "standalone",
			label: "Standalone",
		});
	}

	return laneOptions;
}

function matchesEntryFilters(
	entry: PageCatalogEntry,
	{
		appFilter,
		laneFilter,
		kindFilter,
		maturityFilter,
		searchableQuery,
	}: {
		appFilter: AppFilter;
		laneFilter: string;
		kindFilter: KindFilter;
		maturityFilter: MaturityFilter;
		searchableQuery: string;
	},
) {
	if (maturityFilter !== "all" && entry.maturity !== maturityFilter) {
		return false;
	}

	if (appFilter === "standalone" && entry.bindings.length > 0) {
		return false;
	}

	if (appFilter !== "all" && appFilter !== "standalone") {
		if (!entry.bindings.some((binding) => binding.appId === appFilter)) {
			return false;
		}
	}

	if (laneFilter === "standalone") {
		if (entry.bindings.length > 0) {
			return false;
		}
	} else if (laneFilter !== "all") {
		if (!entry.bindings.some((binding) => binding.laneId === laneFilter)) {
			return false;
		}
	}

	if (kindFilter !== "all") {
		if (!entry.bindings.some((binding) => binding.pageKind === kindFilter)) {
			return false;
		}
	}

	if (!searchableQuery) {
		return true;
	}

	const haystack = [
		entry.componentName,
		entry.componentPath,
		entry.bindings.map((binding) => binding.pageLabel).join(" "),
		entry.bindings.map((binding) => binding.path).join(" "),
	]
		.join(" ")
		.toLowerCase();

	return haystack.includes(searchableQuery);
}

function filterLane(
	lane: FlowLane,
	visibleEntryNames: Set<string>,
	{
		appFilter,
		laneFilter,
		kindFilter,
	}: {
		appFilter: AppFilter;
		laneFilter: string;
		kindFilter: KindFilter;
	},
) {
	if (
		appFilter !== "all" &&
		appFilter !== "standalone" &&
		lane.appId !== appFilter
	) {
		return null;
	}

	if (laneFilter !== "all" && laneFilter !== lane.id) {
		return null;
	}

	const nodes = lane.nodes.filter((node) => {
		if (!visibleEntryNames.has(node.componentName)) {
			return false;
		}

		if (kindFilter !== "all" && node.pageKind !== kindFilter) {
			return false;
		}

		return true;
	});
	const visibleNodeIds = new Set(nodes.map((node) => node.id));
	const edges = lane.edges.filter(
		(edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to),
	);

	return {
		...lane,
		nodes,
		edges,
	};
}

function LaneCard({ lane }: { lane: FlowLane }) {
	const nodeMap = new Map(lane.nodes.map((node) => [node.id, node]));

	return (
		<article style={laneCardStyle}>
			<div style={laneHeaderStyle}>
				<div>
					<p style={laneAppStyle}>{lane.appId.toUpperCase()}</p>
					<h3 style={laneTitleStyle}>{lane.label}</h3>
				</div>
				<StatusChip
					label={`${lane.nodes.length} node${lane.nodes.length === 1 ? "" : "s"}`}
					tone="neutral"
				/>
			</div>
			<div style={laneNodeGridStyle}>
				{lane.nodes.map((node) => (
					<NodeCard key={node.id} node={node} />
				))}
			</div>
			<div style={edgeWrapStyle}>
				{lane.edges.length === 0 ? (
					<span style={emptyStateStyle}>연결 edge가 없는 단일 화면입니다.</span>
				) : (
					lane.edges.map((edge) => {
						const fromNode = nodeMap.get(edge.from);
						const toNode = nodeMap.get(edge.to);

						if (!fromNode || !toNode) {
							return null;
						}

						return (
							<div key={edge.id} style={edgeChipStyle}>
								<span>{fromNode.label}</span>
								<span style={edgeArrowStyle}>→</span>
								<span>{toNode.label}</span>
							</div>
						);
					})
				)}
			</div>
		</article>
	);
}

function NodeCard({ node }: { node: FlowNode }) {
	return (
		<div style={nodeCardStyle}>
			<div style={chipRowStyle}>
				<StatusChip label={pageKindLabels[node.pageKind]} tone="accent" />
				<StatusChip
					label={maturityLabels[node.maturity]}
					tone={node.maturity === "scenario" ? "success" : "warning"}
				/>
			</div>
			<strong style={nodeTitleStyle}>{node.label}</strong>
			<code style={routePathStyle}>{node.path}</code>
			<p style={nodeComponentStyle}>{node.componentName}</p>
			<p style={nodeDescriptionStyle}>
				{node.description ?? "story와 route binding이 연결된 화면입니다."}
			</p>
			{node.storyHref ? (
				<a href={node.storyHref} style={storyLinkStyle} target="_top">
					Open Story
				</a>
			) : null}
		</div>
	);
}

function SummaryCard({
	label,
	value,
	description,
}: {
	label: string;
	value: number;
	description: string;
}) {
	return (
		<div style={summaryCardStyle}>
			<p style={summaryLabelStyle}>{label}</p>
			<strong style={summaryValueStyle}>{value}</strong>
			<p style={summaryDescriptionStyle}>{description}</p>
		</div>
	);
}

function FilterField({
	children,
	htmlFor,
	label,
}: {
	children: ReactNode;
	htmlFor: string;
	label: string;
}) {
	return (
		<label htmlFor={htmlFor} style={filterFieldStyle}>
			<span style={filterLabelStyle}>{label}</span>
			{children}
		</label>
	);
}

function StatusChip({
	label,
	tone,
}: {
	label: string;
	tone: "accent" | "neutral" | "success" | "warning";
}) {
	return (
		<span
			style={{
				...chipStyle,
				...(toneStyles[tone] ?? toneStyles.neutral),
			}}
		>
			{label}
		</span>
	);
}

function TableHeaderCell({ children }: { children: ReactNode }) {
	return <th style={tableHeaderCellStyle}>{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
	return <td style={tableCellStyle}>{children}</td>;
}

function getAppLabel(appId: AppFilter | "standalone") {
	return appLabels[appId as AppFilter] ?? "Standalone";
}

const pageStyle: CSSProperties = {
	display: "grid",
	gap: 28,
	padding: 32,
	color: "#E5E7EB",
};

const heroStyle: CSSProperties = {
	display: "grid",
	gap: 24,
	padding: 28,
	borderRadius: 28,
	background:
		"radial-gradient(circle at top left, rgba(45, 212, 191, 0.18), transparent 34%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.2), transparent 34%), rgba(15, 23, 42, 0.9)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
	boxShadow: "0 24px 80px rgba(2, 6, 23, 0.4)",
};

const heroCopyStyle: CSSProperties = {
	display: "grid",
	gap: 10,
};

const eyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.1em",
	textTransform: "uppercase",
	color: "#5EEAD4",
};

const titleStyle: CSSProperties = {
	margin: 0,
	fontSize: 40,
	lineHeight: 1.05,
	color: "#F8FAFC",
};

const descriptionStyle: CSSProperties = {
	margin: 0,
	maxWidth: 860,
	fontSize: 16,
	lineHeight: 1.7,
	color: "#CBD5E1",
};

const summaryGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
	gap: 12,
};

const summaryCardStyle: CSSProperties = {
	display: "grid",
	gap: 8,
	padding: 16,
	borderRadius: 18,
	background: "rgba(15, 23, 42, 0.72)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const summaryLabelStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.06em",
	textTransform: "uppercase",
	color: "#94A3B8",
};

const summaryValueStyle: CSSProperties = {
	fontSize: 28,
	lineHeight: 1,
	color: "#F8FAFC",
};

const summaryDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	color: "#CBD5E1",
};

const sectionStyle: CSSProperties = {
	display: "grid",
	gap: 18,
	padding: 24,
	borderRadius: 24,
	background: "rgba(15, 23, 42, 0.82)",
	border: "1px solid rgba(148, 163, 184, 0.16)",
};

const sectionHeaderStyle: CSSProperties = {
	display: "grid",
	gap: 6,
};

const sectionEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#60A5FA",
};

const sectionTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 24,
	lineHeight: 1.2,
	color: "#F8FAFC",
};

const sectionDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 14,
	lineHeight: 1.6,
	color: "#CBD5E1",
};

const filterGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
	gap: 14,
};

const filterFieldStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const filterLabelStyle: CSSProperties = {
	fontSize: 13,
	fontWeight: 700,
	color: "#E2E8F0",
};

const controlStyle: CSSProperties = {
	width: "100%",
	borderRadius: 14,
	border: "1px solid rgba(148, 163, 184, 0.2)",
	background: "rgba(2, 6, 23, 0.55)",
	color: "#F8FAFC",
	padding: "12px 14px",
	fontSize: 14,
};

const tableFrameStyle: CSSProperties = {
	overflowX: "auto",
	borderRadius: 20,
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const tableStyle: CSSProperties = {
	width: "100%",
	borderCollapse: "collapse",
	background: "rgba(2, 6, 23, 0.36)",
};

const tableHeaderCellStyle: CSSProperties = {
	padding: "14px 16px",
	textAlign: "left",
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#94A3B8",
	borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
};

const tableCellStyle: CSSProperties = {
	padding: "16px",
	verticalAlign: "top",
	borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const primaryCellStyle: CSSProperties = {
	display: "grid",
	gap: 6,
};

const componentNameStyle: CSSProperties = {
	fontSize: 15,
	color: "#F8FAFC",
};

const componentPathStyle: CSSProperties = {
	fontSize: 12,
	color: "#93C5FD",
};

const chipWrapStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 8,
};

const routeListStyle: CSSProperties = {
	display: "grid",
	gap: 10,
};

const routeItemStyle: CSSProperties = {
	display: "grid",
	gap: 4,
};

const routeLabelStyle: CSSProperties = {
	fontSize: 14,
	color: "#E2E8F0",
};

const routePathStyle: CSSProperties = {
	fontSize: 12,
	color: "#93C5FD",
	wordBreak: "break-word",
};

const storyCellStyle: CSSProperties = {
	display: "grid",
	justifyItems: "start",
	gap: 10,
};

const storyLinkStyle: CSSProperties = {
	color: "#5EEAD4",
	fontSize: 13,
	fontWeight: 700,
	textDecoration: "none",
};

const emptyStateStyle: CSSProperties = {
	fontSize: 13,
	color: "#94A3B8",
};

const emptyPanelStyle: CSSProperties = {
	margin: 0,
	padding: 18,
	borderRadius: 16,
	background: "rgba(2, 6, 23, 0.32)",
	color: "#94A3B8",
};

const laneStackStyle: CSSProperties = {
	display: "grid",
	gap: 16,
};

const laneCardStyle: CSSProperties = {
	display: "grid",
	gap: 16,
	padding: 18,
	borderRadius: 20,
	background: "rgba(2, 6, 23, 0.42)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const laneHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 16,
};

const laneAppStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#94A3B8",
};

const laneTitleStyle: CSSProperties = {
	margin: "4px 0 0",
	fontSize: 18,
	color: "#F8FAFC",
};

const laneNodeGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
	gap: 12,
};

const nodeCardStyle: CSSProperties = {
	display: "grid",
	gap: 10,
	padding: 16,
	borderRadius: 18,
	background: "rgba(15, 23, 42, 0.78)",
	border: "1px solid rgba(148, 163, 184, 0.12)",
};

const chipRowStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 8,
};

const nodeTitleStyle: CSSProperties = {
	fontSize: 15,
	color: "#F8FAFC",
};

const nodeComponentStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	color: "#CBD5E1",
};

const nodeDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.5,
	color: "#94A3B8",
};

const edgeWrapStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 10,
};

const edgeChipStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
	padding: "8px 12px",
	borderRadius: 999,
	background: "rgba(37, 99, 235, 0.14)",
	border: "1px solid rgba(96, 165, 250, 0.18)",
	fontSize: 13,
	color: "#DBEAFE",
};

const edgeArrowStyle: CSSProperties = {
	color: "#5EEAD4",
};

const chipStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	borderRadius: 999,
	padding: "4px 10px",
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.05em",
	textTransform: "uppercase",
};

const toneStyles: Record<
	"accent" | "neutral" | "success" | "warning",
	CSSProperties
> = {
	accent: {
		background: "rgba(37, 99, 235, 0.18)",
		color: "#BFDBFE",
	},
	neutral: {
		background: "rgba(148, 163, 184, 0.14)",
		color: "#CBD5E1",
	},
	success: {
		background: "rgba(16, 185, 129, 0.16)",
		color: "#A7F3D0",
	},
	warning: {
		background: "rgba(245, 158, 11, 0.16)",
		color: "#FDE68A",
	},
};
