"use client";

import { observer } from "mobx-react-lite";
import { DataGridHeaderFilterView } from "./DataGridHeaderFilter";

export const DataGridHeaderFilter = observer(DataGridHeaderFilterView);
export type { DataGridHeaderFilterProps } from "./DataGridHeaderFilter";
