import type {
	DataGridColumnConfig,
	DataGridConfig,
	DataGridQueryStates,
	DataGridRowMoveEvent,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { ChipCell } from "./cell";
import { DataGrid, DataGridSelectionState, DataGridState } from "./index";

interface StoryRow {
	id: bigint;
	name: string;
	email: string;
	status: "활성" | "비활성";
	createdAt: Date;
	children?: StoryRow[];
}

const storyRows: StoryRow[] = [
	{
		id: BigInt(1),
		name: "김철수",
		email: "kim@example.com",
		status: "활성",
		createdAt: new Date("2026-04-01T00:00:00Z"),
	},
	{
		id: BigInt(2),
		name: "이영희",
		email: "lee@example.com",
		status: "비활성",
		createdAt: new Date("2026-04-08T00:00:00Z"),
	},
	{
		id: BigInt(3),
		name: "박민수",
		email: "park@example.com",
		status: "활성",
		createdAt: new Date("2026-04-16T00:00:00Z"),
	},
	{
		id: BigInt(4),
		name: "최서윤",
		email: "seo-yoon@example.com",
		status: "활성",
		createdAt: new Date("2026-04-22T00:00:00Z"),
	},
];

const hierarchyRows: StoryRow[] = [
	{
		id: BigInt(101),
		name: "플랫폼팀",
		email: "platform@example.com",
		status: "활성",
		createdAt: new Date("2026-04-01T00:00:00Z"),
		children: [
			{
				id: BigInt(102),
				name: "김철수",
				email: "kim@example.com",
				status: "활성",
				createdAt: new Date("2026-04-01T00:00:00Z"),
			},
			{
				id: BigInt(103),
				name: "이영희",
				email: "lee@example.com",
				status: "비활성",
				createdAt: new Date("2026-04-08T00:00:00Z"),
			},
		],
	},
	{
		id: BigInt(201),
		name: "제품팀",
		email: "product@example.com",
		status: "활성",
		createdAt: new Date("2026-04-16T00:00:00Z"),
		children: [
			{
				id: BigInt(202),
				name: "박민수",
				email: "park@example.com",
				status: "활성",
				createdAt: new Date("2026-04-16T00:00:00Z"),
			},
		],
	},
];

class StoryDataGridFixture {
	readonly selection: DataGridSelectionState;
	readonly state: DataGridState;
	rows: StoryRow[];

	constructor(
		rows: StoryRow[],
		queryValues: DataGridQueryStates,
		selectedKeys: string[] = [],
	) {
		this.rows = rows;
		let currentQueryValues = { ...queryValues };
		this.selection = new DataGridSelectionState(new Set(selectedKeys));
		const setQueryStates: DataGridSetQueryStates = async (nextValues) => {
			currentQueryValues = Object.fromEntries(
				Object.entries({ ...currentQueryValues, ...nextValues }).filter(
					([, value]) => value !== null && value !== undefined && value !== "",
				),
			);
			this.state.syncQuery(currentQueryValues, setQueryStates);

			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(currentQueryValues)) {
				if (Array.isArray(value)) {
					for (const item of value) searchParams.append(key, String(item));
				} else {
					searchParams.set(key, String(value));
				}
			}
			return searchParams;
		};
		this.state = new DataGridState({
			queryStates: currentQueryValues,
			setQueryStates,
			selection: this.selection,
		});
		makeAutoObservable(
			this,
			{ selection: false, state: false },
			{ autoBind: true },
		);
	}

	applyRowMove(event: DataGridRowMoveEvent<StoryRow>) {
		const rowsWithoutMovedRow = this.removeRow(this.rows, event.row.id);
		this.rows = this.replaceSiblingRows(
			rowsWithoutMovedRow,
			event.parent?.id ?? null,
			event.siblings,
		);
	}

	private removeRow(rows: StoryRow[], rowId: bigint): StoryRow[] {
		return rows
			.filter((row) => row.id !== rowId)
			.map((row) => ({
				...row,
				children: row.children
					? this.removeRow(row.children, rowId)
					: undefined,
			}));
	}

	private replaceSiblingRows(
		rows: StoryRow[],
		parentId: bigint | null,
		siblings: StoryRow[],
	): StoryRow[] {
		if (parentId === null) {
			return siblings;
		}

		return rows.map((row) =>
			row.id === parentId
				? { ...row, children: siblings }
				: {
						...row,
						children: row.children
							? this.replaceSiblingRows(row.children, parentId, siblings)
							: undefined,
					},
		);
	}
}

type StoryMode = "default" | "hierarchy" | "inline-edit" | "row-move";

type StoryArgs = {
	mode?: StoryMode;
	rows?: StoryRow[];
	queryValues?: DataGridQueryStates;
	selectedKeys?: string[];
	isLoading?: boolean;
};

function createStoryConfig(
	mode: StoryMode,
	onRowMove?: (event: DataGridRowMoveEvent<StoryRow>) => void,
): DataGridConfig<StoryRow> {
	const isHierarchy = mode === "hierarchy" || mode === "row-move";
	const isEditable = mode === "inline-edit";

	const columns: DataGridColumnConfig<StoryRow>[] = [
		{
			field: "name",
			label: "이름",
			isRequired: true,
			isSortable: true,
			enableRowGroup: true,
			rowExpander: isHierarchy,
			...(isEditable
				? {
						editable: {
							editor: { type: "text", placeholder: "이름 입력" },
							triggers: ["click", "enter", "f2"],
						},
					}
				: {}),
		},
		{
			field: "email",
			label: "이메일",
			floatingFilter: true,
			headerInput: {
				type: "search",
				id: "email-filter",
				placeholder: "이메일 필터",
				props: { queryKey: "email" },
			},
		},
		{
			field: "status",
			label: "상태",
			enableRowGroup: true,
			floatingFilter: true,
			headerInput: {
				type: "select",
				id: "status-filter",
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
				const status = getValue() as StoryRow["status"];
				return (
					<ChipCell
						label={status}
						color={status === "활성" ? "success" : "danger"}
					/>
				);
			},
		},
		{
			field: "createdAt",
			label: "등록일",
			align: "right",
			isSortable: true,
		},
	];

	return {
		groupPanel: { show: "always" },
		table: {
			entity: "StoryUser",
			columns,
			selection: {
				mode: "multiple",
				actionBar: { showCount: true },
			},
			getSubRows: isHierarchy ? (row) => row.children : undefined,
			onRowMove: mode === "row-move" ? onRowMove : undefined,
			emptyMessage: "표시할 데이터가 없습니다.",
		},
	};
}

function filterStoryRows(rows: StoryRow[], queryValues: DataGridQueryStates) {
	return rows.filter((row) => doesStoryRowMatchQuery(row, queryValues));
}

function doesStoryRowMatchQuery(
	row: StoryRow,
	queryValues: DataGridQueryStates,
) {
	const name = typeof queryValues.name === "string" ? queryValues.name : "";
	const email = typeof queryValues.email === "string" ? queryValues.email : "";
	const status =
		typeof queryValues.status === "string" ? queryValues.status : "";

	return (
		(!name || row.name.includes(name)) &&
		(!email || row.email.includes(email)) &&
		(!status || row.status === status)
	);
}

function filterHierarchyStoryRows(
	rows: StoryRow[],
	queryValues: DataGridQueryStates,
): StoryRow[] {
	return rows.flatMap((row) => {
		const filteredChildren = row.children
			? filterHierarchyStoryRows(row.children, queryValues)
			: undefined;
		const hasMatchingChildren = Boolean(filteredChildren?.length);

		if (!doesStoryRowMatchQuery(row, queryValues) && !hasMatchingChildren) {
			return [];
		}

		return [filteredChildren ? { ...row, children: filteredChildren } : row];
	});
}

function sortStoryRows(rows: StoryRow[], queryValues: DataGridQueryStates) {
	const sortValue = Array.isArray(queryValues.sort)
		? queryValues.sort[0]
		: queryValues.sort;
	if (typeof sortValue !== "string" || sortValue.length === 0) return rows;

	const isDescending = sortValue.startsWith("-");
	const field = (
		isDescending ? sortValue.slice(1) : sortValue
	) as keyof StoryRow;
	return [...rows].sort((left, right) => {
		const comparison = String(left[field] ?? "").localeCompare(
			String(right[field] ?? ""),
			"ko",
		);
		return isDescending ? -comparison : comparison;
	});
}

function paginateStoryRows(rows: StoryRow[], queryValues: DataGridQueryStates) {
	const skip = typeof queryValues.skip === "number" ? queryValues.skip : 0;
	const take =
		typeof queryValues.take === "number" ? queryValues.take : rows.length;
	return rows.slice(skip, skip + take);
}

const DataGridStory = observer(function DataGridStory({
	mode = "default",
	rows = storyRows,
	queryValues = { skip: 0, take: 10 },
	selectedKeys = [],
	isLoading = false,
}: StoryArgs) {
	const fixture = useLocalObservable(
		() => new StoryDataGridFixture(rows, queryValues, selectedKeys),
	);
	const filteredRows = filterStoryRows(
		fixture.rows,
		fixture.state.query.values,
	);
	const sortedRows = sortStoryRows(filteredRows, fixture.state.query.values);
	const renderedRows =
		mode === "hierarchy"
			? filterHierarchyStoryRows(fixture.rows, fixture.state.query.values)
			: mode === "row-move"
				? rows
				: paginateStoryRows(sortedRows, fixture.state.query.values);

	return (
		<DataGrid
			config={createStoryConfig(mode, fixture.applyRowMove)}
			state={fixture.state}
			rows={renderedRows}
			totalCount={sortedRows.length}
			isLoading={isLoading}
		/>
	);
});

const meta = {
	title: "data-grid/DataGrid",
	component: DataGridStory,
	parameters: { layout: "padded" },
} satisfies Meta<typeof DataGridStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <DataGridStory {...args} />,
};

export const Loading: Story = {
	args: { isLoading: true },
	render: (args) => <DataGridStory {...args} />,
};

export const Empty: Story = {
	args: { rows: [], queryValues: { skip: 0, take: 10 } },
	render: (args) => <DataGridStory {...args} />,
};

export const Selected: Story = {
	args: { selectedKeys: ["user-002", "user-004"] },
	render: (args) => <DataGridStory {...args} />,
};

export const Sort: Story = {
	args: { queryValues: { skip: 0, take: 10, sort: ["-createdAt"] } },
	render: (args) => <DataGridStory {...args} />,
};

export const Filter: Story = {
	args: { queryValues: { skip: 0, take: 10 } },
	render: (args) => <DataGridStory {...args} />,
};

export const Pagination: Story = {
	args: { queryValues: { skip: 2, take: 2 } },
	render: (args) => <DataGridStory {...args} />,
};

export const Grouping: Story = {
	args: { queryValues: { skip: 0, take: 10, groupBy: ["status"] } },
	render: (args) => <DataGridStory {...args} />,
};

export const Hierarchy: Story = {
	args: { mode: "hierarchy", rows: hierarchyRows },
	render: (args) => <DataGridStory {...args} />,
};

export const InlineEdit: Story = {
	args: { mode: "inline-edit" },
	render: (args) => <DataGridStory {...args} />,
};

export const RowMove: Story = {
	args: { mode: "row-move", rows: hierarchyRows },
	render: (args) => <DataGridStory {...args} />,
};
