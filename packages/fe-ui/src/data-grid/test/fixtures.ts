import type {
	DataGridConfig,
	DataGridGroupPanelConfig,
	DataGridQueryStates,
	DataGridTableConfig,
	DataGridToolbarConfig,
} from "@cocrepo/type";
import { vi } from "vitest";
import { DataGridSelectionState, DataGridState } from "../state/DataGridState";

export interface DataGridTestRow {
	id: string;
	name: string;
	status: "active" | "inactive";
}

export const dataGridTestRows: DataGridTestRow[] = [
	{ id: "row-1", name: "Alpha", status: "active" },
	{ id: "row-2", name: "Beta", status: "inactive" },
];

interface DataGridTestConfigOverrides {
	toolbar?: DataGridToolbarConfig;
	groupPanel?: DataGridGroupPanelConfig;
	table?: Partial<DataGridTableConfig<DataGridTestRow>>;
}

export function createDataGridTestConfig(
	overrides: DataGridTestConfigOverrides = {},
) {
	return {
		toolbar: overrides.toolbar,
		groupPanel: overrides.groupPanel,
		table: {
			entity: "DataGridTestRow",
			columns: [
				{ field: "name", label: "Name", isRequired: true, isSortable: true },
				{ field: "status", label: "Status", enableRowGroup: true },
			],
			selection: { mode: "multiple", actionBar: { showCount: true } },
			emptyMessage: "No rows",
			...overrides.table,
		},
	} as DataGridConfig<DataGridTestRow>;
}

export function createDataGridTestState(
	queryStates: DataGridQueryStates = { skip: 0, take: 20 },
) {
	const selection = new DataGridSelectionState();
	const setQueryStates = vi.fn(async () => new URLSearchParams());
	const state = new DataGridState({
		queryStates,
		setQueryStates,
		selection,
	});

	return { state, selection, setQueryStates };
}

export function createDataGridTableMock(rowIds = dataGridTestRows.map((row) => row.id)) {
	const rows = rowIds.map((id) => ({
		id,
		getIsGrouped: () => false,
		getParentRow: () => undefined,
		depth: 0,
	}));

	return {
		getCoreRowModel: () => ({ rows }),
		getRowModel: () => ({ rows }),
		getFlatHeaders: () => [],
		getVisibleLeafColumns: () => [],
		setOptions: vi.fn(),
	};
}
