"use client";

import type {
	DataGridSelectionState,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import { type SortingState } from "@tanstack/react-table";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import {
	DataGridActionBar,
	DataGridActionBarState,
} from "./DataGridActionBar/DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import {
	DataGridGroupPanel,
	DataGridGroupPanelState,
} from "./DataGridGroupPanel/DataGridGroupPanel";
import {
	DataGridPagination,
	DataGridPaginationState,
} from "./DataGridPagination/DataGridPagination";
import {
	DataGridTable,
	type DataGridTableState,
} from "./DataGridTable/DataGridTable";
import {
	DataGridToolbar,
	DataGridToolbarState,
} from "./DataGridToolbar/DataGridToolbar";

const objectPrototype = Object.prototype;

export type Key = string | number | bigint;
type DataGridRow = { id: Key };

/** nuqs의 query 값을 DataGrid와 TanStack Table이 사용하는 형태로 해석합니다. */
export class DataGridQueryState {
	filters: { [x: string]: unknown } = {};
	sort: SortingState = [];
	pagination: {
		take: number;
		skip: number;
	} = { take: 20, skip: 0 };

	/** 원본 query 값에서 필터, 정렬, 페이지 값을 초기화합니다. */
	constructor(query: { [x: string]: unknown }) {
		this.update(query);
		makeAutoObservable(this, {}, { autoBind: true });
	}

	/** TanStack Table의 정렬 상태를 query의 `field` 또는 `-field` 표기로 변환합니다. */
	getSortQueryValues(sorting: SortingState) {
		return sorting.map(({ id, desc }) => (desc ? `-${id}` : id));
	}

	/** 바뀐 원본 query를 필터, 정렬, 페이지 상태로 다시 파싱합니다. */
	update(query: { [x: string]: unknown }) {
		const { sort, take, skip } = query;
		this.filters = { ...query };
		delete this.filters.sort;
		delete this.filters.take;
		delete this.filters.skip;
		delete this.filters.page;
		const sortValues = Array.isArray(sort)
			? sort.filter((value): value is string => typeof value === "string")
			: typeof sort === "string" && sort.length > 0
				? [sort]
				: [];
		this.sort = sortValues.map((sortValue) => ({
			id: sortValue.startsWith("-") ? sortValue.slice(1) : sortValue,
			desc: sortValue.startsWith("-"),
		}));

		const pageSize = Number(take);
		const pageOffset = Number(skip);
		this.pagination = {
			take: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20,
			skip: Number.isFinite(pageOffset) && pageOffset > 0 ? pageOffset : 0,
		};
	}
}
/** DataGridState가 보유한 설정과 데이터를 TanStack Table UI로 렌더링합니다. */
export function DataGrid<TData extends { id: Key }>({
	state,
}: {
	state: DataGridState<TData>;
}) {
	return (
		<DataGridContainer>
			{state.toolbar ? <DataGridToolbar state={state.toolbar} /> : null}
			{state.groupPanel ? (
				<DataGridGroupPanel state={state.groupPanel} />
			) : null}
			<DataGridTable state={state} />
			{state.pagination ? (
				<DataGridPagination state={state.pagination} />
			) : null}
			{state.actionBar ? <DataGridActionBar state={state.actionBar} /> : null}
		</DataGridContainer>
	);
}

/** 객체가 상속된 속성이 아닌 자체 속성을 갖는지 확인합니다. */
function hasOwnField(value: Record<string, unknown>, field: string) {
	return objectPrototype.hasOwnProperty.call(value, field);
}

interface DataGridChangesSnapshot<TData extends { id: Key }> {
	created: TData[];
	updated: Array<{ id: Key; changes: Partial<TData> }>;
	deleted: Key[];
}

export class DataGridState<TData extends DataGridRow = DataGridRow> {
	query: DataGridQueryState;
	querySetter: DataGridSetQueryStates;
	rows: TData[] = [];
	selection?: DataGridSelectionState;
	created: TData[] = [];
	updated: Array<{ id: Key; changes: Partial<TData> }> = [];
	deleted: Key[] = [];
	originalValues = new Map<Key, Record<string, unknown>>();
	toolbar?: DataGridToolbarState;
	groupPanel?: DataGridGroupPanelState;
	table: DataGridTableState<TData>;
	pagination?: DataGridPaginationState;
	actionBar?: DataGridActionBarState;

	/** DataGrid의 query, 데이터와 선택적 영역 상태를 구성합니다. */
	constructor({
		query,
		setQueryStates,
		rows = [],
		toolbar,
		groupPanel,
		table,
		pagination,
		actionBar,
	}: {
		query: DataGridQueryState;
		setQueryStates: DataGridSetQueryStates;
		rows?: TData[];
		toolbar?: DataGridToolbarState;
		groupPanel?: DataGridGroupPanelState;
		table: DataGridTableState<TData>;
		pagination?: DataGridPaginationState;
		actionBar?: DataGridActionBarState;
	}) {
		this.query = query;
		this.querySetter = setQueryStates;
		this.rows = rows;
		this.toolbar = toolbar;
		this.groupPanel = groupPanel;
		this.table = table;
		this.pagination = pagination;
		this.actionBar = actionBar;
		makeAutoObservable<this, "originalValues">(this, undefined, {
			autoBind: true,
		});
	}

	/** 새 행을 생성 변경으로 등록하고 같은 ID의 삭제 표시를 취소합니다. */
	addRow(row: TData) {
		const createdIndex = this.created.findIndex(({ id }) => id === row.id);
		const nextRow = { ...row };
		this.created =
			createdIndex >= 0
				? this.created.map((createdRow, index) =>
						index === createdIndex ? nextRow : createdRow,
					)
				: [...this.created, nextRow];
		this.deleted = this.deleted.filter((rowId) => rowId !== row.id);
	}

	/** 행 필드의 원본 값을 보존하고 변경분을 기록합니다. */
	setValue<TField extends keyof TData>(
		row: TData,
		field: TField,
		value: TData[TField],
	) {
		const fieldName = String(field);
		const createdIndex = this.created.findIndex(({ id }) => id === row.id);
		if (createdIndex >= 0) {
			this.created = this.created.map((createdRow, index) =>
				index === createdIndex
					? { ...createdRow, [fieldName]: value }
					: createdRow,
			);
			return;
		}

		const originalFields = this.originalValues.get(row.id) ?? {};
		if (!hasOwnField(originalFields, fieldName)) {
			originalFields[fieldName] = row[field];
			this.originalValues.set(row.id, originalFields);
		}
		const updateIndex = this.updated.findIndex(({ id }) => id === row.id);
		const currentChanges: Partial<TData> =
			updateIndex >= 0 ? { ...this.updated[updateIndex].changes } : {};
		const currentChangeFields = currentChanges as Record<string, unknown>;
		if (Object.is(value, originalFields[fieldName])) {
			delete currentChangeFields[fieldName];
		} else {
			currentChangeFields[fieldName] = value;
		}
		if (Object.keys(currentChanges).length === 0) {
			this.updated = this.updated.filter(({ id }) => id !== row.id);
			return;
		}
		const nextUpdate = { id: row.id, changes: currentChanges };
		this.updated =
			updateIndex >= 0
				? this.updated.map((update, index) =>
						index === updateIndex ? nextUpdate : update,
					)
				: [...this.updated, nextUpdate];
	}

	/** 새 행은 생성 목록에서 제거하고 기존 행은 삭제 변경으로 기록합니다. */
	deleteRow(rowId: Key) {
		const isCreated = this.created.some(({ id }) => id === rowId);
		if (isCreated) {
			this.created = this.created.filter(({ id }) => id !== rowId);
		} else if (!this.deleted.includes(rowId)) {
			this.deleted = [...this.deleted, rowId];
		}
		this.updated = this.updated.filter(({ id }) => id !== rowId);
		this.originalValues.delete(rowId);
	}

	/** 현재까지 기록한 생성·수정·삭제 변경을 모두 비웁니다. */
	clear() {
		this.created = [];
		this.updated = [];
		this.deleted = [];
		this.originalValues.clear();
	}

	/** 행 원본에 해당 행의 생성 또는 수정 값을 덮어쓴 결과를 반환합니다. */
	getRow(row: TData): TData {
		const createdRow = this.created.find(({ id }) => id === row.id);
		const update = this.updated.find(({ id }) => id === row.id);
		if (!createdRow && !update) return row;
		return {
			...row,
			...(createdRow ?? {}),
			...(update?.changes ?? {}),
		} as TData;
	}

	/** 현재 변경 내역을 외부에서 전달할 수 있는 복사본으로 반환합니다. */
	toJSON(): DataGridChangesSnapshot<TData> {
		return {
			created: this.created.map((row) => ({ ...row })) as TData[],
			updated: this.updated.map((update) => ({
				id: update.id,
				changes: { ...update.changes } as Partial<TData>,
			})),
			deleted: [...this.deleted],
		};
	}

	/** 원본 행에 생성·수정·삭제 변경사항을 반영한 행을 반환합니다. */
	/** 원본 행 목록에 수정 내용을 적용하고 삭제 행은 제외한 렌더링 목록을 반환합니다. */
	combineRowsWithChanges(rows: TData[]) {
		const createdRows = this.created;
		return [
			...rows
				.filter((row) => !this.deleted.includes(row.id))
				.map((row) => this.getRow(row)),
			...createdRows
				.map((row) => ({ ...row }))
				.filter((createdRow) => !rows.some((row) => row.id === createdRow.id)),
		];
	}
}

export default observer(DataGrid);
