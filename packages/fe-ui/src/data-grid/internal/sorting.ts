import type { DataGridState } from "@cocrepo/type";

export type DataGridSortDirection = "asc" | "desc" | null;

export function getQuerySortValues(state: DataGridState) {
	const sort = state.query.values.sort;
	if (Array.isArray(sort)) {
		return sort.filter((item): item is string => typeof item === "string");
	}
	if (typeof sort === "string" && sort.length > 0) {
		return [sort];
	}
	return [];
}

export function getSortDirection(
	columnId: string,
	sortValues: string[],
): DataGridSortDirection {
	if (sortValues.includes(columnId)) {
		return "asc";
	}
	if (sortValues.includes(`-${columnId}`)) {
		return "desc";
	}
	return null;
}

export function getNextSortValues(
	columnId: string,
	currentDirection: DataGridSortDirection,
) {
	if (currentDirection === null) {
		return [columnId];
	}
	if (currentDirection === "asc") {
		return [`-${columnId}`];
	}
	return null;
}
