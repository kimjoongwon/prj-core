import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataGrid } from "./index";
import {
	createDataGridTestConfig,
	createDataGridTestState,
	dataGridTestRows,
} from "./test/fixtures";

describe("표준 DataGrid 조립", () => {
	it("로딩, 빈 목록, 행 존재 상태를 렌더링한다", () => {
		const { state } = createDataGridTestState();
		const config = createDataGridTestConfig();
		const { unmount } = render(
			<DataGrid
				config={config}
				state={state}
				rows={dataGridTestRows}
				totalCount={2}
			/>,
		);
		expect(screen.getByText("Alpha")).toBeInTheDocument();
		unmount();

		const empty = createDataGridTestState();
		const { unmount: unmountEmpty } = render(
			<DataGrid config={config} state={empty.state} rows={[]} totalCount={0} />,
		);
		expect(screen.getByText("No rows")).toBeInTheDocument();
		unmountEmpty();

		render(
			<DataGrid
				config={config}
				state={createDataGridTestState().state}
				rows={[]}
				totalCount={0}
				isLoading
			/>,
		);
		expect(screen.getByLabelText("데이터 로딩 중")).toBeInTheDocument();
		expect(screen.queryByText("No rows")).not.toBeInTheDocument();
	}, 3000);

	it("재렌더링 순환 없이 행 선택과 열 정렬을 완료한다", async () => {
		const { state, selection, setQueryStates } = createDataGridTestState();
		render(
			<DataGrid
				config={createDataGridTestConfig()}
				state={state}
				rows={dataGridTestRows}
				totalCount={2}
			/>,
		);

		fireEvent.click(screen.getAllByLabelText("행 선택")[0]);
		fireEvent.click(screen.getByLabelText("정렬 변경"));

		await waitFor(() => {
			expect(Array.from(selection.selectedKeys)).toEqual(["1"]);
			expect(setQueryStates).toHaveBeenCalledWith({ sort: ["name"], skip: 0 });
			expect(screen.getByText("Beta")).toBeInTheDocument();
		});
	}, 3000);

	it("열 상태 변경을 다시 렌더링 없이 테이블 열에 반영한다", async () => {
		const { state } = createDataGridTestState();
		const config = createDataGridTestConfig();
		render(
			<DataGrid
				config={config}
				state={state}
				rows={dataGridTestRows}
				totalCount={2}
			/>,
		);

		expect(screen.getByText("Status")).toBeInTheDocument();
		act(() => state.columns.setColumnVisibility("status", false));
		await waitFor(() => {
			expect(screen.queryByText("Status")).toBeNull();
		});
	}, 3000);

	it("행이 갱신되어도 현재 페이지를 유지하고 검색을 제출하면 첫 페이지를 요청한다", async () => {
		const { state, setQueryStates } = createDataGridTestState({
			skip: 20,
			take: 10,
		});
		const config = createDataGridTestConfig({
			toolbar: {
				leftInputs: [{ id: "name", type: "search", label: "이름 검색" }],
			},
		});
		const { rerender } = render(
			<DataGrid
				config={config}
				state={state}
				rows={dataGridTestRows}
				totalCount={50}
			/>,
		);

		expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(setQueryStates).toHaveBeenCalledExactlyOnceWith({ skip: 30 });
		act(() => state.syncQuery({ skip: 30, take: 10 }, setQueryStates));
		rerender(
			<DataGrid
				config={config}
				state={state}
				rows={dataGridTestRows.map((row) => ({ ...row }))}
				totalCount={50}
			/>,
		);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "4" })).toHaveAttribute(
				"aria-current",
				"page",
			);
			expect(screen.getByText("Beta")).toBeInTheDocument();
		});
		expect(setQueryStates).toHaveBeenCalledTimes(1);
		fireEvent.change(screen.getByLabelText("이름 검색"), {
			target: { value: "Alpha" },
		});
		fireEvent.keyDown(screen.getByLabelText("이름 검색"), { key: "Enter" });
		expect(setQueryStates).toHaveBeenLastCalledWith({ name: "Alpha", skip: 0 });
		act(() =>
			state.syncQuery({ name: "Alpha", skip: 0, take: 10 }, setQueryStates),
		);
		rerender(
			<DataGrid
				config={config}
				state={state}
				rows={[dataGridTestRows[0]]}
				totalCount={1}
			/>,
		);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
				"aria-current",
				"page",
			);
			expect(screen.getByText("Alpha")).toBeInTheDocument();
			expect(screen.queryByText("Beta")).not.toBeInTheDocument();
		});
		expect(setQueryStates).toHaveBeenCalledTimes(2);
	}, 3000);
});
