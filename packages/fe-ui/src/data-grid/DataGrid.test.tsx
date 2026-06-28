import type { DataGridConfig, DataGridState } from "@cocrepo/type";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { DataGrid, getDataGridRowKey, type Key } from "./DataGrid";

vi.mock("../feedback/Skeleton/Skeleton", () => ({
	Skeleton: ({ className }: { className?: string }) => (
		<div className={className} data-testid="data-grid-skeleton" />
	),
}));

vi.mock("../navigation/Pagination/Pagination", () => ({
	Pagination: ({
		page = 1,
		onChange,
	}: {
		page?: number;
		onChange?: (page: number) => void;
	}) => (
		<button type="button" onClick={() => onChange?.(page + 1)}>
			다음 페이지
		</button>
	),
}));

interface DataGridTestRow {
	id: Key;
	name: string;
	email: string;
	age: number;
}

const rows: DataGridTestRow[] = [
	{
		id: "user-1",
		name: "Ada Lovelace",
		email: "ada@example.com",
		age: 36,
	},
	{
		id: "user-2",
		name: "Grace Hopper",
		email: "grace@example.com",
		age: 85,
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
) {
	const queryValues: Record<string, unknown> = {
		skip: 0,
		take: 10,
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
		query: {
			values: queryValues,
			setValues,
		},
		selection: {
			selectedKeys,
			setSelectedKeys,
		},
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

	it("Given 빈 행 목록이나 loading 상태 When DataGrid를 렌더링하면 Then table 대신 상태 UI를 표시한다", () => {
		const { rerender } = render(
			<DataGrid
				config={{ ...baseConfig, emptyMessage: "표시할 사용자가 없습니다." }}
				state={createDataGridState()}
				rows={[]}
				totalCount={0}
			/>,
		);

		expect(screen.getByText("표시할 사용자가 없습니다.")).toBeInTheDocument();
		expect(screen.queryByRole("table")).not.toBeInTheDocument();

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

		fireEvent.click(screen.getByRole("button", { name: "다음 페이지" }));

		expect(state.query.setValues).toHaveBeenCalledWith({ skip: 10 });
	});
});
