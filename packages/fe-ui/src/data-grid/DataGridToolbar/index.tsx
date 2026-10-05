"use client";

import { observer } from "mobx-react-lite";
import { DataGridToolbarView } from "./DataGridToolbar";

export const DataGridToolbar = observer(
	DataGridToolbarView,
) as typeof DataGridToolbarView;
export type { DataGridToolbarProps } from "./DataGridToolbar";
