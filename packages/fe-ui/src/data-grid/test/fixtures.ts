import type { DataGridQueryStates } from "@cocrepo/type";
import { vi } from "vitest";
import { DataGridSelectionState, DataGridState } from "../state/DataGridState";

export interface DataGridTestRow {
	id: bigint;
	name: string;
	status: "active" | "inactive";
}

export const dataGridTestRows: DataGridTestRow[] = [
	{ id: BigInt(1), name: "Alpha", status: "active" },
	{ id: BigInt(2), name: "Beta", status: "inactive" },
];

interface DataGridTestConfigOverrides {
	table?: Partial<
		NonNullable<ConstructorParameters<typeof DataGridState>[0]["table"]>
	>;
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
	} satisfies {
		toolbar?: ConstructorParameters<typeof DataGridState>[0]["toolbar"];
		groupPanel?: ConstructorParameters<typeof DataGridState>[0]["groupPanel"];
		table: NonNullable<DataGridTestConfigOverrides["table"]>;
	};
}

export function createDataGridTestState(
	queryStates: DataGridQueryStates = { skip: 0, take: 20 },
	config: DataGridTestConfigOverrides = {},
) {
	const selection = new DataGridSelectionState();
	const setQueryStates = vi.fn(async () => new URLSearchParams());
	const state = new DataGridState({
		queryStates,
		setQueryStates,
		...createDataGridTestConfig(config),
		rows: dataGridTestRows,
		totalCount: dataGridTestRows.length,
		selection,
	});

	return { state, selection, setQueryStates };
}
