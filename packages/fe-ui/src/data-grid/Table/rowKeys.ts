import type { Row } from "@tanstack/react-table";

/** DTO 식별자는 bigint를 유지하고, React/TanStack 경계에서만 문자열 key로 변환합니다. */
export type Key = string | number | bigint;

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

/**
 * 하나의 rendered row 집합에서 재사용하는 canonical row-key adapter입니다.
 * React와 TanStack Table이 요구하는 string key는 이 경계에서만 만듭니다.
 */
export function createDataGridRowKeyAdapter<T extends { id: Key }>(rows: T[]) {
	const idCounts = createIdCounts(rows);

	return (row: T, index: number, parent?: { id: string }) =>
		getDataGridRowKey(row, index, idCounts, parent?.id);
}

export function getVisibleRowKeys<T extends { id: Key }>(tableRows: Row<T>[]) {
	return tableRows.filter((row) => !row.getIsGrouped()).map((row) => row.id);
}
