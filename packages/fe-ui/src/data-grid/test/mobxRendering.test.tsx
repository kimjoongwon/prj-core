import { act, render, screen, waitFor } from "@testing-library/react";
import { observable, runInAction } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { DataGridActionBar } from "../DataGridActionBar";
import { DataGridGroupPanel } from "../DataGridGroupPanel";
import { DataGridToolbar } from "../DataGridToolbar";
import { InputRenderer } from "../InputRenderer";
import {
	createDataGridTestConfig,
	createDataGridTestState,
	dataGridTestRows,
} from "./fixtures";

describe("MobX DataGrid 렌더링", () => {
	it("액션 바는 외부 선택 상태 변경 후 다시 렌더링 없이 표시를 갱신한다", async () => {
		const { state, selection } = createDataGridTestState();
		render(<DataGridActionBar state={state.actionBar} showCount />);

		expect(screen.queryByText("1개 선택됨")).toBeNull();
		act(() => selection.setSelectedKeys(new Set(["row-1"])));

		await waitFor(() => {
			expect(screen.getByText("1개 선택됨")).toBeInTheDocument();
		});
		act(() => selection.clear());
		await waitFor(() => {
			expect(screen.queryByText("1개 선택됨")).toBeNull();
		});
	});

	it("툴바는 query facade 변경 후 다시 렌더링 없이 검색어를 동기화한다", async () => {
		const { state, setQueryStates } = createDataGridTestState();
		const config = createDataGridTestConfig({
			toolbar: {
				leftInputs: [{ id: "keyword", type: "search", label: "검색" }],
			},
		});
		render(<DataGridToolbar columns={config.table.columns} config={config.toolbar} state={state.toolbar} />);

		act(() => state.query.sync({ keyword: "첫 검색어" }, setQueryStates));
		await waitFor(() => {
			expect(screen.getByLabelText("검색")).toHaveValue("첫 검색어");
		});
		act(() => state.query.sync({ keyword: "두 번째 검색어" }, setQueryStates));
		await waitFor(() => {
			expect(screen.getByLabelText("검색")).toHaveValue("두 번째 검색어");
		});
	});

	it("그룹 패널은 columns facade 변경 후 다시 렌더링 없이 그룹 열을 표시한다", async () => {
		const { state } = createDataGridTestState();
		const config = createDataGridTestConfig({
			groupPanel: { show: "onlyWhenGrouping" },
		});
		render(<DataGridGroupPanel columns={config.table.columns} config={config.groupPanel} state={state.groupPanel} />);

		expect(screen.queryByLabelText("그룹 기준")).toBeNull();
		act(() => state.columns.setGrouping(["status"]));
		await waitFor(() => {
			expect(screen.getByLabelText("그룹 기준")).toBeInTheDocument();
			expect(screen.getByText("Status")).toBeInTheDocument();
		});
	});

	it("입력 렌더러는 observable 조회 값 변경을 다시 렌더링 없이 선택값에 반영한다", async () => {
		const queryValues = observable({ status: "active" });
		const onQueryChange = vi.fn();
		render(
			<InputRenderer
				config={{
					id: "status",
					type: "select",
					label: "상태",
					props: {
						options: [
							{ value: "active", label: "활성" },
							{ value: "inactive", label: "비활성" },
						],
					},
				} as never}
				queryValues={queryValues}
				onQueryChange={onQueryChange}
			/>,
		);

		expect(screen.getByLabelText("상태")).toHaveValue("active");
		act(() => {
			runInAction(() => {
				queryValues.status = "inactive";
			});
		});
		await waitFor(() => {
			expect(screen.getByLabelText("상태")).toHaveValue("inactive");
		});
	});
});
