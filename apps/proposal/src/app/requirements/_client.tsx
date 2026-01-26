"use client";

import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { Plus, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import {
	FloatingChatButton,
	FloatingChatPanel,
	GraphSidebar,
	NodeDetail,
	RequirementGraph,
} from "../../components/requirements";
import { useGraphAI } from "../../hooks/useGraphAI";
import { useRequirementGraph } from "../../hooks/useRequirementGraph";

/**
 * 요구사항 그래프 페이지 클라이언트 컴포넌트
 */
export const RequirementsPageClient = observer(() => {
	const {
		graph,
		filter,
		selectedNode,
		isLoading,
		error,
		selectNode,
		selectNodeById,
		updateFilter,
		getFilteredNodeCount,
	} = useRequirementGraph();

	const { askQuestion } = useGraphAI({ graph });
	const [isChatOpen, setIsChatOpen] = useState(false);

	// 키보드 단축키 (⌘K)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsChatOpen((prev) => !prev);
			}
			if (e.key === "Escape" && isChatOpen) {
				setIsChatOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isChatOpen]);

	// 연결된 노드 클릭 핸들러
	const handleConnectedNodeClick = (nodeId: string) => {
		selectNodeById(nodeId);
	};

	// 채팅 열기/닫기 핸들러
	const handleOpenChat = () => setIsChatOpen(true);
	const handleCloseChat = () => setIsChatOpen(false);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner size="lg" label="그래프 로딩 중..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4">
				<p className="text-danger">오류: {error.message}</p>
				<Button color="primary" onPress={() => window.location.reload()}>
					새로고침
				</Button>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col bg-background">
			{/* 헤더 */}
			<header className="flex items-center justify-between border-b border-divider px-6 py-4">
				<div>
					<h1 className="text-2xl font-bold text-default-800">
						요구사항 그래프
					</h1>
					<p className="text-sm text-default-500">
						{graph.name} • 노드 {getFilteredNodeCount()}/{graph.nodes.length}개
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="flat"
						color="default"
						startContent={<RefreshCw className="size-4" />}
					>
						새로고침
					</Button>
					<Button color="primary" startContent={<Plus className="size-4" />}>
						노드 추가
					</Button>
				</div>
			</header>

			{/* 메인 콘텐츠 */}
			<div className="flex flex-1 overflow-hidden">
				{/* 좌측 사이드바 */}
				<aside className="flex w-72 flex-col border-r border-divider bg-content1">
					{/* 필터 패널 */}
					<div className="flex-1 overflow-y-auto p-4">
						<h2 className="mb-3 text-sm font-semibold text-default-700">
							필터
						</h2>
						<GraphSidebar filter={filter} onFilterChange={updateFilter} />
					</div>
				</aside>

				{/* 중앙 그래프 뷰어 */}
				<main className="flex-1 overflow-hidden p-4">
					<Card className="h-full">
						<CardBody className="p-0">
							<RequirementGraph
								graph={graph}
								filter={filter}
								selectedNodeId={selectedNode?.id}
								onNodeSelect={selectNode}
							/>
						</CardBody>
					</Card>
				</main>

				{/* 우측 상세 패널 */}
				<aside className="w-80 border-l border-divider bg-content1 p-4">
					<h2 className="mb-3 text-sm font-semibold text-default-700">
						노드 상세
					</h2>
					<NodeDetail
						node={selectedNode}
						graph={graph}
						onConnectedNodeClick={handleConnectedNodeClick}
					/>
				</aside>
			</div>

			{/* 플로팅 AI 채팅 */}
			{!isChatOpen && <FloatingChatButton onPress={handleOpenChat} />}
			<FloatingChatPanel
				isOpen={isChatOpen}
				onClose={handleCloseChat}
				graph={graph}
				onQuery={askQuestion}
			/>
		</div>
	);
});
