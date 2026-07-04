import type {
	DataGridColumnsStateSnapshot,
	DataGridConfig,
	DataGridQueryStates,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from "nuqs";
import type { ComponentType } from "react";
import { ChipCell } from "./cell";
import { DataGrid, type Key } from "./DataGrid";
import { DataGridSelectionState, DataGridState } from "./DataGridState";

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

function getQueryStringArray(queryStates: DataGridQueryStates, key: string) {
	const value = queryStates[key];
	if (Array.isArray(value)) {
		return value.filter((item): item is string => typeof item === "string");
	}
	if (typeof value === "string" && value.length > 0) {
		return [value];
	}
	return [];
}

function getQueryString(queryStates: DataGridQueryStates, key: string) {
	const value = queryStates[key];
	return typeof value === "string" ? value : "";
}

function filterStoryRows(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
) {
	const name = getQueryString(queryStates, "name");
	const email = getQueryString(queryStates, "email");
	const status = getQueryString(queryStates, "status");
	const createdAtFrom = getQueryString(queryStates, "createdAtFrom");
	const createdAtTo = getQueryString(queryStates, "createdAtTo");

	return storyRows.filter((row) => {
		if (name && !row.name.toLowerCase().includes(name.toLowerCase())) {
			return false;
		}
		if (email && !row.email.toLowerCase().includes(email.toLowerCase())) {
			return false;
		}
		if (status && row.status !== status) {
			return false;
		}
		if (createdAtFrom && row.createdAt < createdAtFrom) {
			return false;
		}
		if (createdAtTo && row.createdAt > createdAtTo) {
			return false;
		}
		return true;
	});
}

function sortStoryRows(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
) {
	const [sortKey] = getQueryStringArray(queryStates, "sort");
	if (!sortKey) {
		return storyRows;
	}

	const isDesc = sortKey.startsWith("-");
	const field = (isDesc ? sortKey.slice(1) : sortKey) as keyof SampleRow;

	return [...storyRows].sort((left, right) => {
		const leftValue = String(left[field] ?? "");
		const rightValue = String(right[field] ?? "");
		const result = leftValue.localeCompare(rightValue, "ko");
		return isDesc ? -result : result;
	});
}

function paginateStoryRows(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
) {
	const skip =
		typeof queryStates.skip === "number" && queryStates.skip > 0
			? queryStates.skip
			: 0;
	const take =
		typeof queryStates.take === "number" && queryStates.take > 0
			? queryStates.take
			: storyRows.length;

	return storyRows.slice(skip, skip + take);
}

function getStoryPagination(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
) {
	const skip =
		typeof queryStates.skip === "number" && queryStates.skip > 0
			? queryStates.skip
			: 0;
	const take =
		typeof queryStates.take === "number" && queryStates.take > 0
			? queryStates.take
			: storyRows.length;

	return { skip, take };
}

function paginateStoryGroups(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
	groupBy: string[],
) {
	const [field] = groupBy as (keyof SampleRow)[];
	if (!field) {
		return {
			rows: paginateStoryRows(storyRows, queryStates),
			totalCount: storyRows.length,
		};
	}

	const groups = new Map<string, SampleRow[]>();
	for (const row of storyRows) {
		const value = row[field];
		const key = String(value ?? "");
		const groupRows = groups.get(key);
		if (groupRows) {
			groupRows.push(row);
		} else {
			groups.set(key, [row]);
		}
	}

	const { skip, take } = getStoryPagination(storyRows, queryStates);
	const groupRows = Array.from(groups.values());

	return {
		rows: groupRows.slice(skip, skip + take).flat(),
		totalCount: groupRows.length,
	};
}

function resolveStoryRows(
	storyRows: SampleRow[],
	queryStates: DataGridQueryStates,
) {
	const filteredRows = filterStoryRows(storyRows, queryStates);
	const sortedRows = sortStoryRows(filteredRows, queryStates);
	const groupBy = getQueryStringArray(queryStates, "groupBy");

	if (groupBy.length > 0) {
		return paginateStoryGroups(sortedRows, queryStates, groupBy);
	}

	return {
		rows: paginateStoryRows(sortedRows, queryStates),
		totalCount: sortedRows.length,
	};
}

const config: DataGridConfig<SampleRow> = {
	entity: "Sample",
	rowGroupPanelShow: "always",
	columns: [
		{
			field: "name",
			label: "이름",
			isRequired: true,
			enableSorting: true,
			enableRowGroup: true,
			size: 180,
			floatingFilter: true,
			headerInput: {
				type: "search",
				id: "nameHeader",
				placeholder: "이름 필터",
				props: {
					queryKey: "name",
				},
			},
		},
		{
			field: "email",
			label: "이메일",
			size: 260,
			floatingFilter: true,
			headerInput: {
				type: "search",
				id: "emailHeader",
				placeholder: "이메일 필터",
				props: {
					queryKey: "email",
				},
			},
		},
		{
			field: "status",
			label: "상태",
			align: "center",
			enableRowGroup: true,
			size: 140,
			floatingFilter: true,
			headerInput: {
				type: "select",
				id: "statusHeader",
				placeholder: "전체",
				props: {
					queryKey: "status",
					isClearable: true,
					options: [
						{ label: "활성", value: "활성" },
						{ label: "비활성", value: "비활성" },
					],
				},
			},
			cell: ({ getValue }) => {
				const status = getValue();
				return (
					<ChipCell
						label={status as string}
						color={status === "활성" ? "success" : "danger"}
					/>
				);
			},
		},
		{
			field: "createdAt",
			label: "등록일",
			align: "right",
			enableSorting: true,
			enableRowGroup: true,
			size: 280,
			floatingFilter: true,
			headerInput: {
				type: "date-range",
				id: "createdAtHeader",
				label: "등록일",
				props: {
					queryKeys: {
						start: "createdAtFrom",
						end: "createdAtTo",
					},
				},
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

const groupedConfig: DataGridConfig<SampleRow> = {
	...config,
	columns: config.columns.map((column) =>
		column.field === "status" ? { ...column, rowGroup: true } : column,
	),
};

type StoryDataGridProps = {
	rows?: SampleRow[];
	totalCount?: number;
	isLoading?: boolean;
	config?: DataGridConfig<SampleRow>;
	initialColumns?: Partial<DataGridColumnsStateSnapshot>;
	initialGroupBy?: string[];
	initialTake?: number;
};

const meta = {
	title: "data-grid/DataGrid",
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
	({
		rows: storyRows = rows,
		totalCount = rows.length,
		isLoading = false,
		config: storyConfig = config,
		initialColumns,
		initialGroupBy = [],
		initialTake = 10,
	}) => {
		const [queryStates, setQueryStates] = useQueryStates({
			skip: parseAsInteger.withDefault(0),
			take: parseAsInteger.withDefault(initialTake),
			sort: parseAsArrayOf(parseAsString).withDefault([]),
			groupBy: parseAsArrayOf(parseAsString).withDefault(initialGroupBy),
			name: parseAsString.withDefault(""),
			email: parseAsString.withDefault(""),
			status: parseAsString.withDefault(""),
			createdAtFrom: parseAsString.withDefault(""),
			createdAtTo: parseAsString.withDefault(""),
		});
		const setDataGridQueryStates =
			setQueryStates as unknown as DataGridSetQueryStates;
		const selection = useLocalObservable(() => new DataGridSelectionState());
		const state = useLocalObservable(
			() =>
				new DataGridState({
					columns: initialColumns,
					queryStates,
					setQueryStates: setDataGridQueryStates,
					selection,
				}),
		);
		state.syncQuery(queryStates, setDataGridQueryStates);
		const resolvedRows = resolveStoryRows(storyRows, queryStates);

		return (
			<DataGrid
				config={storyConfig}
				state={state}
				rows={resolvedRows.rows}
				totalCount={isLoading ? totalCount : resolvedRows.totalCount}
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

export const GroupedRows: Story = {
	args: {
		config: groupedConfig,
		initialColumns: {
			grouping: ["status"],
		},
	},
	render: (args) => <DataGridWrapper {...args} />,
};

export const GroupPagination: Story = {
	args: {
		initialColumns: {
			grouping: ["status"],
		},
		initialGroupBy: ["status"],
		initialTake: 1,
	},
	render: (args) => <DataGridWrapper {...args} />,
};

export const ColumnPreferences: Story = {
	args: {
		initialColumns: {
			order: ["status", "name", "createdAt", "email"],
			visibility: {
				email: false,
			},
			sizing: {
				name: 220,
				status: 120,
			},
		},
	},
	render: (args) => <DataGridWrapper {...args} />,
};
