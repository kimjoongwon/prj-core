import type { Row } from "@tanstack/react-table";

export type Key = string | number;

export function createIdCounts<T extends { id: Key }>(rows: T[]) {
	return rows.reduce((counts, row) => {
		const id = String(row.id ?? "row");
		counts.set(id, (counts.get(id) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());
}

/** 중복 id가 있는 행도 안전하게 식별할 수 있는 DataGrid row key를 만듭니다. */
export function getDataGridRowKey<T extends { id: Key }>(
	row: T,
	index: number,
	idCounts?: Map<string, number>,
	parentId?: string,
) {
	const baseId = String(row.id ?? "row");
	if (idCounts?.get(baseId) === 1) {
		return parentId ? `${parentId}/${baseId}` : baseId;
	}

	return `${parentId ?? "row"}:${baseId}:${index}`;
}

export function getVisibleRowKeys<T extends { id: Key }>(tableRows: Row<T>[]) {
	return tableRows.filter((row) => !row.getIsGrouped()).map((row) => row.id);
}
