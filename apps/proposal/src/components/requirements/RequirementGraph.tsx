"use client";

import type { EdgeData, GraphOptions, NodeData } from "@antv/g6";
import { Graph } from "@antv/g6";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import type {
	EdgeType,
	GraphFilterState,
	NodeType,
	RequirementGraph as RequirementGraphType,
	RequirementNode,
} from "./types";
import { EDGE_TYPE_COLORS, NODE_TYPE_COLORS } from "./types";

interface RequirementGraphProps {
	/** 그래프 데이터 */
	graph: RequirementGraphType;
	/** 필터 상태 */
	filter: GraphFilterState;
	/** 선택된 노드 ID */
	selectedNodeId?: string;
	/** 노드 선택 콜백 */
	onNodeSelect?: (node: RequirementNode | null) => void;
}

/**
 * 노드 스타일 함수 - 타입별 크기 반환
 */
function getNodeSize(d: NodeData): [number, number] {
	const nodeData = d.data as Record<string, unknown> | undefined;
	if (!nodeData) return [80, 40];
	const config = NODE_TYPE_COLORS[nodeData.type as NodeType];
	return [config?.size * 2 || 80, config?.size || 40];
}

/**
 * 노드 스타일 함수 - 타입별 배경색 반환
 */
function getNodeFill(d: NodeData): string {
	const nodeData = d.data as Record<string, unknown> | undefined;
	if (!nodeData) return "#374151";
	const config = NODE_TYPE_COLORS[nodeData.type as NodeType];
	return config?.fill || "#374151";
}

/**
 * 노드 스타일 함수 - 타입별 테두리색 반환
 */
function getNodeStroke(d: NodeData): string {
	const nodeData = d.data as Record<string, unknown> | undefined;
	if (!nodeData) return "#6B7280";
	const config = NODE_TYPE_COLORS[nodeData.type as NodeType];
	return config?.stroke || "#6B7280";
}

/**
 * 노드 스타일 함수 - 라벨 텍스트 반환
 */
function getNodeLabel(d: NodeData): string {
	const nodeData = d.data as Record<string, unknown> | undefined;
	if (!nodeData) return "";
	const name = (nodeData.name as string) || "";
	return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}

/**
 * 엣지 스타일 함수 - 타입별 색상 반환
 */
function getEdgeStroke(d: EdgeData): string {
	const edgeData = d.data as Record<string, unknown> | undefined;
	if (!edgeData) return "#6B7280";
	return EDGE_TYPE_COLORS[edgeData.type as EdgeType] || "#6B7280";
}

/**
 * 요구사항 그래프 시각화 컴포넌트
 */
export const RequirementGraph = observer(
	({ graph, filter, selectedNodeId, onNodeSelect }: RequirementGraphProps) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const graphRef = useRef<Graph | null>(null);
		const [isReady, setIsReady] = useState(false);

		// 필터링된 노드/엣지 계산
		const filteredNodes = graph.nodes.filter((node) => {
			// 레벨 필터
			if (!filter.selectedLevels.includes(node.level)) {
				return false;
			}
			// 타입 필터
			if (
				filter.selectedTypes.length > 0 &&
				!filter.selectedTypes.includes(node.type)
			) {
				return false;
			}
			// 검색 필터
			if (filter.searchQuery) {
				const query = filter.searchQuery.toLowerCase();
				return (
					node.name.toLowerCase().includes(query) ||
					node.description.toLowerCase().includes(query)
				);
			}
			return true;
		});

		const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

		const filteredEdges = graph.edges.filter(
			(edge) =>
				filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target),
		);

		// G6 그래프 초기화
		useEffect(() => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const width = container.offsetWidth;
			const height = container.offsetHeight;

			// 기존 그래프 정리
			if (graphRef.current) {
				graphRef.current.destroy();
			}

			// G6 그래프 설정
			const graphOptions: GraphOptions = {
				container,
				width,
				height,
				data: {
					nodes: filteredNodes.map((node) => ({
						id: node.id,
						data: {
							...node,
							label: node.name,
						},
					})),
					edges: filteredEdges.map((edge) => ({
						id: edge.id,
						source: edge.source,
						target: edge.target,
						data: {
							...edge,
						},
					})),
				},
				// 레이아웃 설정 (계층형)
				layout: {
					type: "dagre",
					rankdir: "TB",
					nodesep: 40,
					ranksep: 60,
					align: "DL",
				},
				// 노드 스타일
				node: {
					type: "rect",
					style: {
						size: getNodeSize,
						radius: 8,
						fill: getNodeFill,
						stroke: getNodeStroke,
						lineWidth: 2,
						labelText: getNodeLabel,
						labelFill: "#ffffff",
						labelFontSize: 12,
						labelFontWeight: 500,
						labelPlacement: "center",
					},
					state: {
						selected: {
							stroke: "#F59E0B",
							lineWidth: 3,
							shadowColor: "#F59E0B",
							shadowBlur: 10,
						},
						hover: {
							stroke: "#60A5FA",
							lineWidth: 3,
						},
						highlight: {
							opacity: 1,
						},
						dim: {
							opacity: 0.3,
						},
					},
				},
				// 엣지 스타일
				edge: {
					type: "polyline",
					style: {
						stroke: getEdgeStroke,
						lineWidth: 2,
						endArrow: true,
						endArrowSize: 8,
						router: {
							type: "orth",
						},
					},
					state: {
						highlight: {
							stroke: "#F59E0B",
							lineWidth: 3,
						},
						dim: {
							opacity: 0.2,
						},
					},
				},
				// 동작 설정
				behaviors: [
					"drag-canvas",
					"zoom-canvas",
					"drag-element",
					{
						type: "hover-activate",
						degree: 1,
						state: "highlight",
						inactiveState: "dim",
					},
					{
						type: "click-select",
						multiple: false,
					},
				],
				// 플러그인
				plugins: [
					{
						type: "minimap",
						size: [150, 100],
						position: "bottom-right",
					},
				],
				// 테마 (다크)
				theme: "dark",
				background: "transparent",
				autoFit: "view",
				padding: 40,
			};

			// G6 그래프 생성
			const g6Graph = new Graph(graphOptions);

			// 이벤트 리스너
			g6Graph.on("node:click", (e) => {
				const event = e as unknown as {
					targetType: string;
					target: { id: string };
				};
				if (event.targetType === "node") {
					const nodeId = event.target?.id;
					const node = graph.nodes.find((n) => n.id === nodeId);
					onNodeSelect?.(node || null);
				}
			});

			g6Graph.on("canvas:click", () => {
				onNodeSelect?.(null);
			});

			// 렌더링
			g6Graph.render().then(() => {
				setIsReady(true);
			});

			graphRef.current = g6Graph;

			// 리사이즈 핸들러
			const handleResize = () => {
				if (graphRef.current && containerRef.current) {
					graphRef.current.setSize(
						containerRef.current.offsetWidth,
						containerRef.current.offsetHeight,
					);
				}
			};

			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
				if (graphRef.current) {
					graphRef.current.destroy();
					graphRef.current = null;
				}
			};
		}, [filteredNodes, filteredEdges, graph.nodes, onNodeSelect]);

		// 선택된 노드 상태 업데이트
		useEffect(() => {
			if (!graphRef.current || !isReady) return;

			// 모든 노드의 selected 상태 초기화
			graph.nodes.forEach((node) => {
				graphRef.current?.setElementState(node.id, []);
			});

			// 선택된 노드에 selected 상태 적용
			if (selectedNodeId) {
				graphRef.current.setElementState(selectedNodeId, ["selected"]);
			}
		}, [selectedNodeId, isReady, graph.nodes]);

		return (
			<div
				ref={containerRef}
				className="h-full w-full rounded-xl bg-content1"
				style={{ minHeight: "500px" }}
			/>
		);
	},
);
