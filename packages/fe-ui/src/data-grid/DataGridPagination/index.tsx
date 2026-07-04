"use client";

import { observer } from "mobx-react-lite";
import { DataGridPaginationView } from "./DataGridPagination";

export const DataGridPagination = observer(DataGridPaginationView);
export type { DataGridPaginationProps } from "./DataGridPagination";
