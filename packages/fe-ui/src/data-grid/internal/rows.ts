import type {
	DataGridChangesState,
	DataGridRowData,
	DataGridRowKey,
} from "@cocrepo/type";

function getRowIdentity(rowId: DataGridRowKey) {
	return `${typeof rowId}:${String(rowId)}`;
}

function collectRowIdentities<TData extends DataGridRowData>(
	rows: TData[],
	getSubRows?: (row: TData, index: number) => TData[] | undefined,
	identities = new Set<string>(),
	visitedRows = new Set<TData>(),
) {
	rows.forEach((row, index) => {
		if (visitedRows.has(row)) {
			return;
		}

		visitedRows.add(row);
		identities.add(getRowIdentity(row.id));
		const subRows = getSubRows?.(row, index);
		if (subRows?.length) {
			collectRowIdentities(subRows, getSubRows, identities, visitedRows);
		}
	});

	return identities;
}

/** 삭제 행을 제외하고 생성·수정 내역을 합친 최상위 렌더링 행을 반환합니다. */
export function getDataGridRows<TData extends DataGridRowData>(
	rows: TData[],
	changes?: DataGridChangesState,
	getSubRows?: (row: TData, index: number) => TData[] | undefined,
) {
	if (!changes) {
		return rows;
	}

	const existingIdentities = collectRowIdentities(rows, getSubRows);
	const createdRootRows = changes
		.getCreatedRows<TData>()
		.filter((row) => !existingIdentities.has(getRowIdentity(row.id)));

	return [...rows, ...createdRootRows]
		.filter((row) => !changes.isDeleted(row.id))
		.map((row) => changes.getRow(row));
}

/** 실제 자식 행에도 삭제와 현재 수정 값을 동일하게 적용합니다. */
export function getDataGridSubRows<TData extends DataGridRowData>(
	row: TData,
	index: number,
	getSubRows: (row: TData, index: number) => TData[] | undefined,
	changes?: DataGridChangesState,
) {
	const subRows = getSubRows(row, index);

	if (!changes || !subRows) {
		return subRows;
	}

	return subRows
		.filter((subRow) => !changes.isDeleted(subRow.id))
		.map((subRow) => changes.getRow(subRow));
}
