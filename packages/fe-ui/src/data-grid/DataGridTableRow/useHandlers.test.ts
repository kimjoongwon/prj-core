import type { DataGridEditValidationResult } from "@cocrepo/type";
import {
	type ColumnDef,
	createTable,
	getCoreRowModel,
} from "@tanstack/react-table";
import { configure, observable } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { moveToAdjacentCell } from "../DataGridTableBody/useHandlers";
import type { DataGridTableRowState } from "./DataGridTableRow";
import {
	finishEditingCell,
	getCellInteractions,
	startEditingCell,
} from "./useHandlers";

interface EditableRecord {
	id: string;
	name: string;
	isEnabled: boolean;
}

function createEditableTable(
	editable: NonNullable<ColumnDef<EditableRecord>["meta"]>["editable"] = {},
) {
	const table = createTable<EditableRecord>({
		data: [
			{ id: "alpha", name: "Alpha", isEnabled: true },
			{ id: "disabled", name: "Disabled", isEnabled: false },
			{ id: "beta", name: "Beta", isEnabled: true },
		],
		columns: [
			{ accessorKey: "id" },
			{ accessorKey: "name", meta: { editable } },
		],
		getRowId: (record) => record.id,
		getCoreRowModel: getCoreRowModel(),
		state: {},
		onStateChange: () => {},
		renderFallbackValue: null,
	});
	table.setOptions((options) => ({ ...options, state: table.initialState }));
	return table;
}

beforeEach(() => {
	configure({ enforceActions: "always" });
});

afterEach(() => {
	configure({ enforceActions: "observed" });
	vi.restoreAllMocks();
});

describe("DataGrid 행 편집 handlers", () => {
	it("연속된 값 변경과 완료에서 최신 draft를 저장하고 다음 셀로 이동한다", async () => {
		const table = createEditableTable();
		const row = table.getRow("alpha");
		const cell = row.getVisibleCells()[1];
		const state = observable<DataGridTableRowState<EditableRecord>>(
			{ editingCell: null },
			{ editingCell: observable.ref },
		);
		const commitValue = vi.fn();
		const moveCell = vi.fn();
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		startEditingCell(state, row, cell);
		const { editorContext } = getCellInteractions(
			state,
			row,
			cell,
			commitValue,
			moveCell,
		);
		editorContext?.onValueChange("Changed");
		await finishEditingCell(state, row, cell, commitValue, moveCell, "next");
		expect(commitValue).toHaveBeenCalledWith(row.original, "name", "Changed");
		expect(moveCell).toHaveBeenCalledWith("alpha", "name", "next");
		expect(state.editingCell).toBeNull();
		expect(warn).not.toHaveBeenCalled();
	});

	it("비동기 검증 오류를 action으로 기록하고 draft와 편집 위치를 보존한다", async () => {
		let resolveValidation!: (message: DataGridEditValidationResult) => void;
		const validation = new Promise<DataGridEditValidationResult>((resolve) => {
			resolveValidation = resolve;
		});
		const table = createEditableTable({ validate: () => validation });
		const row = table.getRow("alpha");
		const cell = row.getVisibleCells()[1];
		const state = observable<DataGridTableRowState<EditableRecord>>(
			{ editingCell: null },
			{ editingCell: observable.ref },
		);
		const commitValue = vi.fn();
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		startEditingCell(state, row, cell);
		const pending = finishEditingCell(state, row, cell, commitValue, vi.fn());
		expect(state.editingCell?.isValidating).toBe(true);
		resolveValidation("이름이 필요합니다");
		await pending;
		expect(state.editingCell).toMatchObject({
			rowId: "alpha",
			draftValue: "Alpha",
			errorMessage: "이름이 필요합니다",
			isValidating: false,
		});
		expect(commitValue).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
	});

	it("이전 셀의 늦은 검증 결과가 새로 열린 편집 셀을 변경하지 않는다", async () => {
		let resolveValidation!: (message: DataGridEditValidationResult) => void;
		const validation = new Promise<DataGridEditValidationResult>((resolve) => {
			resolveValidation = resolve;
		});
		const table = createEditableTable({ validate: () => validation });
		const firstRow = table.getRow("alpha");
		const firstCell = firstRow.getVisibleCells()[1];
		const nextRow = table.getRow("beta");
		const state = observable<DataGridTableRowState<EditableRecord>>(
			{ editingCell: null },
			{ editingCell: observable.ref },
		);
		const commitValue = vi.fn();
		startEditingCell(state, firstRow, firstCell);
		const pending = finishEditingCell(
			state,
			firstRow,
			firstCell,
			commitValue,
			vi.fn(),
		);
		startEditingCell(state, nextRow, nextRow.getVisibleCells()[1]);
		resolveValidation(undefined);
		await pending;
		expect(state.editingCell).toMatchObject({
			rowId: "beta",
			draftValue: "Beta",
		});
		expect(commitValue).not.toHaveBeenCalled();
	});

	it("인접 셀 이동에서 편집 불가 행과 읽기 전용 열을 건너뛴다", () => {
		const table = createEditableTable({
			isEnabled: (record) => record.isEnabled,
		});
		const state = observable<DataGridTableRowState<EditableRecord>>(
			{ editingCell: null },
			{ editingCell: observable.ref },
		);
		moveToAdjacentCell(table, state, "alpha", "name", "next");
		expect(state.editingCell).toMatchObject({
			rowId: "beta",
			columnId: "name",
		});
		moveToAdjacentCell(table, state, "beta", "name", "previous");
		expect(state.editingCell).toMatchObject({
			rowId: "alpha",
			columnId: "name",
		});
	});
});
