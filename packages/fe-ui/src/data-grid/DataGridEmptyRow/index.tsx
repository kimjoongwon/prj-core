"use client";

import { observer } from "mobx-react-lite";
import { DataGridEmptyRowView } from "./DataGridEmptyRow";

export const DataGridEmptyRow = observer(DataGridEmptyRowView);
export type { DataGridEmptyRowProps } from "./DataGridEmptyRow";
