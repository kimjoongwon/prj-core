"use client";

import { observer } from "mobx-react-lite";
import { DataGridColumnSettingsView } from "./DataGridColumnSettings";

export const DataGridColumnSettings = observer(
	DataGridColumnSettingsView,
) as typeof DataGridColumnSettingsView;
export type { DataGridColumnSettingsProps } from "./DataGridColumnSettings";
