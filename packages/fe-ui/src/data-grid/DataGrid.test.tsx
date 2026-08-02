import type { DataGridConfig, DataGridState } from "@cocrepo/type";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { InputCell } from "./cell/InputCell";
import { DataGrid, getDataGridRowKey, type Key } from "./DataGrid";
import { DataGridChangesState } from "./DataGridChangesState";
import { DataGridColumnsState } from "./DataGridState";

vi.mock("../feedback/Skeleton/Skeleton", () => ({
	Skeleton: ({ className }: { className?: string }) => (
		<div className={className} data-testid="data-grid-skeleton" />
	),
}));

vi.mock("../input/Pagination/Pagination", () => ({
	Pagination: Object.assign(
		({ children }: { children: ReactNode }) => (
			<nav aria-label="pagination">{children}</nav>
		),
		{
			Content: ({ children }: { children: ReactNode }) => <ul>{children}</ul>,
			Ellipsis: () => <span>...</span>,
			Item: ({ children }: { children: ReactNode }) => <li>{children}</li>,
			Link: ({
				children,
				isActive,
				onPress,
			}: {
				children: ReactNode;
				isActive?: boolean;
				onPress?: () => void;
			}) => (
				<button
					aria-current={isActive ? "page" : undefined}
					type="button"
					onClick={onPress}
				>
					{children}
				</button>
			),
			Next: ({
				children,
				isDisabled,
				onPress,
			}: {
				children: ReactNode;
				isDisabled?: boolean;
				onPress?: () => void;
			}) => (
				<button disabled={isDisabled} type="button" onClick={onPress}>
					{children}
				</button>
			),
			NextIcon: () => null,
			Previous: ({
				children,
				isDisabled,
				onPress,
			}: {
				children: ReactNode;
				isDisabled?: boolean;
				onPress?: () => void;
			}) => (
				<button disabled={isDisabled} type="button" onClick={onPress}>
					{children}
				</button>
			),
			PreviousIcon: () => null,
			Summary: ({ children }: { children: ReactNode }) => <div>{children}</div>,
		},
	),
}));

interface DataGridTestRow {
	id: Key;
	name: string;
	email: string;
	age: number;
	status: "활성" | "비활성";
}

const rows: DataGridTestRow[] = [
	{
		id: "user-1",
		name: "Ada Lovelace",
		email: "ada@example.com",
		age: 36,
		status: "활성",
	},
	{
		id: "user-2",
		name: "Grace Hopper",
		email: "grace@example.com",
		age: 85,
		status: "활성",
	},
];

const baseConfig: DataGridConfig<DataGridTestRow> = {
	entity: "User",
	columns: [
		{
			field: "name",
			label: "이름",
		},
		{
			field: "email",
			label: "이메일",
		},
		{
			field: "age",
			label: "나이",
			align: "right",
			cell: ({ getValue }) => (
				<span data-testid="age-cell">{String(getValue())}</span>
			),
		},
	],
};

function createDataGridState(
	selectedKeys?: Set<string>,
	setSelectedKeys = vi.fn(),
	columns?: ConstructorParameters<typeof DataGridColumnsState>[0],
	queryOverrides: Record<string, unknown> = {},
) {
	const queryValues: Record<string, unknown> = {
		skip: 0,
		take: 10,
		...queryOverrides,
	};
	const setValues = vi.fn(async (values: Record<string, unknown | null>) => {
		for (const [key, value] of Object.entries(values)) {
			if (value === null) {
				delete queryValues[key];
			} else {
				queryValues[key] = value;
			}
		}

		return new URLSearchParams();
	});

	return {
		columns: new DataGridColumnsState(columns),
		query: {
			values: queryValues,
			setValues,
		},
		selection: {
			selectedKeys,
			setSelectedKeys,
		},
		changes: new DataGridChangesState(),
	} satisfies DataGridState;
}

describe("DataGrid", () => {
	it("Given 중복 id가 있는 행 When row key를 만들면 Then index를 포함한 안전한 key를 반환한다", () => {
		const idCounts = new Map([
			["same-id", 2],
			["unique-id", 1],
		]);

		expect(getDataGridRowKey({ id: "same-id" }, 0, idCounts)).toBe(
			"row:same-id:0",
		);
		expect(getDataGridRowKey({ id: "same-id" }, 1, idCounts)).toBe(
			"row:same-id:1",
		);
		expect(getDataGridRowKey({ id: "unique-id" }, 0, idCounts)).toBe(
			"unique-id",
		);
	});

	it("Given 컬럼과 행이 있을 때 When DataGrid를 렌더링하면 Then native table에 header와 cell을 표시한다", () => {
		render(
			<DataGrid
				config={baseConfig}
				state={createDataGridState()}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		const table = screen.getByRole("table", { name: "데이터 테이블" });

		expect(table.tagName).toBe("TABLE");
		expect(
			screen.getByRole("columnheader", { name: "이름" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "이메일" }),
		).toBeInTheDocument();
		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
		expect(screen.getByText("grace@example.com")).toBeInTheDocument();
		expect(screen.getAllByTestId("age-cell")).toHaveLength(2);
	});

	it("Given 컬럼 표시 상태가 있을 때 When DataGrid를 렌더링하면 Then 숨김과 순서를 반영한다", () => {
		render(
			<DataGrid
				config={baseConfig}
				state={createDataGridState(undefined, vi.fn(), {
					order: ["age", "name", "email"],
					visibility: {
						email: false,
					},
					sizing: {},
				})}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		const headers = screen.getAllByRole("columnheader");

		expect(headers.map((header) => header.textContent)).toEqual([
			"나이",
			"이름",
		]);
		expect(
			screen.queryByRole("columnheader", { name: "이메일" }),
		).not.toBeInTheDocument();
		expect(screen.queryByText("ada@example.com")).not.toBeInTheDocument();
	});

	it("Given 정렬 가능한 컬럼이 있을 때 When header를 누르면 Then query sort와 skip을 갱신한다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={{
					...baseConfig,
					columns: [
						{
							field: "name",
							label: "이름",
							enableSorting: true,
						},
						...baseConfig.columns.slice(1),
					],
				}}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "정렬 변경" }));

		expect(state.query.setValues).toHaveBeenCalledWith({
			sort: ["name"],
			skip: 0,
		});
	});

	it("Given header filter가 있을 때 When 값을 입력하고 Enter를 누르면 Then query 값을 갱신한다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={{
					...baseConfig,
					columns: [
						{
							field: "name",
							label: "이름",
							floatingFilter: true,
							headerInput: {
								type: "search",
								id: "nameFilter",
								placeholder: "이름 검색",
								props: {
									queryKey: "name",
								},
							},
						},
						...baseConfig.columns.slice(1),
					],
				}}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		const input = screen.getByPlaceholderText("이름 검색");
		fireEvent.change(input, { target: { value: "Ada" } });

		expect(state.query.setValues).not.toHaveBeenCalled();

		fireEvent.keyDown(input, { key: "Enter" });

		expect(state.query.setValues).toHaveBeenCalledWith({
			name: "Ada",
			skip: 0,
		});
	});

	it("Given header filter가 있어도 floating filter가 꺼져 있을 때 When 렌더링하면 Then header 아래 input을 표시하지 않는다", () => {
		render(
			<DataGrid
				config={{
					...baseConfig,
					columns: [
						{
							field: "name",
							label: "이름",
							headerInput: {
								type: "search",
								id: "nameFilter",
								placeholder: "이름 검색",
							},
						},
						...baseConfig.columns.slice(1),
					],
				}}
				state={createDataGridState()}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		expect(screen.queryByPlaceholderText("이름 검색")).not.toBeInTheDocument();
	});

	it("Given rowGroup 컬럼이 있을 때 When DataGrid를 렌더링하면 Then 그룹 row를 표시하고 펼칠 수 있다", () => {
		render(
			<DataGrid
				config={{
					...baseConfig,
					columns: [
						{
							field: "status",
							label: "상태",
							rowGroup: true,
						},
						...baseConfig.columns,
					],
				}}
				state={createDataGridState()}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		const groupToggle = screen.getByRole("button", {
			name: "상태 활성 그룹 펼치기",
		});

		expect(groupToggle).toHaveTextContent("상태");
		expect(groupToggle).toHaveTextContent("활성");
		expect(groupToggle).toHaveTextContent("(2)");
		expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();

		act(() => {
			fireEvent.click(groupToggle);
		});

		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
		expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
	});

	it("Given query groupBy가 있을 때 When DataGrid를 렌더링하면 Then query 기준으로 그룹 row를 표시한다", () => {
		render(
			<DataGrid
				config={{
					...baseConfig,
					columns: [
						{
							field: "status",
							label: "상태",
							enableRowGroup: true,
						},
						...baseConfig.columns,
					],
				}}
				state={createDataGridState(undefined, vi.fn(), undefined, {
					groupBy: ["status"],
				})}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "상태 활성 그룹 펼치기" }),
		).toBeInTheDocument();
	});

	it("Given row group panel이 있을 때 When 컬럼을 추가하고 제거하면 Then grouping 상태를 바꾼다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={{
					...baseConfig,
					rowGroupPanelShow: "always",
					columns: [
						{
							field: "status",
							label: "상태",
							enableRowGroup: true,
						},
						...baseConfig.columns,
					],
				}}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		expect(screen.getByLabelText("그룹 기준")).toHaveTextContent("그룹 없음");

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "상태 그룹 추가" }));
		});

		expect(state.query.setValues).toHaveBeenCalledWith({
			groupBy: ["status"],
			skip: 0,
		});
		expect(state.columns.grouping).toEqual(["status"]);
		expect(
			screen.getByRole("button", { name: "상태 활성 그룹 펼치기" }),
		).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "상태 그룹 제거" }));
		});

		expect(state.query.setValues).toHaveBeenLastCalledWith({
			groupBy: [],
			skip: 0,
		});
		expect(state.columns.grouping).toEqual([]);
		expect(
			screen.queryByRole("button", { name: "상태 활성 그룹 펼치기" }),
		).not.toBeInTheDocument();
	});

	it("Given 기본 rowGroup 컬럼이 있을 때 When panel에서 제거하면 Then 기본 그룹을 다시 적용하지 않는다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={{
					...baseConfig,
					rowGroupPanelShow: "always",
					columns: [
						{
							field: "status",
							label: "상태",
							rowGroup: true,
						},
						...baseConfig.columns,
					],
				}}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "상태 활성 그룹 펼치기" }),
		).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "상태 그룹 제거" }));
		});

		expect(state.query.setValues).toHaveBeenCalledWith({
			groupBy: [],
			skip: 0,
		});
		expect(state.columns.isGroupingCustomized).toBe(true);
		expect(state.columns.grouping).toEqual([]);
		expect(
			screen.queryByRole("button", { name: "상태 활성 그룹 펼치기" }),
		).not.toBeInTheDocument();
		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
	});

	it("Given row group panel에 여러 그룹이 있을 때 When 이동 버튼을 누르면 Then grouping 순서를 바꾼다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={{
					...baseConfig,
					rowGroupPanelShow: "always",
					columns: [
						{
							field: "status",
							label: "상태",
							enableRowGroup: true,
						},
						{
							field: "age",
							label: "나이",
							enableRowGroup: true,
						},
						...baseConfig.columns.slice(0, 2),
					],
				}}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "상태 그룹 추가" }));
		});

		expect(state.columns.grouping).toEqual(["status"]);

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: "나이 그룹 추가" }));
		});

		expect(state.query.setValues).toHaveBeenLastCalledWith({
			groupBy: ["status", "age"],
			skip: 0,
		});
		expect(state.columns.grouping).toEqual(["status", "age"]);

		act(() => {
			fireEvent.click(
				screen.getByRole("button", { name: "나이 그룹 왼쪽으로 이동" }),
			);
		});

		expect(state.query.setValues).toHaveBeenLastCalledWith({
			groupBy: ["age", "status"],
			skip: 0,
		});
		expect(state.columns.grouping).toEqual(["age", "status"]);
	});

	it("Given 컬럼 resize handle이 있을 때 When 드래그하면 Then 컬럼 너비 상태를 갱신한다", () => {
		const state = createDataGridState(undefined, vi.fn(), {
			order: [],
			visibility: {},
			sizing: {},
		});

		render(
			<DataGrid
				config={baseConfig}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		const nameHeader = screen.getByRole("columnheader", { name: "이름" });
		nameHeader.getBoundingClientRect = vi.fn(
			() =>
				({
					bottom: 36,
					height: 36,
					left: 0,
					right: 180,
					toJSON: () => undefined,
					top: 0,
					width: 180,
					x: 0,
					y: 0,
				}) as DOMRect,
		);

		act(() => {
			screen
				.getByTestId("data-grid-column-resizer-name")
				.dispatchEvent(
					new MouseEvent("pointerdown", { bubbles: true, clientX: 100 }),
				);
			window.dispatchEvent(
				new MouseEvent("pointermove", { bubbles: true, clientX: 140 }),
			);
			window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		});

		expect(state.columns.sizing.name).toBe(220);
	});

	it("Given 행 클릭 핸들러가 있을 때 When 행을 클릭하면 Then 원본 row로 callback을 호출한다", () => {
		const handleRowClick = vi.fn();

		render(
			<DataGrid
				config={{ ...baseConfig, onRowClick: handleRowClick }}
				state={createDataGridState()}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		fireEvent.click(screen.getByText("Ada Lovelace").closest("tr") as Element);

		expect(handleRowClick).toHaveBeenCalledWith(rows[0]);
	});

	it("Given multiple selection이 있을 때 When 행 checkbox를 선택하면 Then 선택 key와 callback 상태를 갱신한다", async () => {
		const setSelectedKeys = vi.fn();
		const handleSelectionChange = vi.fn();

		render(
			<DataGrid
				config={{
					...baseConfig,
					selection: {
						mode: "multiple",
						onSelectionChange: handleSelectionChange,
						actionBar: {
							showCount: true,
						},
					},
				}}
				state={createDataGridState(undefined, setSelectedKeys)}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		fireEvent.click(screen.getAllByRole("checkbox", { name: "행 선택" })[0]);

		const selectedKeys = setSelectedKeys.mock.calls[0]?.[0] as Set<string>;
		const callbackKeys = handleSelectionChange.mock
			.calls[0]?.[0] as Set<string>;

		expect(Array.from(selectedKeys)).toEqual(["user-1"]);
		expect(Array.from(callbackKeys)).toEqual(["user-1"]);
		await waitFor(() => {
			expect(screen.getByText("1개 선택됨")).toBeInTheDocument();
		});
	});

	it("Given 빈 행 목록이나 loading 상태 When DataGrid를 렌더링하면 Then 빈 row 또는 loading UI를 표시한다", () => {
		const { rerender } = render(
			<DataGrid
				config={{ ...baseConfig, emptyMessage: "표시할 사용자가 없습니다." }}
				state={createDataGridState()}
				rows={[]}
				totalCount={0}
			/>,
		);

		expect(screen.getByText("표시할 사용자가 없습니다.")).toBeInTheDocument();
		expect(
			screen.getByRole("table", { name: "데이터 테이블" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "이름" }),
		).toBeInTheDocument();

		rerender(
			<DataGrid
				config={baseConfig}
				state={createDataGridState()}
				rows={rows}
				totalCount={rows.length}
				isLoading
			/>,
		);

		expect(screen.getAllByTestId("data-grid-skeleton").length).toBeGreaterThan(
			0,
		);
		expect(screen.queryByRole("table")).not.toBeInTheDocument();
	});

	it("Given pagination이 있을 때 When 페이지 변경 이벤트가 오면 Then query skip을 갱신한다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={baseConfig}
				state={state}
				rows={rows}
				totalCount={30}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));

		expect(state.query.setValues).toHaveBeenCalledWith({ skip: 10 });
	});

	it("Given 실제 자식 행이 있을 때 When 부모를 펼치면 Then getSubRows 계층을 표시한다", () => {
		interface CategoryRow {
			id: string;
			name: string;
			children: CategoryRow[];
		}

		const categoryRows: CategoryRow[] = [
			{
				id: "clothing",
				name: "의류",
				children: [
					{
						id: "tops",
						name: "상의",
						children: [],
					},
				],
			},
		];

		render(
			<DataGrid
				config={{
					entity: "Category",
					getSubRows: (row) => row.children,
					columns: [
						{
							field: "name",
							label: "이름",
							rowExpander: true,
						},
					],
				}}
				state={createDataGridState()}
				rows={categoryRows}
				totalCount={2}
			/>,
		);

		expect(screen.getByText("의류")).toBeInTheDocument();
		expect(screen.queryByText("상의")).not.toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", { name: "의류 하위 행 펼치기" }),
		);

		expect(screen.getByText("상의")).toBeInTheDocument();
	});

	it("Given 이동 가능한 행 When 키보드로 순서를 바꾸면 Then 새 형제 순서를 전달한다", async () => {
		interface CategoryRow {
			id: string;
			name: string;
			children: CategoryRow[];
		}

		const categoryRows: CategoryRow[] = [
			{ id: "clothing", name: "의류", children: [] },
			{ id: "beauty", name: "뷰티", children: [] },
		];
		const handleRowMove = vi.fn();

		render(
			<DataGrid
				config={{
					entity: "Category",
					getSubRows: (row) => row.children,
					onRowMove: handleRowMove,
					columns: [
						{
							field: "name",
							label: "이름",
							rowExpander: true,
						},
					],
				}}
				state={createDataGridState()}
				rows={categoryRows}
				totalCount={categoryRows.length}
			/>,
		);

		const moveButton = screen.getByRole("button", { name: "뷰티 행 이동" });
		act(() => {
			moveButton.focus();
			fireEvent.keyDown(moveButton, { key: " ", code: "Space" });
		});
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		act(() => {
			fireEvent.keyDown(document, { key: "ArrowUp", code: "ArrowUp" });
			fireEvent.keyDown(document, { key: " ", code: "Space" });
		});

		await waitFor(() => {
			expect(handleRowMove).toHaveBeenCalledWith({
				row: categoryRows[1],
				parent: null,
				index: 0,
				siblings: [categoryRows[1], categoryRows[0]],
			});
		});
	});

	it("Given editable 이름 셀 When 값을 입력하면 Then 즉시 변경을 기록하고 Escape로 취소한다", () => {
		const state = createDataGridState();
		const editableConfig: DataGridConfig<DataGridTestRow> = {
			...baseConfig,
			columns: [
				{
					field: "name",
					label: "이름",
					editable: {
						render: ({ value, onValueChange, onFinish, onCancel }) => (
							<InputCell
								aria-label="이름 입력"
								value={String(value ?? "")}
								onValueChange={onValueChange}
								onFinish={onFinish}
								onCancel={onCancel}
							/>
						),
					},
				},
				...baseConfig.columns.slice(1),
			],
		};

		render(
			<DataGrid
				config={editableConfig}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		fireEvent.click(screen.getAllByRole("cell", { name: "이름 편집" })[0]);
		const input = screen.getByRole("textbox", { name: "이름 입력" });
		fireEvent.change(input, { target: { value: "Augusta Ada" } });

		expect(state.changes.toJSON<DataGridTestRow>().updated).toEqual([
			{
				id: "user-1",
				changes: { name: "Augusta Ada" },
			},
		]);

		fireEvent.keyDown(input, { key: "Escape" });

		expect(state.changes.toJSON<DataGridTestRow>().updated).toEqual([]);
		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
	});

	it("Given 변경 상태 When 행을 추가하거나 삭제하면 Then 표에 즉시 반영한다", () => {
		const state = createDataGridState();

		render(
			<DataGrid
				config={baseConfig}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>,
		);

		act(() => {
			state.changes.addRow({
				id: "user-temporary",
				name: "New User",
				email: "new@example.com",
				age: 20,
				status: "활성",
			});
		});
		expect(screen.getByText("New User")).toBeInTheDocument();

		act(() => {
			state.changes.deleteRow("user-1");
		});
		expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
	});
});
