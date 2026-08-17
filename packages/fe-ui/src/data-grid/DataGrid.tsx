"use client";

import type { ReactNode } from "react";
import { DataGridActionBar } from "./DataGridActionBar";
import { DataGridPanel } from "./DataGridGroupPanel";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridTable } from "./DataGridTable";
import { DataGridToolbar } from "./DataGridToolbar";

export type { Key } from "./internal/rowKeys";
export { getDataGridRowKey } from "./internal/rowKeys";

export interface DataGridProps {
	children: ReactNode;
}

function DataGridRoot({ children }: DataGridProps) {
	return <>{children}</>;
}

export const DataGrid = Object.assign(DataGridRoot, {
	Toolbar: DataGridToolbar,
	Panel: DataGridPanel,
	Table: DataGridTable,
	Pagination: DataGridPagination,
	ActionBar: DataGridActionBar,
});
