"use client";

import { Card, CardBody, CardHeader, Chip, Input, Spinner } from "@heroui/react";
import {
	Box,
	ExternalLink,
	FileText,
	Monitor,
	MousePointer,
	Search,
	Server,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useRequirementGraph } from "../../hooks/useRequirementGraph";
import { extractScreens } from "../../lib/graph-extractors";

/**
 * 화면설계 목록 페이지 클라이언트 컴포넌트
 * 브레드크럼 선택에 따라 동적으로 데이터 로드
 */
export const ScreenDesignListClient = observer(() => {
	const { graph, isLoading, error } = useRequirementGraph();
	const [searchQuery, setSearchQuery] = useState("");

	// 그래프에서 화면 정보 추출
	const screens = useMemo(() => {
		if (!graph || !graph.nodes.length) {
			return [];
		}
		return extractScreens(graph);
	}, [graph]);

	// 화면별 설계 완료 상태 (screenDesign.markdown 유무로 판단)
	const statuses = useMemo(() => {
		const result: Record<string, boolean> = {};
		for (const node of graph?.nodes ?? []) {
			if (node.type === "screen") {
				const screenDesign = (node.metadata as { markdown?: string } | undefined);
				result[node.id] = !!screenDesign?.markdown?.trim();
			}
		}
		return result;
	}, [graph]);

	// 검색 필터링
	const filteredScreens = screens.filter(
		(screen) =>
			screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			screen.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			screen.path?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// 통계
	const totalCount = screens.length;
	const completedCount = Object.values(statuses).filter(Boolean).length;
	const totalComponents = screens.reduce(
		(sum, s) => sum + s.components.length,
		0,
	);
	const totalApis = screens.reduce((sum, s) => sum + s.apis.length, 0);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Spinner size="lg" />
				<span className="ml-2 text-default-500">화면 데이터 로딩 중...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 flex-col items-center justify-center text-danger">
				<Monitor className="mb-4 size-12" />
				<p>데이터를 불러올 수 없습니다</p>
				<p className="mt-2 text-sm text-default-400">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			{/* 헤더 */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-default-800">화면 설계</h2>
				<p className="mt-1 text-sm text-default-500">
					요구사항 그래프의 화면(L4) 노드별 기획서를 작성합니다
				</p>

				{/* 통계 */}
				<div className="mt-6 flex flex-wrap items-center gap-4">
					<Chip size="sm" variant="flat">
						전체 {totalCount}개
					</Chip>
					<Chip size="sm" variant="flat" color="success">
						작성 완료 {completedCount}개
					</Chip>
					<Chip size="sm" variant="flat" color="warning">
						미작성 {totalCount - completedCount}개
					</Chip>
					<Chip size="sm" variant="flat" color="secondary">
						컴포넌트 {totalComponents}개
					</Chip>
					<Chip size="sm" variant="flat" color="primary">
						API 연결 {totalApis}개
					</Chip>
				</div>

				{/* 검색 */}
				<div className="mt-4">
					<Input
						placeholder="화면 검색..."
						size="sm"
						value={searchQuery}
						onValueChange={setSearchQuery}
						startContent={<Search className="size-4 text-default-400" />}
						className="max-w-xs"
						classNames={{
							inputWrapper: "bg-content2",
						}}
					/>
				</div>
			</div>

			{/* 화면 목록 */}
			{filteredScreens.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-default-500">
					<Monitor className="mb-4 size-12" />
					<p>{totalCount === 0 ? "화면 노드(L4)가 없습니다" : "검색 결과가 없습니다"}</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredScreens.map((screen) => {
						const isCompleted = statuses[screen.id];

						return (
							<Link
								key={screen.id}
								href={`/screens/${screen.id}` as Route}
								className="block w-full"
							>
								<Card
									isPressable
									className="h-[200px] w-full transition-all hover:scale-[1.02] hover:shadow-lg"
								>
									<CardHeader className="flex items-start justify-between gap-2 pb-1">
										<div className="flex min-w-0 flex-1 items-center gap-2">
											<div
												className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
													isCompleted
														? "bg-success/20 text-success"
														: "bg-warning/20 text-warning"
												}`}
											>
												<FileText className="size-3.5" />
											</div>
											<div className="min-w-0 flex-1">
												<h3 className="truncate text-sm font-semibold text-default-800">
													{screen.name}
												</h3>
												<p className="truncate text-xs text-default-400">{screen.id}</p>
											</div>
										</div>
										<Chip
											size="sm"
											variant="flat"
											color={isCompleted ? "success" : "warning"}
											className="shrink-0"
										>
											{isCompleted ? "완료" : "미작성"}
										</Chip>
									</CardHeader>
									<CardBody className="flex flex-col gap-2 pt-0">
										<p className="line-clamp-2 text-xs text-default-600">
											{screen.description || "-"}
										</p>

										{/* 경로 */}
										<div className="flex items-center gap-1 text-xs text-default-400">
											<ExternalLink className="size-3 shrink-0" />
											<code className="truncate">{screen.path || "-"}</code>
										</div>

										{/* 연결 정보 */}
										<div className="mt-auto flex flex-wrap gap-1.5">
											<div className="flex items-center gap-1 rounded-md bg-content2 px-1.5 py-0.5">
												<Box className="size-3 text-secondary" />
												<span className="text-xs text-default-500">
													{screen.components.length}
												</span>
											</div>
											<div className="flex items-center gap-1 rounded-md bg-content2 px-1.5 py-0.5">
												<MousePointer className="size-3 text-warning" />
												<span className="text-xs text-default-500">
													{screen.actions.length}
												</span>
											</div>
											<div className="flex items-center gap-1 rounded-md bg-content2 px-1.5 py-0.5">
												<Server className="size-3 text-primary" />
												<span className="text-xs text-default-500">
													{screen.apis.length}
												</span>
											</div>
										</div>
									</CardBody>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
});
