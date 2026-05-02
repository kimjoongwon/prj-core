"use client";

import { Button, Checkbox, CheckboxGroup, Input } from "@cocrepo/ui/heroui";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

/** 필터 그룹 정의 */
export interface FilterGroup {
	/** 그룹 라벨 */
	label: string;
	/** 그룹에 포함된 값들 */
	values: string[];
}

/** 체크박스 옵션 정의 */
export interface FilterOption {
	/** 옵션 값 */
	value: string;
	/** 옵션 라벨 */
	label: string;
}

/** 필터 상태 */
export interface FilterState {
	/** 선택된 그룹 값들 */
	selectedGroups: string[];
	/** 선택된 옵션 값들 */
	selectedOptions: string[];
	/** 검색어 */
	searchQuery: string;
}

export interface FilterPanelProps {
	/** 필터 상태 */
	filter: FilterState;
	/** 필터 변경 콜백 */
	onFilterChange: (filter: FilterState) => void;
	/** 그룹 필터 목록 */
	groups?: FilterGroup[];
	/** 그룹 필터 제목 */
	groupsTitle?: string;
	/** 옵션 필터 목록 */
	options?: FilterOption[];
	/** 옵션 필터 제목 */
	optionsTitle?: string;
	/** 검색 활성화 */
	showSearch?: boolean;
	/** 검색 플레이스홀더 */
	searchPlaceholder?: string;
	/** 초기화 버튼 텍스트 */
	resetLabel?: string;
	/** 초기 필터 상태 (리셋용) */
	initialFilter?: FilterState;
	/** 추가 컨텐츠 */
	children?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * FilterPanel 컴포넌트
 * 그룹 체크박스, 옵션 체크박스, 검색을 조합한 필터 UI입니다.
 * 필터 상태 관리와 초기화 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   filter={{ selectedGroups: [], selectedOptions: [], searchQuery: "" }}
 *   onFilterChange={setFilter}
 *   groups={[{ label: "카테고리 A", values: ["a1", "a2"] }]}
 *   options={[{ value: "active", label: "활성" }]}
 *   showSearch
 * />
 * ```
 */
export const FilterPanel = observer(
	({
		filter,
		onFilterChange,
		groups = [],
		groupsTitle = "그룹 선택",
		options = [],
		optionsTitle = "옵션 선택",
		showSearch = true,
		searchPlaceholder = "검색...",
		resetLabel = "필터 초기화",
		initialFilter,
		children,
		className = "",
	}: FilterPanelProps) => {
		// 그룹 선택 핸들러
		const handleGroupChange = (groupValues: string[]) => {
			const isAllSelected = groupValues.every((val) =>
				filter.selectedGroups.includes(val),
			);

			if (isAllSelected) {
				onFilterChange({
					...filter,
					selectedGroups: filter.selectedGroups.filter(
						(val) => !groupValues.includes(val),
					),
				});
			} else {
				const newValues = new Set([...filter.selectedGroups, ...groupValues]);
				onFilterChange({
					...filter,
					selectedGroups: Array.from(newValues),
				});
			}
		};

		// 옵션 선택 핸들러
		const handleOptionsChange = (values: string[]) => {
			onFilterChange({
				...filter,
				selectedOptions: values,
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
		const handleReset = () => {
			if (initialFilter) {
				onFilterChange(initialFilter);
			} else {
				onFilterChange({
					selectedGroups: [],
					selectedOptions: [],
					searchQuery: "",
				});
			}
		};

		return (
			<div className={`flex h-full flex-col gap-4 ${className}`}>
				{/* 검색 */}
				{showSearch && (
					<div>
						<h3 className="mb-2 text-sm font-semibold text-default-700">
							검색
						</h3>
						<Input
							placeholder={searchPlaceholder}
							size="sm"
							value={filter.searchQuery}
							onValueChange={handleSearchChange}
							startContent={<Search className="size-4 text-default-400" />}
							classNames={{
								input: "bg-content2",
							}}
						/>
					</div>
				)}

				{/* 그룹 필터 */}
				{groups.length > 0 && (
					<div>
						<h3 className="mb-2 text-sm font-semibold text-default-700">
							{groupsTitle}
						</h3>
						<div className="flex flex-col gap-2">
							{groups.map((group) => {
								const isAllSelected = group.values.every((val) =>
									filter.selectedGroups.includes(val),
								);
								const isPartialSelected =
									!isAllSelected &&
									group.values.some((val) =>
										filter.selectedGroups.includes(val),
									);

								return (
									<Checkbox
										key={group.label}
										size="sm"
										isSelected={isAllSelected}
										isIndeterminate={isPartialSelected}
										onValueChange={() => handleGroupChange(group.values)}
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
				)}

				{/* 옵션 필터 */}
				{options.length > 0 && (
					<div>
						<h3 className="mb-2 text-sm font-semibold text-default-700">
							{optionsTitle}
						</h3>
						<CheckboxGroup
							size="sm"
							value={filter.selectedOptions}
							onValueChange={handleOptionsChange}
							classNames={{
								wrapper: "gap-1",
							}}
						>
							{options.map((option) => (
								<Checkbox
									key={option.value}
									value={option.value}
									classNames={{
										label: "text-sm text-default-600",
									}}
								>
									{option.label}
								</Checkbox>
							))}
						</CheckboxGroup>
					</div>
				)}

				{/* 추가 컨텐츠 */}
				{children}

				{/* 필터 초기화 */}
				<Button
					size="sm"
					variant="flat"
					color="default"
					onPress={handleReset}
					className="mt-auto"
				>
					{resetLabel}
				</Button>
			</div>
		);
	},
);
