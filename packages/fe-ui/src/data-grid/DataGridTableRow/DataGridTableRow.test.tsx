import { createTable, getCoreRowModel } from "@tanstack/react-table";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { observable, runInAction } from "mobx";
import { describe, expect, it, vi } from "vitest";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";
import {
	DataGridTableRow,
	type DataGridTableRowState,
} from "./DataGridTableRow";

describe("DataGridTableRow 편집 요청", () => {
	it("Row 상태의 클릭 설정을 사용하고 편집 요청 변경을 구독·해제한다", () => {
		const table = createTable({
			data: [{ id: "alpha", name: "Alpha" }],
			columns: [
				{
					accessorKey: "name",
					meta: { editable: { editor: { type: "text" } } },
				},
			],
			getRowId: (record) => record.id,
			getCoreRowModel: getCoreRowModel(),
			state: {},
			onStateChange: () => {},
			renderFallbackValue: null,
		});
		table.setOptions((options) => ({ ...options, state: table.initialState }));
		const onClick = vi.fn();
		const state = observable<
			DataGridTableRowState<{ id: string; name: string }>
		>(
			{ editingCell: null, editRequest: undefined, onClick },
			{
				editingCell: observable.ref,
				editRequest: observable.ref,
				onClick: false,
			},
		);
		const tableState = observable<
			DataGridTableState<{ id: string; name: string }>
		>(
			{
				rows: table.options.data,
				row: state,
				columns: table.options.columns,
				expandedRowIds: {},
				selectedRowKeys: new Set<string>(),
				selection: undefined,
				getSubRows: undefined,
				instance: table,
			},
			{ columns: observable.ref, instance: false, row: false },
		);
		const { unmount } = render(
			<table>
				<tbody>
					<DataGridTableRow
						tableState={tableState}
						state={state}
						row={table.getRow("alpha")}
						selectionMode={undefined}
						selectionGroupName="test"
						onCellValueChange={vi.fn()}
						onMoveToAdjacentCell={vi.fn()}
					/>
				</tbody>
			</table>,
		);
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		const rowElement = screen.getByRole("row");
		fireEvent.click(rowElement);
		fireEvent.keyDown(rowElement, { key: "Enter" });
		expect(onClick).toHaveBeenCalledTimes(2);
		expect(onClick).toHaveBeenLastCalledWith({ id: "alpha", name: "Alpha" });
		table.setOptions((options) => ({
			...options,
			data: [{ id: "alpha", name: "Updated Alpha" }],
		}));
		act(() => {
			runInAction(() => {
				state.editRequest = {
					rowId: "alpha",
					columnId: "name",
					requestId: 1,
				};
			});
		});
		expect(screen.getByRole("textbox", { name: "name" })).toHaveValue(
			"Updated Alpha",
		);
		unmount();
		runInAction(() => {
			state.editingCell = null;
			state.editRequest = { rowId: "alpha", columnId: "name", requestId: 2 };
		});
		expect(state.editingCell).toBeNull();
	});
});
