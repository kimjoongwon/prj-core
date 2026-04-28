import type { Meta, StoryObj } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useState, type ComponentType } from "react";
import {
	DataGrid,
	type DataGridProps,
	type Key,
	type MultiSortDescriptor,
	type SortEvent,
} from "./DataGrid";

interface SampleRow {
	id: Key;
	name: string;
	email: string;
	status: "활성" | "비활성";
	createdAt: string;
}

const rows: SampleRow[] = [
	{
		id: 1,
		name: "김철수",
		email: "kim@example.com",
		status: "활성",
		createdAt: "2026-04-01",
	},
	{
		id: 2,
		name: "이영희",
		email: "lee@example.com",
		status: "비활성",
		createdAt: "2026-04-08",
	},
	{
		id: 3,
		name: "박민수",
		email: "park@example.com",
		status: "활성",
		createdAt: "2026-04-16",
	},
];

const columnHelper = createColumnHelper<SampleRow>();
const columns = [
	columnHelper.accessor("name", {
		header: "이름",
		meta: {
			align: "left",
		},
	}),
	columnHelper.accessor("email", {
		header: "이메일",
	}),
	columnHelper.accessor("status", {
		header: "상태",
		meta: {
			align: "center",
		},
		cell: ({ getValue }) => {
			const status = getValue();
			return (
				<span
					className={status === "활성" ? "text-success-500" : "text-danger-500"}
				>
					{status}
				</span>
			);
		},
	}),
	columnHelper.accessor("createdAt", {
		header: "등록일",
		meta: {
			align: "right",
		},
	}),
];

type StoryDataGridProps = Partial<DataGridProps<SampleRow>>;

const meta = {
	title: "DataGrid/DataGrid",
	component: DataGrid as ComponentType<StoryDataGridProps>,
	args: {
		"aria-label": "샘플 데이터 그리드",
	},
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta<StoryDataGridProps>;

export default meta;

type Story = StoryObj<StoryDataGridProps>;

const DataGridWrapper = observer<StoryDataGridProps>(
	({ data = rows, columns: storyColumns = columns, ...rest }) => {
		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		return (
			<DataGrid data={data} columns={storyColumns} state={state} {...rest} />
		);
	},
);

const SortableDataGridWrapper = observer<StoryDataGridProps>(
	({ data = rows, columns: storyColumns = columns, ...rest }) => {
		const [sorting, setSorting] = useState<MultiSortDescriptor>([]);
		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
			get sorting() {
				return sorting;
			},
		}));
		const onSortChange = (event: SortEvent) => {
			setSorting((previous) => {
				const existing = previous.find((item) => item.column === event.column);
				if (!existing) {
					return [{ column: event.column, direction: "asc" }];
				}
				if (existing.direction === "asc") {
					return [{ column: event.column, direction: "desc" }];
				}
				return [];
			});
		};

		return (
			<DataGrid
				data={data}
				columns={storyColumns}
				state={state}
				sortableColumns={["name", "email", "status", "createdAt"]}
				onSortChange={onSortChange}
				{...rest}
			/>
		);
	},
);

export const Default: Story = {
	render: (args) => <DataGridWrapper {...args} />,
};

export const Selectable: Story = {
	args: {
		selectionMode: "multiple",
	},
	render: (args) => <DataGridWrapper {...args} />,
};

export const Sortable: Story = {
	render: (args) => <SortableDataGridWrapper {...args} />,
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
	render: (args) => <DataGridWrapper {...args} />,
};
