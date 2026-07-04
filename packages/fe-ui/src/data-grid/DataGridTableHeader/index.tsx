"use client";

import { observer } from "mobx-react-lite";
import { DataGridTableHeaderView } from "./DataGridTableHeader";

export const DataGridTableHeader = observer(
	DataGridTableHeaderView,
) as typeof DataGridTableHeaderView;
export type { DataGridTableHeaderProps } from "./DataGridTableHeader";
