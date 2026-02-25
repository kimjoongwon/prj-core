"use client";

import type { FilterGroup, FilterOption, FilterState } from "@cocrepo/ui";
import { FilterPanel } from "@cocrepo/ui";
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
 * 레벨 그룹을 FilterGroup으로 변환
 */
function convertLevelGroupsToFilterGroups(): FilterGroup[] {
	return LEVEL_GROUPS.map((group) => ({
		label: group.label,
		values: group.levels.map(String),
	}));
}

/**
 * 노드 타입을 FilterOption으로 변환
 */
function convertNodeTypesToOptions(): FilterOption[] {
	return (Object.keys(NODE_TYPE_LABELS) as NodeType[]).map((type) => ({
		value: type,
		label: NODE_TYPE_LABELS[type],
	}));
}

/**
 * GraphFilterState를 FilterState로 변환
 */
function toFilterState(filter: GraphFilterState): FilterState {
	return {
		selectedGroups: filter.selectedLevels.map(String),
		selectedOptions: filter.selectedTypes,
		searchQuery: filter.searchQuery,
	};
}

/**
 * FilterState를 GraphFilterState로 변환
 */
function toGraphFilterState(filterState: FilterState): GraphFilterState {
	return {
		selectedLevels: filterState.selectedGroups.map(Number),
		selectedTypes: filterState.selectedOptions as NodeType[],
		searchQuery: filterState.searchQuery,
	};
}

/**
 * 그래프 필터링 사이드바
 * FilterPanel을 그래프 필터링에 맞게 커스터마이징
 */
export const GraphSidebar = observer(
	({ filter, onFilterChange }: GraphSidebarProps) => {
		const filterState = toFilterState(filter);

		const handleFilterChange = (newFilterState: FilterState) => {
			onFilterChange(toGraphFilterState(newFilterState));
		};

		const initialFilter: FilterState = {
			selectedGroups: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String),
			selectedOptions: [],
			searchQuery: "",
		};

		return (
			<FilterPanel
				filter={filterState}
				onFilterChange={handleFilterChange}
				groups={convertLevelGroupsToFilterGroups()}
				groupsTitle="레벨 선택"
				options={convertNodeTypesToOptions()}
				optionsTitle="노드 타입"
				showSearch
				searchPlaceholder="노드 검색..."
				resetLabel="필터 초기화"
				initialFilter={initialFilter}
			/>
		);
	},
);
