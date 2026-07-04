"use client";

import { observer } from "mobx-react-lite";
import { DataGridSelectionCellView } from "./DataGridSelectionCell";

export const DataGridSelectionCell = observer(DataGridSelectionCellView);
export type { DataGridSelectionCellProps } from "./DataGridSelectionCell";
