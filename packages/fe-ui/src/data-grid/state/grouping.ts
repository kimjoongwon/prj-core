import type { DataGridColumnConfig, DataGridQueryStates } from "@cocrepo/type";
import type { Row } from "@tanstack/react-table";
import type { Key } from "../Table/rowKeys";

export const DATA_GRID_GROUP_BY_QUERY_KEY = "groupBy";

const objectPrototype = Object.prototype;

export type DataGridBodyRow<T extends { id: Key }> = Row<T>;

function toStringArray(value: unknown) {
	if (Array.isArray(value)) {
		return value.filter((item): item is string => typeof item === "string");
	}
	if (typeof value === "string" && value.length > 0) {
		return [value];
	}
	return [];
}

function hasOwnRecordKey(value: Record<string, unknown>, key: string) {
	return objectPrototype.hasOwnProperty.call(value, key);
}

function getColumnId<TData>(column: DataGridColumnConfig<TData, unknown>) {
	return String(column.field);
}

export function getQueryGroupByValues(
	queryValues: DataGridQueryStates,
	queryKey = DATA_GRID_GROUP_BY_QUERY_KEY,
) {
	return Array.from(new Set(toStringArray(queryValues[queryKey])));
}

export function hasQueryGroupBy(
	queryValues: DataGridQueryStates,
	queryKey = DATA_GRID_GROUP_BY_QUERY_KEY,
) {
	return hasOwnRecordKey(queryValues, queryKey);
}

export function filterGroupByColumnIds<TData>(
	groupBy: string[],
	columns: DataGridColumnConfig<TData, unknown>[],
) {
	const columnIds = new Set(columns.map(getColumnId));
	return groupBy.filter((columnId) => columnIds.has(columnId));
}
