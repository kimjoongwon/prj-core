import type { DataGridGroupableColumnItem } from "@cocrepo/type";
import { act, render, screen, waitFor } from "@testing-library/react";
import { observable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { describe, expect, it, vi } from "vitest";
import { getGroupableColumnItems } from "../columns/columnConfig";
import { DataGridActionBar } from "../DataGridActionBar";
import { DataGridGroupPanel } from "../DataGridGroupPanel";
import { DataGridToolbar } from "../DataGridToolbar";
import { InputRenderer } from "../input/InputRenderer";
import type { DataGridState } from "../state/DataGridState";
import { createDataGridTestConfig, createDataGridTestState } from "./fixtures";

/** grouping을 observable state에서 파생해 GroupPanel에 전달하는 반응성 검증 harness입니다. */
const DataGridGroupPanelTestHarness = observer(
	function DataGridGroupPanelTestHarness({
		state,
		groupableColumns,
	}: {
		state: DataGridState;
		groupableColumns: DataGridGroupableColumnItem[];
	}) {
		return (
			<DataGridGroupPanel
				groupableColumns={groupableColumns}
				grouping={state.table.getGroupingState()}
				show="onlyWhenGrouping"
				state={state.groupPanel}
			/>
		);
	},
);

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
		const { state } = createDataGridTestState();
		render(
			<DataGridToolbar
				leftInputs={[{ id: "keyword", type: "search", label: "검색" }]}
				settingsColumns={[]}
				table={undefined as never}
				state={state.toolbar}
			/>,
		);

		act(() => {
			state.queryStates = { keyword: "첫 검색어" };
		});
		await waitFor(() => {
			expect(screen.getByLabelText("검색")).toHaveValue("첫 검색어");
		});
		act(() => {
			state.queryStates = { keyword: "두 번째 검색어" };
		});
		await waitFor(() => {
			expect(screen.getByLabelText("검색")).toHaveValue("두 번째 검색어");
		});
	});

	it("그룹 패널은 query의 grouping 변경을 반영한다", async () => {
		const config = createDataGridTestConfig();
		const { state } = createDataGridTestState(
			{ skip: 0, take: 20 },
			{ table: config.table },
		);
		render(
			<DataGridGroupPanelTestHarness
				groupableColumns={getGroupableColumnItems(config.table.columns)}
				state={state}
			/>,
		);

		expect(screen.queryByLabelText("그룹 기준")).toBeNull();
		act(() => {
			state.queryStates = observable({
				skip: 0,
				take: 20,
				groupBy: ["status"],
			});
		});
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
				config={
					{
						id: "status",
						type: "select",
						label: "상태",
						props: {
							options: [
								{ value: "active", label: "활성" },
								{ value: "inactive", label: "비활성" },
							],
						},
					} as never
				}
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
