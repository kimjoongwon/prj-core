import type { DataGridConfig, DataGridQueryStates } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { ComponentType } from "react";
import { DataGrid, type DataGridProps, type Key } from "./DataGrid";
import {
	DataGridSelectionStateModel,
	DataGridStateModel,
} from "./DataGridState";

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

const config: DataGridConfig<SampleRow> = {
	entity: "Sample",
	columns: [
		{
			field: "name",
			label: "이름",
			isRequired: true,
		},
		{
			field: "email",
			label: "이메일",
		},
		{
			field: "status",
			label: "상태",
			align: "center",
			cell: ({ getValue }) => {
				const status = getValue();
				return (
					<span
						className={
							status === "활성" ? "text-success-500" : "text-danger-500"
						}
					>
						{status as string}
					</span>
				);
			},
		},
		{
			field: "createdAt",
			label: "등록일",
			align: "right",
		},
	],
	leftInputs: [
		{
			type: "search",
			id: "search",
			placeholder: "검색",
		},
	],
	rightInputs: [
		{
			type: "button",
			id: "create",
			label: "등록",
			props: {
				variant: "flat",
				color: "primary",
				startContent: <Plus className="h-4 w-4" />,
			},
			handlers: {
				onClick: () => undefined,
			},
		},
	],
	selection: {
		mode: "multiple",
		actionBar: {
			showCount: true,
			actions: [
				{
					type: "button",
					id: "delete",
					label: "삭제",
					props: {
						variant: "flat",
						color: "danger",
						size: "sm",
					},
					handlers: {
						onClick: () => undefined,
					},
				},
			],
		},
	},
};

type StoryDataGridProps = Pick<
	DataGridProps<SampleRow>,
	"rows" | "totalCount" | "isLoading"
>;

const meta = {
	title: "DataGrid/DataGrid",
	component: DataGrid as ComponentType<StoryDataGridProps>,
	args: {
		rows,
		totalCount: rows.length,
		isLoading: false,
	},
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta<StoryDataGridProps>;

export default meta;

type Story = StoryObj<StoryDataGridProps>;

const DataGridWrapper = observer<StoryDataGridProps>(
	({ rows: storyRows = rows, totalCount = rows.length, isLoading = false }) => {
		const queryStates = useLocalObservable(
			() =>
				({
					skip: 0,
					take: 10,
					search: "",
				}) as DataGridQueryStates,
		);
		const selection = useLocalObservable(
			() => new DataGridSelectionStateModel(),
		);
		const state = useLocalObservable(
			() =>
				new DataGridStateModel({
					queryStates,
					setQueryStates: async (values) => {
						for (const [key, value] of Object.entries(values)) {
							if (value === null) {
								delete queryStates[key];
							} else {
								queryStates[key] = value;
							}
						}
						return new URLSearchParams();
					},
					selection,
				}),
		);

		return (
			<DataGrid
				config={config}
				state={state}
				rows={storyRows}
				totalCount={totalCount}
				isLoading={isLoading}
			/>
		);
	},
);

export const Default: Story = {
	render: (args) => <DataGridWrapper {...args} />,
};

export const Empty: Story = {
	args: {
		rows: [],
		totalCount: 0,
	},
	render: (args) => <DataGridWrapper {...args} />,
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
	render: (args) => <DataGridWrapper {...args} />,
};
