import type { DataGridQueryStates } from "@cocrepo/type";
import type { SortingState } from "@tanstack/react-table";

export type DataGridSortDirection = "asc" | "desc" | null;

export function getQuerySortValues(queryValues: DataGridQueryStates) {
	const sort = queryValues.sort;
	if (Array.isArray(sort)) {
		return sort.filter((item): item is string => typeof item === "string");
	}
	if (typeof sort === "string" && sort.length > 0) {
		return [sort];
	}
	return [];
}

export function getTableSortingState(queryValues: DataGridQueryStates): SortingState {
	return getQuerySortValues(queryValues).map((sortValue) => ({
		id: sortValue.startsWith("-") ? sortValue.slice(1) : sortValue,
		desc: sortValue.startsWith("-"),
	}));
}

export function getQuerySortValue(sorting: SortingState) {
	return sorting.length === 0
		? null
		: sorting.map(({ id, desc }) => (desc ? `-${id}` : id));
}
