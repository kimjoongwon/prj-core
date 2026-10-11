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
	it("빈 목록과 행 존재 상태를 렌더링한다", () => {
		const { state } = createDataGridTestState();
		state.rows = dataGridTestRows;
		state.pagination.setTotalCount(2);
		const { unmount } = render(<DataGrid state={state} />);
		expect(screen.getByText("Alpha")).toBeInTheDocument();
		unmount();

		const empty = createDataGridTestState();
		empty.state.rows = [];
		const { unmount: unmountEmpty } = render(<DataGrid state={empty.state} />);
		expect(screen.getByText("No rows")).toBeInTheDocument();
		unmountEmpty();
	}, 3000);

	it("재렌더링 순환 없이 행 선택과 열 정렬을 완료한다", async () => {
		const { state, selection, setQueryStates } = createDataGridTestState();
		state.rows = dataGridTestRows;
		state.pagination.setTotalCount(2);
		render(<DataGrid state={state} />);

		fireEvent.click(screen.getAllByLabelText("행 선택")[0]);
		fireEvent.click(screen.getByLabelText("정렬 변경"));

		await waitFor(() => {
			expect(Array.from(selection.selectedKeys)).toEqual(["1"]);
			expect(setQueryStates).toHaveBeenCalledWith({ sort: ["name"], skip: 0 });
			expect(screen.getByText("Beta")).toBeInTheDocument();
		});
	}, 3000);

	it("TanStack 컬럼 visibility API로 열 표시를 바꾼다", async () => {
		const { state } = createDataGridTestState();
		state.rows = dataGridTestRows;
		state.pagination.setTotalCount(2);
		render(<DataGrid state={state} />);

		expect(
			screen.getByRole("columnheader", { name: "Status" }),
		).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "컬럼 설정" }));
		fireEvent.click(screen.getByRole("checkbox", { name: "Status" }));
		await waitFor(() => {
			expect(screen.queryByRole("columnheader", { name: "Status" })).toBeNull();
		});
	}, 3000);

	it("TanStack 페이지 변경을 nuqs setter에 전달한다", () => {
		const { state, setQueryStates } = createDataGridTestState({
			skip: 0,
			take: 1,
		});
		state.rows = dataGridTestRows;
		state.pagination.setTotalCount(2);
		render(<DataGrid state={state} />);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));

		expect(setQueryStates).toHaveBeenCalledWith({ skip: 1, take: 1 });
	});

	it("행이 갱신되어도 현재 페이지를 유지하고 검색을 제출하면 첫 페이지를 요청한다", async () => {
		const { state, setQueryStates } = createDataGridTestState(
			{ skip: 20, take: 10 },
			createDataGridTestConfig({
				toolbar: {
					leftInputs: [{ id: "name", type: "search", label: "이름 검색" }],
				},
			}),
		);
		state.rows = dataGridTestRows;
		state.pagination.setTotalCount(50);
		const { rerender } = render(<DataGrid state={state} />);

		expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(setQueryStates).toHaveBeenCalledExactlyOnceWith({
			skip: 30,
			take: 10,
		});
		act(() => {
			state.queryStates = { skip: 30, take: 10 };
		});
		rerender(<DataGrid state={state} />);

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
		act(() => {
			state.queryStates = { name: "Alpha", skip: 0, take: 10 };
		});
		act(() => {
			state.rows = [dataGridTestRows[0]];
			state.pagination.setTotalCount(1);
		});
		rerender(<DataGrid state={state} />);

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
