"use client";

import type { EdgeData, GraphOptions, NodeData } from "@antv/g6";
import { Graph } from "@antv/g6";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

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
		const cleanupRef = useRef(false);

		// 필터링된 노드/엣지 계산
		const filteredNodes = graph.nodes.filter((node) => {
			if (!filter.selectedLevels.includes(node.level)) {
				return false;
			}
			if (
				filter.selectedTypes.length > 0 &&
				!filter.selectedTypes.includes(node.type)
			) {
				return false;
			}
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

		// 데이터 키
		const dataKey = JSON.stringify({
			nodeIds: filteredNodes.map((n) => n.id).sort(),
			edgeIds: filteredEdges.map((e) => e.id).sort(),
		});

		// G6 그래프 초기화 및 업데이트
		useEffect(() => {
			if (!containerRef.current) return;

			cleanupRef.current = false;

			const container = containerRef.current;
			const width = container.offsetWidth || 800;
			const height = container.offsetHeight || 600;

			// G6 데이터 형식
			const g6Data = {
				nodes: filteredNodes.map((node) => ({
					id: node.id,
					data: { ...node, label: node.name },
				})),
				edges: filteredEdges.map((edge) => ({
					id: edge.id,
					source: edge.source,
					target: edge.target,
					data: { ...edge },
				})),
			};

			// 기존 그래프가 있으면 데이터만 업데이트
			if (graphRef.current && !graphRef.current.destroyed) {
				graphRef.current.setData(g6Data);
				graphRef.current.render();
				return;
			}

			// 새 그래프 생성
			const graphOptions: GraphOptions = {
				container,
				width,
				height,
				data: g6Data,
				layout: {
					type: "dagre",
					rankdir: "TB",
					nodesep: 40,
					ranksep: 60,
					align: "DL",
				},
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
				edge: {
					type: "polyline",
					style: {
						stroke: getEdgeStroke,
						lineWidth: 2,
						endArrow: true,
						endArrowSize: 8,
						router: { type: "orth" },
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
				plugins: [
					{
						type: "minimap",
						size: [150, 100],
						position: "bottom-right",
					},
				],
				theme: "dark",
				background: "transparent",
				autoFit: "view",
				padding: 40,
			};

			const g6Graph = new Graph(graphOptions);
			graphRef.current = g6Graph;

			// 이벤트 리스너
			g6Graph.on("node:click", (e) => {
				if (cleanupRef.current) return;
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
				if (cleanupRef.current) return;
				onNodeSelect?.(null);
			});

			// 렌더링
			g6Graph.render().catch(() => {
				// cleanup 후 에러는 무시
			});

			// 리사이즈 핸들러
			const handleResize = () => {
				if (
					!cleanupRef.current &&
					graphRef.current &&
					!graphRef.current.destroyed &&
					containerRef.current
				) {
					graphRef.current.setSize(
						containerRef.current.offsetWidth,
						containerRef.current.offsetHeight,
					);
				}
			};

			window.addEventListener("resize", handleResize);

			return () => {
				cleanupRef.current = true;
				window.removeEventListener("resize", handleResize);
				if (graphRef.current && !graphRef.current.destroyed) {
					graphRef.current.destroy();
				}
				graphRef.current = null;
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [dataKey]);

		// 선택된 노드 상태 업데이트
		useEffect(() => {
			if (cleanupRef.current) return;
			if (!graphRef.current || graphRef.current.destroyed) return;

			const g6Graph = graphRef.current;

			// 렌더링 완료 후 상태 업데이트를 위해 약간의 지연
			const timeoutId = setTimeout(() => {
				if (
					cleanupRef.current ||
					!graphRef.current ||
					graphRef.current.destroyed
				)
					return;

				try {
					const nodeIds = g6Graph.getNodeData().map((n) => n.id);

					nodeIds.forEach((nodeId) => {
						if (cleanupRef.current || g6Graph.destroyed) return;
						g6Graph.setElementState(nodeId, []);
					});

					if (selectedNodeId && nodeIds.includes(selectedNodeId)) {
						if (cleanupRef.current || g6Graph.destroyed) return;
						g6Graph.setElementState(selectedNodeId, ["selected"]);
					}
				} catch {
					// 그래프가 렌더링 중이거나 파괴된 경우 무시
				}
			}, 100);

			return () => clearTimeout(timeoutId);
		}, [selectedNodeId, dataKey]);

		return (
			<div
				ref={containerRef}
				className="h-full w-full rounded-xl bg-content1"
				style={{ minHeight: "500px" }}
			/>
		);
	},
);
