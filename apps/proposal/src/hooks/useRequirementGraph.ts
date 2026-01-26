"use client";

import { useEffect, useState } from "react";

import type {
	GraphFilterState,
	RequirementGraph,
	RequirementNode,
} from "../components/requirements/types";
import { loadGraphFromAPI } from "../lib/graph-data";

/**
 * 기본 필터 상태
 */
const DEFAULT_FILTER: GraphFilterState = {
	selectedLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	selectedTypes: [],
	searchQuery: "",
};

/**
 * 기본 그래프 구조 (초기 상태용)
 */
const EMPTY_GRAPH: RequirementGraph = {
	id: "",
	name: "",
	version: "",
	nodes: [],
	edges: [],
	metadata: {
		createdAt: "",
		updatedAt: "",
	},
};

/**
 * 요구사항 그래프 데이터 및 상태 관리 훅
 */
export function useRequirementGraph() {
	// 그래프 데이터
	const [graph, setGraph] = useState<RequirementGraph>(EMPTY_GRAPH);

	// 필터 상태
	const [filter, setFilter] = useState<GraphFilterState>(DEFAULT_FILTER);

	// 선택된 노드
	const [selectedNode, setSelectedNode] = useState<RequirementNode | null>(
		null,
	);

	// 로딩 상태
	const [isLoading, setIsLoading] = useState(true);

	// 에러 상태
	const [error, setError] = useState<Error | null>(null);

	/**
	 * 그래프 데이터 로드 (API에서)
	 */
	const loadGraph = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await loadGraphFromAPI();
			setGraph(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("그래프 로드 실패"));
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * 노드 선택
	 */
	const selectNode = (node: RequirementNode | null) => {
		setSelectedNode(node);
	};

	/**
	 * 노드 ID로 선택
	 */
	const selectNodeById = (nodeId: string) => {
		const node = graph.nodes.find((n) => n.id === nodeId);
		setSelectedNode(node || null);
	};

	/**
	 * 필터 변경
	 */
	const updateFilter = (newFilter: GraphFilterState) => {
		setFilter(newFilter);
	};

	/**
	 * 필터 초기화
	 */
	const resetFilter = () => {
		setFilter(DEFAULT_FILTER);
	};

	/**
	 * 필터링된 노드 개수
	 */
	const getFilteredNodeCount = () => {
		return graph.nodes.filter((node) => {
			if (!filter.selectedLevels.includes(node.level)) return false;
			if (
				filter.selectedTypes.length > 0 &&
				!filter.selectedTypes.includes(node.type)
			)
				return false;
			if (filter.searchQuery) {
				const query = filter.searchQuery.toLowerCase();
				return (
					node.name.toLowerCase().includes(query) ||
					node.description.toLowerCase().includes(query)
				);
			}
			return true;
		}).length;
	};

	/**
	 * 연결된 노드 찾기
	 */
	const getConnectedNodes = (nodeId: string) => {
		const incoming = graph.edges
			.filter((e) => e.target === nodeId)
			.map((e) => graph.nodes.find((n) => n.id === e.source))
			.filter(Boolean) as RequirementNode[];

		const outgoing = graph.edges
			.filter((e) => e.source === nodeId)
			.map((e) => graph.nodes.find((n) => n.id === e.target))
			.filter(Boolean) as RequirementNode[];

		return { incoming, outgoing };
	};

	/**
	 * 영향도 분석 (특정 노드 변경 시 영향받는 노드들)
	 */
	const analyzeImpact = (nodeId: string): RequirementNode[] => {
		const visited = new Set<string>();
		const impacted: RequirementNode[] = [];

		const traverse = (currentId: string) => {
			if (visited.has(currentId)) return;
			visited.add(currentId);

			// 이 노드에 의존하는 노드들 (들어오는 엣지의 소스)
			graph.edges
				.filter((e) => e.target === currentId)
				.forEach((edge) => {
					const node = graph.nodes.find((n) => n.id === edge.source);
					if (node && !visited.has(node.id)) {
						impacted.push(node);
						traverse(node.id);
					}
				});
		};

		traverse(nodeId);
		return impacted;
	};

	// 초기 로드
	useEffect(() => {
		loadGraph();
	}, []);

	return {
		// 상태
		graph,
		filter,
		selectedNode,
		isLoading,
		error,

		// 액션
		loadGraph,
		selectNode,
		selectNodeById,
		updateFilter,
		resetFilter,

		// 유틸리티
		getFilteredNodeCount,
		getConnectedNodes,
		analyzeImpact,
	};
}
