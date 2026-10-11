import { describe, expect, it } from "vitest";
import {
	createDataGridTestConfig,
	createDataGridTestState,
	dataGridTestRows,
} from "../test/fixtures";

describe("DataGrid 상태", () => {
	it("전체 건수를 pagination 상태로 보관한다", () => {
		const { state } = createDataGridTestState();
		state.pagination.setTotalCount(42);

		expect(state.pagination.totalCount).toBe(42);
	});

	it("query의 skip/take을 TanStack pagination 상태로 변환한다", () => {
		const { state } = createDataGridTestState({ skip: 40, take: 10 });

		expect(state.pagination.toTablePaginationState()).toEqual({
			pageIndex: 4,
			pageSize: 10,
		});
	});

	it("TanStack pagination 변경을 query의 skip/take으로 변환한다", () => {
		const { state, setQueryStates } = createDataGridTestState({
			skip: 40,
			take: 10,
		});

		state.pagination.changeTablePagination((pagination) => ({
			pageIndex: pagination.pageIndex + 1,
			pageSize: 25,
		}));

		expect(setQueryStates).toHaveBeenCalledWith({ skip: 125, take: 25 });
	});

	it("그룹 변경을 첫 페이지 query 상태로 전달한다", () => {
		const { state, setQueryStates } = createDataGridTestState({
			skip: 40,
			take: 20,
		});

		state.groupPanel.changeGrouping(["status"]);

		expect(setQueryStates).toHaveBeenCalledWith({
			groupBy: ["status"],
			skip: 0,
		});
	});

	it("table은 query grouping과 기본 그룹 컬럼을 TanStack state로 제공한다", () => {
		const { state: queryState } = createDataGridTestState({
			skip: 0,
			take: 20,
			groupBy: ["name"],
		});
		expect(queryState.table.getGroupingState()).toEqual(["name"]);

		const { state: defaultState } = createDataGridTestState(
			{ skip: 0, take: 20 },
			{
				table: {
					columns: [{ field: "status", label: "Status", rowGroup: true }],
				},
			},
		);
		expect(defaultState.table.getGroupingState()).toEqual(["status"]);
	});

	it("외부 선택 상태를 단일 선택 원천으로 사용한다", () => {
		const { state, selection } = createDataGridTestState();
		const config = createDataGridTestConfig();

		state.table.body.changeRowSelection(
			"1",
			true,
			config.table.selection?.onSelectionChange,
		);
		state.table.header.changeVisibleSelection(
			dataGridTestRows.map((row) => String(row.id)),
			true,
		);

		expect(Array.from(selection.selectedKeys)).toEqual(["1", "2"]);
		expect(Array.from(state.table.selectedKeys)).toEqual([]);
		expect(state.actionBar.selectedCount).toBe(2);
	});

	it("확장 상태를 root state에 적용한다", () => {
		const { state } = createDataGridTestState();
		state.table.setExpanded({ "row-1": true });

		expect(state.table.expanded).toEqual({ "row-1": true });
	});

	it("확장 요청의 행을 펼친다", () => {
		const { state } = createDataGridTestState(
			{ skip: 0, take: 20 },
			{ table: { expandRequest: { rowId: 1n, requestId: 1 } } },
		);
		state.table.applyExpansionRequest(state.table.expandRequest);

		expect(state.table.expanded).toEqual({ "1": true });
	});
});
