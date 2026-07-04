"use client";

import { observer } from "mobx-react-lite";
import { DataGridActionBarView } from "./DataGridActionBar";

export const DataGridActionBar = observer(
	DataGridActionBarView,
) as typeof DataGridActionBarView;
export type { DataGridActionBarProps } from "./DataGridActionBar";
