"use client";

import { observer } from "mobx-react-lite";
import { DataGridTableView } from "./DataGridTable";

export const DataGridTable = observer(
	DataGridTableView,
) as typeof DataGridTableView;
export type { DataGridTableProps } from "./DataGridTable";
