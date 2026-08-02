import type {
	DataGridChangesSnapshot,
	DataGridChangesState as DataGridChangesStateContract,
	DataGridRowData,
	DataGridRowKey,
} from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

const objectPrototype = Object.prototype;

function hasOwnField(value: Record<string, unknown>, field: string) {
	return objectPrototype.hasOwnProperty.call(value, field);
}

/** DataGrid의 원본 행을 유지하면서 저장 전 변경 내역을 관리합니다. */
export class DataGridChangesState implements DataGridChangesStateContract {
	created: DataGridRowData[] = [];
	updated: Array<{
		id: DataGridRowKey;
		changes: Record<string, unknown>;
	}> = [];
	deleted: DataGridRowKey[] = [];

	private originalValues = new Map<DataGridRowKey, Record<string, unknown>>();

	constructor() {
		makeAutoObservable<this, "originalValues">(
			this,
			{ originalValues: false },
			{ autoBind: true },
		);
	}

	/** 임시 id를 가진 새 행을 생성 내역에 추가합니다. */
	addRow<TData extends DataGridRowData>(row: TData) {
		const createdIndex = this.created.findIndex(({ id }) => id === row.id);
		const nextRow = { ...row };

		if (createdIndex >= 0) {
			this.created = this.created.map((createdRow, index) =>
				index === createdIndex ? nextRow : createdRow,
			);
		} else {
			this.created = [...this.created, nextRow];
		}

		this.deleted = this.deleted.filter((rowId) => rowId !== row.id);
	}

	/** 셀 값을 즉시 반영하고 기존 행이면 수정 내역을 기록합니다. */
	setValue<TData extends DataGridRowData, TField extends keyof TData>(
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
		const currentChanges =
			updateIndex >= 0 ? { ...this.updated[updateIndex].changes } : {};

		if (Object.is(value, originalFields[fieldName])) {
			delete currentChanges[fieldName];
		} else {
			currentChanges[fieldName] = value;
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

	/** 한 필드의 수정 내역만 제거합니다. */
	clearValue(rowId: DataGridRowKey, field: string) {
		this.updated = this.updated.flatMap((update) => {
			if (update.id !== rowId) {
				return [update];
			}

			const nextChanges = { ...update.changes };
			delete nextChanges[field];

			return Object.keys(nextChanges).length > 0
				? [{ ...update, changes: nextChanges }]
				: [];
		});

		const originalFields = this.originalValues.get(rowId);
		if (originalFields) {
			delete originalFields[field];
			if (Object.keys(originalFields).length === 0) {
				this.originalValues.delete(rowId);
			}
		}
	}

	/** 새 행은 제거하고 기존 행은 삭제 내역에 추가합니다. */
	deleteRow(rowId: DataGridRowKey) {
		const isCreated = this.created.some(({ id }) => id === rowId);

		if (isCreated) {
			this.created = this.created.filter(({ id }) => id !== rowId);
		} else if (!this.deleted.includes(rowId)) {
			this.deleted = [...this.deleted, rowId];
		}

		this.updated = this.updated.filter(({ id }) => id !== rowId);
		this.originalValues.delete(rowId);
	}

	/** 기존 행의 삭제 표시를 취소합니다. */
	restoreRow(rowId: DataGridRowKey) {
		this.deleted = this.deleted.filter((deletedId) => deletedId !== rowId);
	}

	/** 모든 생성·수정·삭제 내역을 비웁니다. */
	clear() {
		this.created = [];
		this.updated = [];
		this.deleted = [];
		this.originalValues.clear();
	}

	/** 행이 삭제 표시되었는지 반환합니다. */
	isDeleted(rowId: DataGridRowKey) {
		return this.deleted.includes(rowId);
	}

	/** 원본 행에 현재 생성 또는 수정 값을 합쳐 렌더링용 행을 반환합니다. */
	getRow<TData extends DataGridRowData>(row: TData): TData {
		const createdRow = this.created.find(({ id }) => id === row.id);
		const update = this.updated.find(({ id }) => id === row.id);
		if (!createdRow && !update) {
			return row;
		}

		return {
			...row,
			...(createdRow ?? {}),
			...(update?.changes ?? {}),
		} as TData;
	}

	/** 타입이 지정된 생성 행 복사본을 반환합니다. */
	getCreatedRows<TData extends DataGridRowData>() {
		return this.created.map((row) => ({ ...row })) as TData[];
	}

	/** API 저장에 사용할 수 있는 순수 배열 snapshot을 반환합니다. */
	toJSON<TData extends DataGridRowData>(): DataGridChangesSnapshot<TData> {
		return {
			created: this.created.map((row) => ({ ...row })) as TData[],
			updated: this.updated.map((update) => ({
				id: update.id,
				changes: { ...update.changes } as Partial<TData>,
			})),
			deleted: [...this.deleted],
		};
	}
}
