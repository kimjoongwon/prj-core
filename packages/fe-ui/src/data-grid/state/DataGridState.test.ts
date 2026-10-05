import { describe, expect, it } from "vitest";
import {
	createDataGridTestConfig,
	createDataGridTestState,
	dataGridTestRows,
} from "../test/fixtures";

describe("DataGrid 상태", () => {
	it("루트 상태에서 열 설정과 페이지 정보를 관리한다", async () => {
		const { state, setQueryStates } = createDataGridTestState({ skip: 20, take: 10 });
		state.columns.setColumnVisibility("status", false);
		state.columns.setOrder(["status", "name"]);
		state.columns.setColumnSizing("name", 240);
		state.pagination.changePage(3);

		expect(state.columns.visibility.status).toBe(false);
		expect(state.columns.order).toEqual(["status", "name"]);
		expect(state.columns.sizing.name).toBe(240);
		expect(setQueryStates).toHaveBeenCalledWith({ skip: 20 });
	});

	it("정렬과 그룹 변경을 첫 페이지 조회 상태로 전달한다", () => {
		const { state, setQueryStates } = createDataGridTestState({ skip: 40, take: 20 });

		state.table.header.changeSort("name", null);
		state.groupPanel.changeGrouping(["status"]);

		expect(setQueryStates).toHaveBeenNthCalledWith(1, { sort: ["name"], skip: 0 });
		expect(setQueryStates).toHaveBeenNthCalledWith(2, { groupBy: ["status"], skip: 0 });
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
			config.table.selection?.onSelectionChange,
		);

		expect(Array.from(selection.selectedKeys)).toEqual(["1", "2"]);
		expect(Array.from(state.selectedKeys)).toEqual([]);
		expect(state.actionBar.selectedCount).toBe(2);
	});

	it("확장 상태를 root state에 적용한다", () => {
		const { state } = createDataGridTestState();
		state.setExpanded({ "row-1": true });

		expect(state.expanded).toEqual({ "row-1": true });
	});
});
