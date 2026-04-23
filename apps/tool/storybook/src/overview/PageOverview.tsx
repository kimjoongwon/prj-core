import dagre from "@dagrejs/dagre";
import {
	applyNodeChanges,
	Background,
	type Edge,
	Handle,
	MarkerType,
	type Node,
	type NodeChange,
	type NodeProps,
	Position,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { useEffect, useId, useState } from "react";
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

type FlowCanvasNodeData = {
	isSelected: boolean;
	node: FlowNode;
	onSelect: (nodeId: string) => void;
};

type FlowNodePosition = {
	x: number;
	y: number;
};

type FlowNodePositionMap = Record<string, FlowNodePosition>;

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

const nodeTypes = {
	overviewNode: FlowOverviewNode,
};

const FLOW_NODE_WIDTH = 280;
const FLOW_NODE_HEIGHT = 190;
const FLOW_LANE_HEIGHT = 260;
const FLOW_X_OFFSET = 32;
const FLOW_Y_OFFSET = 48;

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
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [nodePositions, setNodePositions] = useState<FlowNodePositionMap>({});
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
	const visibleFlowNodes = visibleLanes.flatMap((lane) => lane.nodes);
	const visibleNodeIds = new Set(visibleFlowNodes.map((node) => node.id));
	const selectedFlowNode =
		selectedNodeId && visibleNodeIds.has(selectedNodeId)
			? (visibleFlowNodes.find((node) => node.id === selectedNodeId) ?? null)
			: null;
	const flowCanvas = buildFlowCanvasData(
		visibleLanes,
		selectedNodeId,
		setSelectedNodeId,
		nodePositions,
	);
	const flowKey = visibleLanes
		.map(
			(lane) =>
				`${lane.id}:${lane.nodes.map((node) => node.id).join(",")}:${lane.edges
					.map((edge) => edge.id)
					.join(",")}`,
		)
		.join("|");
	const [flowNodes, setFlowNodes] = useState<Array<Node<FlowCanvasNodeData>>>(
		flowCanvas.nodes,
	);
	const [flowEdges, setFlowEdges] = useState<Edge[]>(flowCanvas.edges);

	useEffect(() => {
		if (visibleFlowNodes.length === 0) {
			if (selectedNodeId !== null) {
				setSelectedNodeId(null);
			}
			return;
		}

		if (!selectedNodeId || !visibleNodeIds.has(selectedNodeId)) {
			setSelectedNodeId(visibleFlowNodes[0]?.id ?? null);
		}
	}, [selectedNodeId, visibleFlowNodes, visibleNodeIds]);

	useEffect(() => {
		const nextFlowCanvas = buildFlowCanvasData(
			visibleLanes,
			selectedNodeId,
			setSelectedNodeId,
			nodePositions,
		);
		setFlowNodes(nextFlowCanvas.nodes);
		setFlowEdges(nextFlowCanvas.edges);
	}, [flowKey, nodePositions, selectedNodeId]);

	const handleFlowNodesChange = (
		changes: Array<NodeChange<Node<FlowCanvasNodeData>>>,
	) => {
		setFlowNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
		setNodePositions((currentPositions) =>
			mergeFlowNodePositionChanges(currentPositions, changes),
		);
	};

	return (
		<div style={pageStyle}>
			<header style={heroStyle}>
				<div style={heroCopyStyle}>
					<p style={eyebrowStyle}>Storybook Overview</p>
					<h1 style={titleStyle}>Page Flow Workspace</h1>
					<p style={descriptionStyle}>
						`packages/fe-ui/src/page` 기준 화면 자산, 앱 route binding,
						Storybook 딥링크를 React Flow 캔버스에서 함께 점검합니다.
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
						앱, lane, page kind, story 성숙도를 기준으로 graph와 catalog를 함께
						좁혀볼 수 있습니다.
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
						<p style={sectionEyebrowStyle}>Flows</p>
						<h2 style={sectionTitleStyle}>React Flow Map</h2>
					</div>
					<p style={sectionDescriptionStyle}>
						route 기반 연결은 자동 계산되고, manual override edge는 다른 색으로
						강조됩니다. 노드를 드래그해서 겹침을 풀 수 있고, 선택한 화면 요약은
						우측 detail panel에서 바로 확인할 수 있습니다.
					</p>
				</div>
				{visibleLanes.length === 0 ? (
					<p style={emptyPanelStyle}>
						현재 필터에는 표시할 routed flow가 없습니다.
					</p>
				) : (
					<div style={flowWorkspaceStyle}>
						<div style={flowCanvasShellStyle}>
							<div style={laneLegendStyle}>
								{visibleLanes.map((lane) => (
									<div key={lane.id} style={laneLegendCardStyle}>
										<p style={laneLegendLabelStyle}>{lane.label}</p>
										<span style={laneLegendMetaStyle}>
											{lane.appId.toUpperCase()} · {lane.nodes.length} nodes
										</span>
									</div>
								))}
							</div>
							<div style={flowCanvasFrameStyle}>
								<ReactFlow
									edges={flowEdges}
									fitView
									key={flowKey}
									minZoom={0.45}
									maxZoom={1.2}
									nodes={flowNodes}
									nodeTypes={nodeTypes}
									onNodesChange={handleFlowNodesChange}
									nodesConnectable={false}
									nodesDraggable
									proOptions={{ hideAttribution: true }}
								>
									<Background color="rgba(148, 163, 184, 0.18)" gap={18} />
								</ReactFlow>
							</div>
						</div>
						<FlowDetailPanel node={selectedFlowNode} />
					</div>
				)}
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

export function buildFlowCanvasData(
	lanes: FlowLane[],
	selectedNodeId: string | null,
	onSelect: (nodeId: string) => void,
	nodePositions: FlowNodePositionMap = {},
) {
	const nodes: Array<Node<FlowCanvasNodeData>> = [];
	const edges: Edge[] = [];

	lanes.forEach((lane, laneIndex) => {
		const lanePositions = layoutLaneNodes(lane);
		const yOffset = laneIndex * FLOW_LANE_HEIGHT + FLOW_Y_OFFSET;

		lane.nodes.forEach((laneNode) => {
			const savedPosition = nodePositions[laneNode.id];
			const basePosition = lanePositions.get(laneNode.id) ?? { x: 0, y: 0 };

			nodes.push({
				id: laneNode.id,
				type: "overviewNode",
				position: savedPosition ?? {
					x: basePosition.x + FLOW_X_OFFSET,
					y: basePosition.y + yOffset,
				},
				data: {
					isSelected: laneNode.id === selectedNodeId,
					node: laneNode,
					onSelect,
				},
				draggable: true,
				dragHandle: ".flow-node-drag-handle",
				selectable: false,
			});
		});

		lane.edges.forEach((laneEdge) => {
			edges.push({
				id: laneEdge.id,
				source: laneEdge.from,
				target: laneEdge.to,
				label: laneEdge.label,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color:
						laneEdge.source === "manual"
							? "#F59E0B"
							: "rgba(148, 163, 184, 0.9)",
				},
				labelStyle: {
					fill: laneEdge.source === "manual" ? "#FCD34D" : "#CBD5E1",
					fontSize: 12,
					fontWeight: 700,
				},
				style:
					laneEdge.source === "manual"
						? {
								stroke: "#F59E0B",
								strokeDasharray: "8 6",
								strokeWidth: 2,
							}
						: {
								stroke: "rgba(148, 163, 184, 0.64)",
								strokeWidth: 1.5,
							},
				type: "smoothstep",
			});
		});
	});

	return {
		nodes,
		edges,
	};
}

export function mergeFlowNodePositionChanges(
	currentPositions: FlowNodePositionMap,
	changes: Array<NodeChange<Node<FlowCanvasNodeData>>>,
) {
	let nextPositions = currentPositions;

	changes.forEach((change) => {
		if (
			change.type !== "position" ||
			!change.position ||
			change.dragging === true
		) {
			return;
		}

		if (nextPositions === currentPositions) {
			nextPositions = { ...currentPositions };
		}

		nextPositions[change.id] = change.position;
	});

	return nextPositions;
}

function layoutLaneNodes(lane: FlowLane) {
	const graph = new dagre.graphlib.Graph();

	graph.setDefaultEdgeLabel(() => ({}));
	graph.setGraph({
		rankdir: "LR",
		nodesep: 28,
		ranksep: 72,
	});

	lane.nodes.forEach((laneNode) => {
		graph.setNode(laneNode.id, {
			width: FLOW_NODE_WIDTH,
			height: FLOW_NODE_HEIGHT,
		});
	});
	lane.edges.forEach((laneEdge) => {
		graph.setEdge(laneEdge.from, laneEdge.to);
	});
	dagre.layout(graph);

	return new Map(
		lane.nodes.map((laneNode) => {
			const layoutNode = graph.node(laneNode.id);

			return [
				laneNode.id,
				layoutNode
					? {
							x: layoutNode.x - FLOW_NODE_WIDTH / 2,
							y: layoutNode.y - FLOW_NODE_HEIGHT / 2,
						}
					: { x: 0, y: 0 },
			];
		}),
	);
}

function FlowOverviewNode({ data }: NodeProps<Node<FlowCanvasNodeData>>) {
	const handleSelectClick = () => {
		data.onSelect(data.node.id);
	};

	return (
		<div
			style={{
				...flowNodeShellStyle,
				...(data.isSelected ? flowNodeShellSelectedStyle : null),
			}}
		>
			<Handle
				isConnectable={false}
				position={Position.Left}
				style={handleStyle}
				type="target"
			/>
			<button
				aria-label={`Select flow node ${data.node.label}`}
				className="flow-node-drag-handle"
				onClick={handleSelectClick}
				style={flowNodeButtonStyle}
				type="button"
			>
				<div style={flowNodeChipRowStyle}>
					<StatusChip label={data.node.appId.toUpperCase()} tone="neutral" />
					<StatusChip
						label={pageKindLabels[data.node.pageKind]}
						tone="accent"
					/>
					<StatusChip
						label={maturityLabels[data.node.maturity]}
						tone={data.node.maturity === "scenario" ? "success" : "warning"}
					/>
				</div>
				<strong style={flowNodeTitleStyle}>{data.node.label}</strong>
				<code style={routePathStyle}>{data.node.path}</code>
				<p style={flowNodeMetaStyle}>{data.node.componentName}</p>
				<p style={flowNodeDescriptionStyle}>
					{data.node.description ??
						"story와 route binding이 연결된 화면입니다."}
				</p>
			</button>
			{data.node.storyHref ? (
				<a
					className="nodrag nopan"
					href={data.node.storyHref}
					style={flowNodeStoryLinkStyle}
					target="_top"
				>
					Open Story
				</a>
			) : null}
			<Handle
				isConnectable={false}
				position={Position.Right}
				style={handleStyle}
				type="source"
			/>
		</div>
	);
}

function FlowDetailPanel({ node }: { node: FlowNode | null }) {
	if (!node) {
		return (
			<aside style={detailPanelStyle}>
				<h3 style={detailTitleStyle}>Flow Detail</h3>
				<p style={detailDescriptionStyle}>
					좌측 graph에서 화면 노드를 선택하면 route path, story, planning 연결
					상태를 요약해 보여줍니다.
				</p>
			</aside>
		);
	}

	return (
		<aside style={detailPanelStyle}>
			<p style={detailEyebrowStyle}>Flow Detail</p>
			<h3 style={detailTitleStyle}>{node.label}</h3>
			<div style={chipWrapStyle}>
				<StatusChip label={node.laneLabel} tone="neutral" />
				<StatusChip label={pageKindLabels[node.pageKind]} tone="accent" />
				<StatusChip
					label={maturityLabels[node.maturity]}
					tone={node.maturity === "scenario" ? "success" : "warning"}
				/>
			</div>
			<div style={detailMetaGridStyle}>
				<DetailPair label="App" value={node.appId.toUpperCase()} />
				<DetailPair label="Route" value={node.path} />
				<DetailPair label="Component" value={node.componentName} />
				<DetailPair
					label="Planning"
					value={
						node.planning.routePageId || node.planning.purePageId
							? "Linked"
							: "Missing"
					}
				/>
			</div>
			<p style={detailDescriptionStyle}>
				{node.description ?? "현재 lane 안에서 선택된 화면입니다."}
			</p>
			{node.storyHref ? (
				<a href={node.storyHref} style={detailStoryLinkStyle} target="_top">
					Open Story
				</a>
			) : null}
		</aside>
	);
}

function DetailPair({ label, value }: { label: string; value: string }) {
	return (
		<div style={detailPairStyle}>
			<span style={detailPairLabelStyle}>{label}</span>
			<code style={detailPairValueStyle}>{value}</code>
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

const flowWorkspaceStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 320px)",
	gap: 16,
	alignItems: "start",
};

const flowCanvasShellStyle: CSSProperties = {
	display: "grid",
	gap: 12,
};

const laneLegendStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
	gap: 12,
};

const laneLegendCardStyle: CSSProperties = {
	display: "grid",
	gap: 4,
	padding: 12,
	borderRadius: 14,
	background: "rgba(2, 6, 23, 0.38)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const laneLegendLabelStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	fontWeight: 700,
	color: "#E2E8F0",
};

const laneLegendMetaStyle: CSSProperties = {
	fontSize: 12,
	color: "#94A3B8",
};

const flowCanvasFrameStyle: CSSProperties = {
	height: 700,
	borderRadius: 20,
	border: "1px solid rgba(148, 163, 184, 0.14)",
	overflow: "hidden",
	background:
		"radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 32%), rgba(2, 6, 23, 0.54)",
};

const flowNodeShellStyle: CSSProperties = {
	width: FLOW_NODE_WIDTH,
	display: "grid",
	gap: 10,
	padding: 14,
	borderRadius: 18,
	background: "rgba(15, 23, 42, 0.94)",
	border: "1px solid rgba(148, 163, 184, 0.16)",
	boxShadow: "0 18px 48px rgba(2, 6, 23, 0.35)",
};

const flowNodeShellSelectedStyle: CSSProperties = {
	borderColor: "rgba(94, 234, 212, 0.72)",
	boxShadow: "0 22px 56px rgba(20, 184, 166, 0.2)",
};

const flowNodeButtonStyle: CSSProperties = {
	display: "grid",
	gap: 10,
	padding: 0,
	border: "none",
	background: "transparent",
	textAlign: "left",
	cursor: "pointer",
	color: "#E5E7EB",
};

const flowNodeChipRowStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 8,
};

const flowNodeTitleStyle: CSSProperties = {
	fontSize: 15,
	color: "#F8FAFC",
};

const flowNodeMetaStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	color: "#93C5FD",
};

const flowNodeDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#CBD5E1",
};

const flowNodeStoryLinkStyle: CSSProperties = {
	color: "#5EEAD4",
	fontSize: 13,
	fontWeight: 700,
	textDecoration: "none",
};

const detailPanelStyle: CSSProperties = {
	display: "grid",
	gap: 14,
	padding: 18,
	borderRadius: 20,
	background: "rgba(2, 6, 23, 0.42)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const detailEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#FCD34D",
};

const detailTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 22,
	color: "#F8FAFC",
};

const detailDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.7,
	color: "#CBD5E1",
};

const detailMetaGridStyle: CSSProperties = {
	display: "grid",
	gap: 10,
};

const detailPairStyle: CSSProperties = {
	display: "grid",
	gap: 4,
};

const detailPairLabelStyle: CSSProperties = {
	fontSize: 12,
	fontWeight: 700,
	color: "#94A3B8",
	textTransform: "uppercase",
};

const detailPairValueStyle: CSSProperties = {
	fontSize: 12,
	color: "#E2E8F0",
	wordBreak: "break-word",
};

const detailStoryLinkStyle: CSSProperties = {
	color: "#5EEAD4",
	fontSize: 13,
	fontWeight: 700,
	textDecoration: "none",
};

const handleStyle: CSSProperties = {
	width: 10,
	height: 10,
	border: "1px solid rgba(148, 163, 184, 0.32)",
	background: "#0F172A",
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

const chipStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	padding: "4px 10px",
	borderRadius: 999,
	fontSize: 12,
	fontWeight: 700,
};

const toneStyles: Record<
	"accent" | "neutral" | "success" | "warning",
	CSSProperties
> = {
	accent: {
		background: "rgba(59, 130, 246, 0.18)",
		color: "#BFDBFE",
		border: "1px solid rgba(96, 165, 250, 0.28)",
	},
	neutral: {
		background: "rgba(30, 41, 59, 0.92)",
		color: "#CBD5E1",
		border: "1px solid rgba(148, 163, 184, 0.2)",
	},
	success: {
		background: "rgba(16, 185, 129, 0.18)",
		color: "#BBF7D0",
		border: "1px solid rgba(52, 211, 153, 0.28)",
	},
	warning: {
		background: "rgba(245, 158, 11, 0.18)",
		color: "#FDE68A",
		border: "1px solid rgba(251, 191, 36, 0.28)",
	},
};
