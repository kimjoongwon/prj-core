"use client";

import { observer } from "mobx-react-lite";
import { DataGridSortHeaderView } from "./DataGridSortHeader";

export const DataGridSortHeader = observer(DataGridSortHeaderView);
export type { DataGridSortDirection } from "../internal/sorting";
export type { DataGridSortHeaderProps } from "./DataGridSortHeader";
