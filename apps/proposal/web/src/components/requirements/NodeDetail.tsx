"use client";

import type { DetailConnection, DetailItem } from "@cocrepo/ui";
import { DetailPanel } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import {
	Box,
	Code,
	Database,
	FileEdit,
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
import type { Route } from "next";
import Link from "next/link";

import type {
	EdgeType,
	NodeType,
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
 * metadata를 Record<string, string | number | boolean>으로 변환
 */
function convertMetadata(
	metadata?: Record<string, unknown>,
): Record<string, string | number | boolean> | undefined {
	if (!metadata) return undefined;

	const result: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(metadata)) {
		if (
			typeof value === "string" ||
			typeof value === "number" ||
			typeof value === "boolean"
		) {
			result[key] = value;
		} else {
			result[key] = String(value);
		}
	}
	return result;
}

/**
 * RequirementNode를 DetailItem으로 변환
 */
function convertToDetailItem(
	node: RequirementNode,
	graph: RequirementGraph,
): DetailItem {
	const nodeColor = NODE_TYPE_COLORS[node.type];

	// 연결 정보 수집
	const incomingEdges = graph.edges.filter((e) => e.target === node.id);
	const outgoingEdges = graph.edges.filter((e) => e.source === node.id);

	const getConnectedNode = (nodeId: string) =>
		graph.nodes.find((n) => n.id === nodeId);

	const incomingConnections: DetailConnection[] = [];
	for (const edge of incomingEdges) {
		const sourceNode = getConnectedNode(edge.source);
		if (!sourceNode) continue;

		const sourceNodeColor = NODE_TYPE_COLORS[sourceNode.type];
		const edgeColor = EDGE_TYPE_COLORS[edge.type as EdgeType];

		incomingConnections.push({
			id: edge.id,
			itemId: sourceNode.id,
			itemName: sourceNode.name,
			typeLabel: EDGE_TYPE_LABELS[edge.type as EdgeType],
			typeColor: edgeColor,
			icon: NODE_TYPE_ICONS[sourceNode.type],
			iconBgColor: sourceNodeColor.fill,
		});
	}

	const outgoingConnections: DetailConnection[] = [];
	for (const edge of outgoingEdges) {
		const targetNode = getConnectedNode(edge.target);
		if (!targetNode) continue;

		const targetNodeColor = NODE_TYPE_COLORS[targetNode.type];
		const edgeColor = EDGE_TYPE_COLORS[edge.type as EdgeType];

		outgoingConnections.push({
			id: edge.id,
			itemId: targetNode.id,
			itemName: targetNode.name,
			typeLabel: EDGE_TYPE_LABELS[edge.type as EdgeType],
			typeColor: edgeColor,
			icon: NODE_TYPE_ICONS[targetNode.type],
			iconBgColor: targetNodeColor.fill,
		});
	}

	return {
		id: node.id,
		name: node.name,
		description: node.description,
		levelLabel: `L${node.level}${node.subLevel ? `.${node.subLevel}` : ""}`,
		typeLabel: NODE_TYPE_LABELS[node.type],
		pathLabel: node.path,
		icon: NODE_TYPE_ICONS[node.type],
		headerBgColor: nodeColor.fill,
		iconBgColor: nodeColor.fill,
		metadata: convertMetadata(node.metadata),
		incomingConnections,
		outgoingConnections,
	};
}

/**
 * 노드 상세 정보 패널
 * DetailPanel을 요구사항 그래프 노드에 맞게 커스터마이징
 */
export const NodeDetail = observer(
	({ node, graph, onConnectedNodeClick }: NodeDetailProps) => {
		if (!node) {
			return (
				<DetailPanel
					item={null}
					emptyMessage="노드를 선택하면"
					emptyDescription="상세 정보가 표시됩니다"
				/>
			);
		}

		const detailItem = convertToDetailItem(node, graph);

		// 화면 타입인 경우 추가 액션 렌더링
		const renderActionButton = () => {
			if (node.type !== "screen") return null;

			return (
				<Link href={`/screens/${node.id}` as Route}>
					<Button
						color="primary"
						variant="flat"
						size="sm"
						startContent={<FileEdit className="size-4" />}
						className="w-full"
					>
						화면설계 작성
					</Button>
				</Link>
			);
		};

		return (
			<DetailPanel
				item={detailItem}
				onConnectionClick={onConnectedNodeClick}
				actionButton={renderActionButton()}
			/>
		);
	},
);
