"use client";

import { observer } from "mobx-react-lite";
import { DataGridSortHeaderView } from "./DataGridSortHeader";

export const DataGridSortHeader = observer(DataGridSortHeaderView);
export type { DataGridSortHeaderProps } from "./DataGridSortHeader";
export type { DataGridSortDirection } from "../internal/sorting";
