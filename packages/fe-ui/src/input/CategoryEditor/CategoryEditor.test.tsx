import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { runInAction } from "mobx";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { createDataGridState } from "../../data-grid";
import {
	clearChanges,
	getChangesSnapshot,
	setValue,
} from "../../data-grid/useHandlers";
import {
	CategoryEditor,
	type CategoryEditorRow,
	createCategoryEditorState,
} from "./CategoryEditor";

const rows: CategoryEditorRow[] = [
	{ id: "root", name: "루트", parentId: null, sortOrder: 0 },
	{ id: "child", name: "자식", parentId: "root", sortOrder: 0 },
];

const createChangesState = () =>
	createDataGridState<CategoryEditorRow>({
		query: {},
		setQueryStates: async () => new URLSearchParams(),
		table: { columns: [] },
	});

describe("CategoryEditor", () => {
	it("원본 rows와 외부 변경 delta를 상태 복제 없이 조합한다", () => {
		const dataGrid = createChangesState();
		const state = createCategoryEditorState();

		state.addRootCategory(rows, dataGrid);

		expect(state.getRootCategoryRows(rows, dataGrid)).toHaveLength(2);
		expect(dataGrid.created).toHaveLength(1);
		expect(dataGrid.table.row.editRequest?.columnId).toBe("name");
	});

	it("StrictMode에서 같은 source 재렌더와 외부 변경을 안정적으로 유지한다", () => {
		const dataGrid = createChangesState();
		const view = render(
			<StrictMode>
				<CategoryEditor rows={rows} state={dataGrid} totalCount={rows.length} />
			</StrictMode>,
		);

		view.rerender(
			<StrictMode>
				<CategoryEditor rows={rows} state={dataGrid} totalCount={rows.length} />
			</StrictMode>,
		);

		fireEvent.click(screen.getByRole("button", { name: "카테고리 추가" }));
		expect(dataGrid.created).toHaveLength(1);
		expect(dataGrid.table.row.editRequest?.columnId).toBe("name");
	});

	it("source 교체와 외부 updated delta를 렌더에 반영한다", () => {
		const dataGrid = createChangesState();
		const view = render(
			<CategoryEditor rows={rows} state={dataGrid} totalCount={rows.length} />,
		);

		act(() => setValue(dataGrid, rows[0], "name", "변경된 루트"));
		expect(screen.getByText("변경된 루트")).toBeInTheDocument();

		const replacedRows = [{ ...rows[0], name: "교체된 루트" }, rows[1]];
		view.rerender(
			<CategoryEditor
				rows={replacedRows}
				state={dataGrid}
				totalCount={replacedRows.length}
			/>,
		);
		expect(screen.getByText("변경된 루트")).toBeInTheDocument();
		expect(dataGrid.updated).toHaveLength(1);
	});

	it("observable created 내부 변경도 파생 rows에 반영한다", () => {
		const dataGrid = createChangesState();
		render(
			<CategoryEditor rows={rows} state={dataGrid} totalCount={rows.length} />,
		);

		const createdCategoryRow = {
			id: "created-child",
			name: "처음",
			parentId: null,
		};
		act(() => runInAction(() => dataGrid.created.push(createdCategoryRow)));
		expect(screen.getByText("처음")).toBeInTheDocument();

		act(() =>
			runInAction(() => {
				dataGrid.created[0].name = "수정된 생성";
			}),
		);
		expect(screen.getByText("수정된 생성")).toBeInTheDocument();
	});

	it("child 추가는 root에 중복하지 않고 parent를 확장한다", () => {
		const dataGrid = createChangesState();
		const state = createCategoryEditorState();

		state.addChildCategory(rows[0], rows, dataGrid);

		const changedRows: CategoryEditorRow[] = state.getCategoryRowsWithChanges(
			rows,
			dataGrid,
		);
		expect(state.getRootCategoryRows(rows, dataGrid)).toHaveLength(1);
		expect(state.getCategorySubRows(rows[0], rows, dataGrid)).toHaveLength(2);
		expect(dataGrid.table.expandedRowIds).toMatchObject({ root: true });
		expect(changedRows.filter((row) => row.parentId === "root")).toHaveLength(
			2,
		);
	});

	it("삭제와 저장 snapshot/clear를 외부 변경 원천에서 처리한다", () => {
		const dataGrid = createChangesState();
		const state = createCategoryEditorState();

		setValue(dataGrid, rows[0], "name", "저장된 루트");
		state.deleteCategory(rows[1].id, dataGrid);
		expect(getChangesSnapshot(dataGrid)).toMatchObject({
			updated: [{ id: "root", changes: { name: "저장된 루트" } }],
			deleted: ["child"],
		});

		clearChanges(dataGrid);
		expect(getChangesSnapshot(dataGrid)).toEqual({
			created: [],
			updated: [],
			deleted: [],
		});
	});

	it("readOnly는 editor와 action을 노출하지 않는다", () => {
		const dataGrid = createChangesState();
		render(
			<CategoryEditor
				rows={rows}
				state={dataGrid}
				totalCount={rows.length}
				isReadOnly
			/>,
		);

		expect(
			screen.queryByRole("button", { name: "카테고리 추가" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "추가" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "삭제" }),
		).not.toBeInTheDocument();
	});

	it("자동 편집을 commit하면 Category edit request를 정리한다", async () => {
		const dataGrid = createChangesState();
		render(
			<CategoryEditor rows={rows} state={dataGrid} totalCount={rows.length} />,
		);

		fireEvent.click(screen.getByRole("button", { name: "카테고리 추가" }));
		const categoryNameInput = screen.getByRole("textbox");
		fireEvent.change(categoryNameInput, { target: { value: "새 카테고리" } });
		fireEvent.keyDown(categoryNameInput, { key: "Enter" });

		await waitFor(() => {
			expect(dataGrid.table.row.editRequest).toBeUndefined();
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		});
	});
});
