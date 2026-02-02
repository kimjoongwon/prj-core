"use client";

import { Spinner } from "@heroui/react";
import { Monitor } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";

import { useRequirementGraph } from "../../../hooks/useRequirementGraph";
import { ScreenDesignClient } from "./_client";

/**
 * 화면설계 상세 페이지
 * SOT 원칙: useRequirementGraph 훅을 통해 목록 페이지와 동일한 데이터 소스 사용
 */
const ScreenDesignPage = observer(() => {
	const params = useParams();
	const screenId = params.screenId as string;

	const { graph, isLoading, error } = useRequirementGraph();

	// 로딩 중
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Spinner size="lg" />
				<span className="ml-2 text-default-500">화면 데이터 로딩 중...</span>
			</div>
		);
	}

	// 에러
	if (error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center text-danger">
				<Monitor className="mb-4 size-12" />
				<p>데이터를 불러올 수 없습니다</p>
				<p className="mt-2 text-sm text-default-400">{error.message}</p>
			</div>
		);
	}

	// 그래프에서 화면 노드 찾기
	const screenNode = graph.nodes.find(
		(node) => node.id === screenId && node.type === "screen",
	);

	if (!screenNode) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<Monitor className="mx-auto mb-4 size-12 text-danger" />
					<h1 className="text-xl font-bold text-danger">화면을 찾을 수 없음</h1>
					<p className="mt-2 text-default-500">ID: {screenId}</p>
					<p className="mt-1 text-sm text-default-400">
						브레드크럼에서 올바른 기획서를 선택했는지 확인해주세요.
					</p>
				</div>
			</div>
		);
	}

	// 메타데이터에서 screenDesign 정보 추출 (SOT: req-L3L4-planner 에이전트 구조 준수)
	const metadata = screenNode.metadata as
		| {
				screenDesign?: {
					markdown?: string;
					figmaUrl?: string;
					updatedAt?: string | null;
				};
		  }
		| undefined;

	const screenDesign = metadata?.screenDesign;

	return (
		<ScreenDesignClient
			screenId={screenId}
			screen={{
				id: screenNode.id,
				name: screenNode.name,
				description: screenNode.description,
				path: screenNode.path,
			}}
			initialMarkdown={screenDesign?.markdown ?? ""}
			initialFigmaUrl={screenDesign?.figmaUrl ?? ""}
		/>
	);
});

export default ScreenDesignPage;
