import type { Meta, StoryObj } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";
import { runInAction } from "mobx";
import { useState } from "react";
import {
	createDataGridState,
	DataGrid,
	type DataGridState,
	type Key,
} from "./DataGrid";
import { addRow, updateQuery } from "./useHandlers";

interface EmployeeRow {
	id: Key;
	name: string;
	department: string;
	role: string;
	status: "재직" | "휴직";
	children?: EmployeeRow[];
}

const column = createColumnHelper<EmployeeRow>();
const columns = [
	column.accessor("name", {
		header: "이름",
		enableSorting: true,
		enableGrouping: true,
		enableResizing: true,
		meta: { label: "이름", rowExpander: true },
	}),
	column.accessor("department", {
		header: "부서",
		enableSorting: true,
		enableGrouping: true,
		enableResizing: true,
		meta: { label: "부서" },
	}),
	column.accessor("role", {
		header: "직책",
		enableSorting: true,
		enableResizing: true,
		meta: { label: "직책" },
	}),
	column.accessor("status", {
		header: "상태",
		enableSorting: true,
		meta: { label: "상태" },
	}),
];

const employeeRows: EmployeeRow[] = [
	{
		id: "employee-1",
		name: "김민서",
		department: "플랫폼",
		role: "팀장",
		status: "재직",
		children: [
			{
				id: "employee-2",
				name: "박서준",
				department: "플랫폼",
				role: "엔지니어",
				status: "재직",
			},
			{
				id: "employee-3",
				name: "이하은",
				department: "플랫폼",
				role: "엔지니어",
				status: "휴직",
			},
		],
	},
	{
		id: "employee-4",
		name: "정도윤",
		department: "제품",
		role: "팀장",
		status: "재직",
		children: [
			{
				id: "employee-5",
				name: "최유진",
				department: "제품",
				role: "디자이너",
				status: "재직",
			},
		],
	},
	{
		id: "employee-6",
		name: "한지우",
		department: "운영",
		role: "팀장",
		status: "재직",
		children: [
			{
				id: "employee-7",
				name: "윤서연",
				department: "운영",
				role: "매니저",
				status: "재직",
			},
		],
	},
	{
		id: "employee-8",
		name: "오지훈",
		department: "플랫폼",
		role: "엔지니어",
		status: "재직",
	},
	{
		id: "employee-9",
		name: "강수아",
		department: "제품",
		role: "기획자",
		status: "재직",
	},
	{
		id: "employee-10",
		name: "임도현",
		department: "운영",
		role: "매니저",
		status: "휴직",
	},
	{
		id: "employee-11",
		name: "신예린",
		department: "플랫폼",
		role: "엔지니어",
		status: "재직",
	},
];

const PAGE_SIZE = 5;

function createEmployeeDataGridState(
	initialQuery: Record<string, unknown> = {},
	allRows = employeeRows,
	totalCount = employeeRows.length,
) {
	let state: DataGridState<EmployeeRow>;
	const setQueryStates = async (values: Record<string, unknown | null>) => {
		const nextQuery = { ...state.query.filters, ...values };
		updateQuery(state.query, nextQuery);
		const skip = state.query.pagination.skip;
		const take = state.query.pagination.take;
		const search = String(state.query.filters.search ?? "")
			.trim()
			.toLocaleLowerCase();
		const filteredRows = allRows.filter(
			(row) =>
				!search ||
				row.name.toLocaleLowerCase().includes(search) ||
				row.department.toLocaleLowerCase().includes(search),
		);
		runInAction(() => {
			state.pagination.totalCount = filteredRows.length;
			state.table.rows = filteredRows.slice(skip, skip + take);
		});
		return new URLSearchParams();
	};
	state = createDataGridState<EmployeeRow>({
		query: { take: PAGE_SIZE, skip: 0, ...initialQuery },
		setQueryStates,
		pagination: { totalCount },
		table: {
			rows: allRows.slice(0, PAGE_SIZE),
			columns,
			selection: { mode: "multiple" },
			row: { onClick: (row) => console.info("행 클릭", row.id) },
			getSubRows: (row) => row.children,
		},
		actionBar: { showCount: true },
		toolbar: {
			leftInputs: [
				{ type: "search", id: "search", placeholder: "이름 또는 부서 검색" },
			],
			rightInputs: [
				{
					type: "button",
					id: "addEmployee",
					label: "행 추가",
					props: { variant: "bordered", size: "sm" },
					handlers: {
						onClick: () =>
							addRow(state, {
								id: `employee-${crypto.randomUUID()}`,
								name: "새 구성원",
								department: "플랫폼",
								role: "엔지니어",
								status: "재직",
							}),
					},
				},
			],
		},
		groupPanel: { show: "always" },
	});
	return state;
}

function FullDataGridStory({
	query = {},
	initiallySelected = false,
}: {
	query?: Record<string, unknown>;
	initiallySelected?: boolean;
}) {
	const [state] = useState(() => {
		const dataGridState = createEmployeeDataGridState(query);
		if (initiallySelected) {
			runInAction(() => {
				dataGridState.table.selectedRowKeys = new Set(["employee-1"]);
			});
		}
		return dataGridState;
	});
	return (
		<div className="p-6">
			<DataGrid state={state} />
		</div>
	);
}

const meta = {
	title: "data-grid/DataGrid",
	component: FullDataGridStory,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"검색·정렬·그룹핑·계층 행·선택·페이지 이동을 한 화면에서 확인하는 DataGrid 전체 구성 예시입니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof FullDataGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullSet: Story = {};

export const InitiallyGrouped: Story = {
	args: { query: { groupBy: ["department"] } },
};

export const SelectedRows: Story = {
	args: { initiallySelected: true },
};

export const Empty: Story = {
	render: () => (
		<div className="p-6">
			<DataGrid state={createEmployeeDataGridState({}, [], 0)} />
		</div>
	),
};
