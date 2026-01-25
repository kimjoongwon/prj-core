"use client";

import { Chip, Divider } from "@heroui/react";
import {
	ArrowDownRight,
	ArrowUpRight,
	Box,
	Code,
	Database,
	FileText,
	Globe,
	Layers,
	LayoutGrid,
	Server,
	Target,
	TestTube,
	User,
	Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";

import type {
	EdgeType,
	NodeType,
	RequirementEdge,
	RequirementGraph,
	RequirementNode,
} from "./types";
import {
	EDGE_TYPE_COLORS,
	EDGE_TYPE_LABELS,
	NODE_TYPE_COLORS,
	NODE_TYPE_LABELS,
} from "./types";

interface NodeDetailProps {
	/** 선택된 노드 */
	node: RequirementNode | null;
	/** 그래프 데이터 (연결 정보 조회용) */
	graph: RequirementGraph;
	/** 연결된 노드 클릭 콜백 */
	onConnectedNodeClick?: (nodeId: string) => void;
}

/**
 * 노드 타입별 아이콘
 */
const NODE_TYPE_ICONS: Record<NodeType, React.ReactNode> = {
	context: <Globe className="size-4" />,
	actor: <User className="size-4" />,
	goal: <Target className="size-4" />,
	feature: <Layers className="size-4" />,
	screen: <LayoutGrid className="size-4" />,
	action: <Zap className="size-4" />,
	api: <Server className="size-4" />,
	entity: <Database className="size-4" />,
	component: <Box className="size-4" />,
	logic: <Code className="size-4" />,
	test: <TestTube className="size-4" />,
};

/**
 * 노드 상세 정보 패널
 */
export const NodeDetail = observer(
	({ node, graph, onConnectedNodeClick }: NodeDetailProps) => {
		if (!node) {
			return (
				<div className="flex h-full flex-col items-center justify-center p-4 text-center text-default-400">
					<FileText className="mb-2 size-8" />
					<p className="text-sm">노드를 선택하면</p>
					<p className="text-sm">상세 정보가 표시됩니다</p>
				</div>
			);
		}

		// 연결된 엣지 찾기
		const incomingEdges = graph.edges.filter((e) => e.target === node.id);
		const outgoingEdges = graph.edges.filter((e) => e.source === node.id);

		// 연결된 노드 정보 가져오기
		const getConnectedNode = (nodeId: string) => {
			return graph.nodes.find((n) => n.id === nodeId);
		};

		const nodeColor = NODE_TYPE_COLORS[node.type];

		return (
			<div className="flex h-full flex-col gap-4 overflow-y-auto">
				{/* 노드 헤더 */}
				<div
					className="rounded-lg p-3"
					style={{ backgroundColor: `${nodeColor.fill}20` }}
				>
					<div className="mb-2 flex items-center gap-2">
						<div
							className="flex size-8 items-center justify-center rounded-md"
							style={{ backgroundColor: nodeColor.fill }}
						>
							{NODE_TYPE_ICONS[node.type]}
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-default-800">{node.name}</h3>
							<p className="text-xs text-default-500">{node.id}</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-1">
						<Chip
							size="sm"
							variant="flat"
							style={{
								backgroundColor: nodeColor.fill,
								color: "#ffffff",
							}}
						>
							L{node.level}
							{node.subLevel ? `.${node.subLevel}` : ""}
						</Chip>
						<Chip size="sm" variant="flat" color="default">
							{NODE_TYPE_LABELS[node.type]}
						</Chip>
						{node.path && (
							<Chip size="sm" variant="flat" color="primary">
								{node.path}
							</Chip>
						)}
					</div>
				</div>

				{/* 설명 */}
				<div>
					<h4 className="mb-1 text-xs font-semibold text-default-500">설명</h4>
					<p className="text-sm text-default-700">{node.description}</p>
				</div>

				{/* 메타데이터 */}
				{node.metadata && Object.keys(node.metadata).length > 0 && (
					<div>
						<h4 className="mb-1 text-xs font-semibold text-default-500">
							메타데이터
						</h4>
						<div className="space-y-1 rounded-md bg-content2 p-2">
							{Object.entries(node.metadata).map(([key, value]) => (
								<div key={key} className="flex justify-between text-xs">
									<span className="text-default-500">{key}</span>
									<span className="font-mono text-default-700">
										{String(value)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<Divider />

				{/* 들어오는 연결 */}
				{incomingEdges.length > 0 && (
					<div>
						<h4 className="mb-2 flex items-center gap-1 text-xs font-semibold text-default-500">
							<ArrowDownRight className="size-3" />
							들어오는 연결 ({incomingEdges.length})
						</h4>
						<div className="space-y-1">
							{incomingEdges.map((edge) => {
								const sourceNode = getConnectedNode(edge.source);
								if (!sourceNode) return null;

								return (
									<ConnectionItem
										key={edge.id}
										edge={edge}
										node={sourceNode}
										direction="incoming"
										onClick={() => onConnectedNodeClick?.(sourceNode.id)}
									/>
								);
							})}
						</div>
					</div>
				)}

				{/* 나가는 연결 */}
				{outgoingEdges.length > 0 && (
					<div>
						<h4 className="mb-2 flex items-center gap-1 text-xs font-semibold text-default-500">
							<ArrowUpRight className="size-3" />
							나가는 연결 ({outgoingEdges.length})
						</h4>
						<div className="space-y-1">
							{outgoingEdges.map((edge) => {
								const targetNode = getConnectedNode(edge.target);
								if (!targetNode) return null;

								return (
									<ConnectionItem
										key={edge.id}
										edge={edge}
										node={targetNode}
										direction="outgoing"
										onClick={() => onConnectedNodeClick?.(targetNode.id)}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		);
	},
);

/**
 * 연결 항목 컴포넌트
 */
interface ConnectionItemProps {
	edge: RequirementEdge;
	node: RequirementNode;
	direction: "incoming" | "outgoing";
	onClick: () => void;
}

const ConnectionItem = observer(
	({ edge, node, direction, onClick }: ConnectionItemProps) => {
		const nodeColor = NODE_TYPE_COLORS[node.type];
		const edgeColor = EDGE_TYPE_COLORS[edge.type as EdgeType];

		return (
			<button
				type="button"
				onClick={onClick}
				className="flex w-full items-center gap-2 rounded-md bg-content2 p-2 text-left transition-colors hover:bg-content3"
			>
				<div
					className="flex size-6 shrink-0 items-center justify-center rounded"
					style={{ backgroundColor: nodeColor.fill }}
				>
					{NODE_TYPE_ICONS[node.type]}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-default-800">
						{node.name}
					</p>
					<div className="flex items-center gap-1">
						<span
							className="inline-block size-2 rounded-full"
							style={{ backgroundColor: edgeColor }}
						/>
						<span className="text-xs text-default-500">
							{direction === "incoming" ? "← " : "→ "}
							{EDGE_TYPE_LABELS[edge.type as EdgeType]}
						</span>
					</div>
				</div>
			</button>
		);
	},
);
