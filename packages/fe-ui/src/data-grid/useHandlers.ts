"use client";

import type { SortingState } from "@tanstack/react-table";
import { action } from "mobx";
import {
	DATA_GRID_DEFAULT_PAGE_SIZE,
	type DataGridQueryState,
	type DataGridRow,
	type DataGridState,
	type Key,
} from "./DataGrid";

/** nuqs의 원본 query를 필터·정렬·페이지 데이터로 해석합니다. */
export const parseQuery = (
	query: Record<string, unknown> = {},
): DataGridQueryState => {
	const { sort, take, skip, page: _page, ...filters } = query;
	const sortValues = Array.isArray(sort)
		? sort.filter(
				(sortValue): sortValue is string => typeof sortValue === "string",
			)
		: typeof sort === "string" && sort.length > 0
			? [sort]
			: [];
	const sorting: SortingState = sortValues.map((sortValue) => ({
		id: sortValue.startsWith("-") ? sortValue.slice(1) : sortValue,
		desc: sortValue.startsWith("-"),
	}));
	const pageSize = Number(take);
	const pageOffset = Number(skip);
	return {
		filters,
		sort: sorting,
		pagination: {
			take:
				Number.isFinite(pageSize) && pageSize > 0
					? pageSize
					: DATA_GRID_DEFAULT_PAGE_SIZE,
			skip: Number.isFinite(pageOffset) && pageOffset > 0 ? pageOffset : 0,
		},
	};
};

/** 조회 결과와 함께 전달된 원본 query를 기존 상태에 반영합니다. */
export const updateQuery = action(
	(state: DataGridQueryState, query: Record<string, unknown>) => {
		Object.assign(state, parseQuery(query));
	},
);

/** TanStack 정렬을 query의 field/-field 표기로 변환합니다. */
export const getSortQueryValues = (sorting: SortingState) =>
	sorting.map(({ id, desc }) => (desc ? `-${id}` : id));

/** 새 행을 기록하고 같은 ID의 삭제 표시를 취소합니다. */
export const addRow = action(
	<TData extends DataGridRow>(state: DataGridState<TData>, row: TData) => {
		const createdIndex = state.created.findIndex(({ id }) => id === row.id);
		const nextRow = { ...row };
		state.created =
			createdIndex >= 0
				? state.created.map((createdRow, index) =>
						index === createdIndex ? nextRow : createdRow,
					)
				: [...state.created, nextRow];
		state.deleted = state.deleted.filter((rowId) => rowId !== row.id);
	},
);

/** 행 필드의 원본값을 보존하고 원본과 다른 변경분만 기록합니다. */
export const setValue = action(
	<TData extends DataGridRow, TField extends keyof TData>(
		state: DataGridState<TData>,
		row: TData,
		field: TField,
		value: TData[TField],
	) => {
		const fieldName = String(field);
		const createdIndex = state.created.findIndex(({ id }) => id === row.id);
		if (createdIndex >= 0) {
			state.created = state.created.map((createdRow, index) =>
				index === createdIndex ? { ...createdRow, [field]: value } : createdRow,
			);
			return;
		}
		const originalFields = state.originalValues.get(row.id) ?? {};
		// Object.hasOwn은 ES2022 lib이 필요해 소비 앱(tsconfig lib ES2020) 컴파일을 깨므로 own-property 등가 검사로 대체합니다.
		// biome-ignore lint/suspicious/noPrototypeBuiltins: 위와 같은 이유로 Object.hasOwn 대신 등가 검사를 유지합니다.
		if (!Object.prototype.hasOwnProperty.call(originalFields, fieldName)) {
			originalFields[fieldName] = row[field];
			state.originalValues.set(row.id, originalFields);
		}
		const updateIndex = state.updated.findIndex(({ id }) => id === row.id);
		const changes: Partial<TData> =
			updateIndex >= 0 ? { ...state.updated[updateIndex].changes } : {};
		if (Object.is(value, originalFields[fieldName])) {
			delete changes[field];
		} else {
			changes[field] = value;
		}
		if (Object.keys(changes).length === 0) {
			state.updated = state.updated.filter(({ id }) => id !== row.id);
			return;
		}
		const nextUpdate = { id: row.id, changes };
		state.updated =
			updateIndex >= 0
				? state.updated.map((update, index) =>
						index === updateIndex ? nextUpdate : update,
					)
				: [...state.updated, nextUpdate];
	},
);

/** 새 행은 생성분에서 제거하고 기존 행은 삭제 변경으로 기록합니다. */
export const deleteRow = action(
	<TData extends DataGridRow>(state: DataGridState<TData>, rowId: Key) => {
		if (state.created.some(({ id }) => id === rowId)) {
			state.created = state.created.filter(({ id }) => id !== rowId);
		} else if (!state.deleted.includes(rowId)) {
			state.deleted = [...state.deleted, rowId];
		}
		state.updated = state.updated.filter(({ id }) => id !== rowId);
		state.originalValues.delete(rowId);
	},
);

/** 저장 또는 취소가 완료된 변경분과 원본값을 비웁니다. */
export const clearChanges = action(
	<TData extends DataGridRow>(state: DataGridState<TData>) => {
		state.created = [];
		state.updated = [];
		state.deleted = [];
		state.originalValues.clear();
	},
);

/** 원본 행에 현재 생성·수정 값을 반영합니다. */
export const getRow = <TData extends DataGridRow>(
	state: DataGridState<TData>,
	row: TData,
): TData => {
	const createdRow = state.created.find(({ id }) => id === row.id);
	const update = state.updated.find(({ id }) => id === row.id);
	return createdRow || update
		? { ...row, ...createdRow, ...update?.changes }
		: row;
};

/** 저장용 생성·수정·삭제 변경분의 복사본을 반환합니다. */
export const getChangesSnapshot = <TData extends DataGridRow>(
	state: DataGridState<TData>,
) => ({
	created: state.created.map((row) => ({ ...row })),
	updated: state.updated.map((update) => ({
		id: update.id,
		changes: { ...update.changes },
	})),
	deleted: [...state.deleted],
});

/** 원본 목록에 변경분을 반영한 표시 행을 반환합니다. */
export const combineRowsWithChanges = <TData extends DataGridRow>(
	state: DataGridState<TData>,
	rows: TData[],
) => [
	...rows
		.filter((row) => !state.deleted.includes(row.id))
		.map((row) => getRow(state, row)),
	...state.created
		.filter((row) => !rows.some(({ id }) => id === row.id))
		.map((row) => ({ ...row })),
];

/** DataGrid 데이터에 대한 동작을 제공합니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridState<TData>,
) => ({
	updateQuery: (query: Record<string, unknown>) =>
		updateQuery(state.query, query),
	addRow: (row: TData) => addRow(state, row),
	setValue: <TField extends keyof TData>(
		row: TData,
		field: TField,
		value: TData[TField],
	) => setValue(state, row, field, value),
	deleteRow: (rowId: Key) => deleteRow(state, rowId),
	clearChanges: () => clearChanges(state),
	getRow: (row: TData) => getRow(state, row),
	getChangesSnapshot: () => getChangesSnapshot(state),
	combineRowsWithChanges: (rows: TData[]) =>
		combineRowsWithChanges(state, rows),
});
