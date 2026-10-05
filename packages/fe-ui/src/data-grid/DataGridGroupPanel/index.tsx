"use client";

import { observer } from "mobx-react-lite";
import { DataGridGroupPanelView } from "./DataGridGroupPanel";

export const DataGridGroupPanel = observer(
	DataGridGroupPanelView,
) as typeof DataGridGroupPanelView;
export type { DataGridGroupPanelProps } from "./DataGridGroupPanel";
