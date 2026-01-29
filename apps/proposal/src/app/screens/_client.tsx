"use client";

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
} from "@heroui/react";
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

import type { ScreenView } from "../../components/requirements/types";
import { useRequirementGraph } from "../../hooks/useRequirementGraph";
import { extractScreens, getNodeNames } from "../../lib/graph-extractors";

interface ScreenNode {
	id: string;
	name: string;
	description: string;
	path?: string;
}

interface ScreenDesignListClientProps {
	/** 화면 목록 (서버에서 전달) */
	screens: ScreenNode[];
	/** 화면별 설계 상태 (ID -> 설계 완료 여부) */
	statuses: Record<string, boolean>;
}

/**
 * 화면설계 목록 페이지 클라이언트 컴포넌트
 */
export const ScreenDesignListClient = observer(
	({ screens: serverScreens, statuses }: ScreenDesignListClientProps) => {
		const { graph } = useRequirementGraph();
		const [searchQuery, setSearchQuery] = useState("");

		// 그래프에서 추가 정보 추출
		const enrichedScreens = useMemo(() => {
			if (!graph) {
				return serverScreens.map((s) => ({
					...s,
					components: [],
					actions: [],
					apis: [],
				}));
			}

			const screenViews = extractScreens(graph);
			const screenViewMap = new Map(screenViews.map((sv) => [sv.id, sv]));

			return serverScreens.map((s) => {
				const view = screenViewMap.get(s.id);
				return {
					...s,
					components: view?.components ?? [],
					actions: view?.actions ?? [],
					apis: view?.apis ?? [],
				};
			});
		}, [serverScreens, graph]);

		// 검색 필터링
		const filteredScreens = enrichedScreens.filter(
			(screen) =>
				screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				screen.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				screen.path?.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		// 통계
		const totalCount = enrichedScreens.length;
		const completedCount = Object.values(statuses).filter(Boolean).length;
		const totalComponents = enrichedScreens.reduce(
			(sum, s) => sum + s.components.length,
			0,
		);
		const totalApis = enrichedScreens.reduce(
			(sum, s) => sum + s.apis.length,
			0,
		);

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
						<p>검색 결과가 없습니다</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filteredScreens.map((screen) => {
							const isCompleted = statuses[screen.id];

							return (
								<Link
									key={screen.id}
									href={`/screens/${screen.id}` as Route}
									className="block"
								>
									<Card
										isPressable
										className="h-full transition-all hover:scale-[1.02] hover:shadow-lg"
									>
										<CardHeader className="flex items-start justify-between gap-2 pb-2">
											<div className="flex items-center gap-2">
												<div
													className={`flex size-8 items-center justify-center rounded-lg ${
														isCompleted
															? "bg-success/20 text-success"
															: "bg-warning/20 text-warning"
													}`}
												>
													<FileText className="size-4" />
												</div>
												<div>
													<h3 className="text-sm font-semibold text-default-800">
														{screen.name}
													</h3>
													<p className="text-xs text-default-400">
														{screen.id}
													</p>
												</div>
											</div>
											<Chip
												size="sm"
												variant="flat"
												color={isCompleted ? "success" : "warning"}
											>
												{isCompleted ? "완료" : "미작성"}
											</Chip>
										</CardHeader>
										<CardBody className="pt-0">
											<p className="mb-3 line-clamp-2 text-sm text-default-600">
												{screen.description}
											</p>

											{/* 경로 */}
											{screen.path && (
												<div className="mb-3 flex items-center gap-1 text-xs text-default-400">
													<ExternalLink className="size-3" />
													<code>{screen.path}</code>
												</div>
											)}

											{/* 연결 정보 */}
											<div className="flex flex-wrap gap-2">
												{screen.components.length > 0 && (
													<div className="flex items-center gap-1 rounded-md bg-content2 px-2 py-1">
														<Box className="size-3 text-secondary" />
														<span className="text-xs text-default-500">
															{screen.components.length}개 컴포넌트
														</span>
													</div>
												)}
												{screen.actions.length > 0 && (
													<div className="flex items-center gap-1 rounded-md bg-content2 px-2 py-1">
														<MousePointer className="size-3 text-warning" />
														<span className="text-xs text-default-500">
															{screen.actions.length}개 액션
														</span>
													</div>
												)}
												{screen.apis.length > 0 && (
													<div className="flex items-center gap-1 rounded-md bg-content2 px-2 py-1">
														<Server className="size-3 text-primary" />
														<span className="text-xs text-default-500">
															{screen.apis.length}개 API
														</span>
													</div>
												)}
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
	},
);
