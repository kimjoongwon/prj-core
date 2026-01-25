"use client";

import { Button, Checkbox, CheckboxGroup, Input } from "@heroui/react";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";

import type { GraphFilterState, NodeType } from "./types";
import { LEVEL_GROUPS, NODE_TYPE_LABELS } from "./types";

interface GraphSidebarProps {
	/** 필터 상태 */
	filter: GraphFilterState;
	/** 필터 변경 콜백 */
	onFilterChange: (filter: GraphFilterState) => void;
}

/**
 * 그래프 필터링 사이드바
 */
export const GraphSidebar = observer(
	({ filter, onFilterChange }: GraphSidebarProps) => {
		// 레벨 그룹 선택 핸들러
		const handleLevelGroupChange = (groupLevels: number[]) => {
			const isAllSelected = groupLevels.every((level) =>
				filter.selectedLevels.includes(level),
			);

			if (isAllSelected) {
				// 모두 선택되어 있으면 해제
				onFilterChange({
					...filter,
					selectedLevels: filter.selectedLevels.filter(
						(level) => !groupLevels.includes(level),
					),
				});
			} else {
				// 일부만 선택되어 있으면 전체 선택
				const newLevels = new Set([...filter.selectedLevels, ...groupLevels]);
				onFilterChange({
					...filter,
					selectedLevels: Array.from(newLevels),
				});
			}
		};

		// 노드 타입 선택 핸들러
		const handleTypeChange = (types: string[]) => {
			onFilterChange({
				...filter,
				selectedTypes: types as NodeType[],
			});
		};

		// 검색어 변경 핸들러
		const handleSearchChange = (value: string) => {
			onFilterChange({
				...filter,
				searchQuery: value,
			});
		};

		// 필터 초기화
		const handleResetFilters = () => {
			onFilterChange({
				selectedLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				selectedTypes: [],
				searchQuery: "",
			});
		};

		return (
			<div className="flex h-full flex-col gap-4">
				{/* 검색 */}
				<div>
					<h3 className="mb-2 text-sm font-semibold text-default-700">검색</h3>
					<Input
						placeholder="노드 검색..."
						size="sm"
						value={filter.searchQuery}
						onValueChange={handleSearchChange}
						startContent={<Search className="size-4 text-default-400" />}
						classNames={{
							input: "bg-content2",
						}}
					/>
				</div>

				{/* 레벨 필터 */}
				<div>
					<h3 className="mb-2 text-sm font-semibold text-default-700">
						레벨 선택
					</h3>
					<div className="flex flex-col gap-2">
						{LEVEL_GROUPS.map((group) => {
							const isAllSelected = group.levels.every((level) =>
								filter.selectedLevels.includes(level),
							);
							const isPartialSelected =
								!isAllSelected &&
								group.levels.some((level) =>
									filter.selectedLevels.includes(level),
								);

							return (
								<Checkbox
									key={group.label}
									size="sm"
									isSelected={isAllSelected}
									isIndeterminate={isPartialSelected}
									onValueChange={() => handleLevelGroupChange(group.levels)}
									classNames={{
										label: "text-sm text-default-600",
									}}
								>
									{group.label}
								</Checkbox>
							);
						})}
					</div>
				</div>

				{/* 노드 타입 필터 */}
				<div>
					<h3 className="mb-2 text-sm font-semibold text-default-700">
						노드 타입
					</h3>
					<CheckboxGroup
						size="sm"
						value={filter.selectedTypes}
						onValueChange={handleTypeChange}
						classNames={{
							wrapper: "gap-1",
						}}
					>
						{(Object.keys(NODE_TYPE_LABELS) as NodeType[]).map((type) => (
							<Checkbox
								key={type}
								value={type}
								classNames={{
									label: "text-sm text-default-600",
								}}
							>
								{NODE_TYPE_LABELS[type]}
							</Checkbox>
						))}
					</CheckboxGroup>
				</div>

				{/* 필터 초기화 */}
				<Button
					size="sm"
					variant="flat"
					color="default"
					onPress={handleResetFilters}
					className="mt-auto"
				>
					필터 초기화
				</Button>
			</div>
		);
	},
);
