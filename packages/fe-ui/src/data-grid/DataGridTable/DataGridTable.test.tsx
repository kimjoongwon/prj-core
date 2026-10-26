import { act, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createDataGridState, type DataGridState } from "../DataGrid";
import { addRow, combineRowsWithChanges } from "../useHandlers";
import { DataGridTable } from "./DataGridTable";

type Employee = { id: string; name: string };
type Category = Employee & { parentId: string | null };

const createEmployeeDataGridState = () =>
	createDataGridState<Employee>({
		setQueryStates: vi.fn(async () => new URLSearchParams()),
		table: {
			rows: [{ id: "employee-1", name: "김민서" }],
			columns: [
				{
					accessorKey: "name",
					header: "이름",
					meta: { editable: { editor: { type: "text" } } },
				},
			],
		},
	});

describe("DataGridTable TanStack 경계", () => {
	it("표시 resolver는 외부 source와 변경분으로 만든 root만 렌더링한다", () => {
		const sourceRows: Category[] = [
			{ id: "root", name: "루트", parentId: null },
			{ id: "child", name: "기존 자식", parentId: "root" },
		];
		const state = createDataGridState<Category>({
			setQueryStates: vi.fn(async () => new URLSearchParams()),
			table: { columns: [], rows: [] },
		});
		act(() => {
			addRow(state, { id: "new-child", name: "새 자식", parentId: "root" });
			runInAction(() => {
				state.table.expandedRowIds = { root: true };
			});
		});
		const getRowsWithChanges = vi.fn(
			(gridState: DataGridState<Category>, rows: Category[]) =>
				combineRowsWithChanges(gridState, rows).filter(
					(categoryRow) => categoryRow.parentId == null,
				),
		);
		const getSubRows = (parentCategoryRow: Category) =>
			combineRowsWithChanges(state, sourceRows).filter(
				(categoryRow) => categoryRow.parentId === parentCategoryRow.id,
			);

		render(
			<DataGridTable
				state={state}
				table={{
					rows: sourceRows,
					columns: [{ accessorKey: "name", header: "이름" }],
					getRowsWithChanges,
					getSubRows,
				}}
			/>,
		);

		expect(getRowsWithChanges).toHaveBeenCalledWith(state, sourceRows);
		expect(screen.getAllByText("새 자식")).toHaveLength(1);
		expect(screen.getAllByRole("row")).toHaveLength(4);
		expect(state.table.rows).toEqual([]);
	});

	it("표시 resolver를 지정하지 않으면 기존 변경분 합성을 사용한다", () => {
		const state = createEmployeeDataGridState();
		act(() => addRow(state, { id: "employee-2", name: "새 구성원" }));

		render(<DataGridTable state={state} />);

		expect(screen.getByText("새 구성원")).toBeInTheDocument();
	});

	it("표시 입력의 빈 rows와 columns는 state.table 기본값으로 대체하지 않는다", () => {
		const state = createEmployeeDataGridState();

		render(<DataGridTable state={state} table={{ rows: [], columns: [] }} />);

		expect(screen.queryByText("김민서")).not.toBeInTheDocument();
		expect(
			screen.queryByRole("columnheader", { name: "이름" }),
		).not.toBeInTheDocument();
	});

	it("server render를 해도 DataGrid 상태에 TanStack 인스턴스를 저장하지 않는다", () => {
		const state = createEmployeeDataGridState();
		expect("instance" in state.table).toBe(false);

		renderToString(<DataGridTable state={state} />);

		expect("instance" in state.table).toBe(false);
	});

	it("mount 전에 요청된 외부 편집을 현재 행으로 처리한다", () => {
		const state = createEmployeeDataGridState();
		runInAction(() => {
			state.table.row.editRequest = {
				rowId: "employee-1",
				columnId: "name",
				requestId: 1,
			};
		});

		render(<DataGridTable state={state} />);

		expect(screen.getByRole("textbox", { name: "name" })).toHaveValue("김민서");
		expect("instance" in state.table).toBe(false);
	});

	it("mount 후 외부 편집 요청도 현재 행으로 처리한다", () => {
		const state = createEmployeeDataGridState();
		render(<DataGridTable state={state} />);

		act(() => {
			runInAction(() => {
				state.table.row.editRequest = {
					rowId: "employee-1",
					columnId: "name",
					requestId: 1,
				};
			});
		});

		expect(screen.getByRole("textbox", { name: "name" })).toHaveValue("김민서");
		expect("instance" in state.table).toBe(false);
	});

	it("행 데이터 갱신 뒤 외부 편집 요청은 Body가 다시 전달한 최신 행을 사용한다", () => {
		const state = createEmployeeDataGridState();
		render(<DataGridTable state={state} />);

		act(() => {
			runInAction(() => {
				state.table.rows = [{ id: "employee-1", name: "수정된 김민서" }];
			});
		});
		act(() => {
			runInAction(() => {
				state.table.row.editRequest = {
					rowId: "employee-1",
					columnId: "name",
					requestId: 1,
				};
			});
		});

		expect(screen.getByRole("textbox", { name: "name" })).toHaveValue(
			"수정된 김민서",
		);
		expect("instance" in state.table).toBe(false);
	});
});
