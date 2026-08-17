import type {
	DataGridChangesSnapshot,
	DataGridColumnConfig,
	DataGridColumnsStateSnapshot,
	DataGridConfig,
	DataGridQueryStates,
	DataGridRowData,
} from "@cocrepo/type";
import type { ExpandedState } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { Key } from "./internal/rowKeys";

export interface DataGridTableProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
	columns: DataGridColumnsStateSnapshot;
	queryValues: DataGridQueryStates;
	changes: DataGridChangesSnapshot<T>;
	expanded: ExpandedState;
	selectedKeys: string[];
	activeRowId?: string | null;
	overRowId?: string | null;
	dragOffset?: number;
	onColumnChange: (columns: DataGridColumnsStateSnapshot) => void;
	onQueryChange: (values: Record<string, unknown | null>) => void;
	onChangesChange: (changes: DataGridChangesSnapshot<T>) => void;
	onExpandedChange: (expanded: ExpandedState) => void;
	onSelectedKeysChange: (keys: string[]) => void;
	onRowMoveStart?: (rowId: string) => void;
	onRowMoveOver?: (rowId: string | null) => void;
	onRowMoveOffsetChange?: (offset: number) => void;
	onRowMoveReset?: () => void;
}

export interface DataGridToolbarProps<T extends { id: Key }> {
	columns: DataGridColumnConfig<T>[];
	columnState: DataGridColumnsStateSnapshot;
	queryValues: DataGridQueryStates;
	onColumnChange: (columns: DataGridColumnsStateSnapshot) => void;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export interface DataGridActionBarProps {
	selectedCount: number;
	showCount?: boolean;
	actions?: ReactNode;
}

export type DataGridChanges<T extends DataGridRowData> = DataGridChangesSnapshot<T>;
