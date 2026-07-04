"use client";

import { observer } from "mobx-react-lite";
import { DataGridTableBodyView } from "./DataGridTableBody";

export const DataGridTableBody = observer(
	DataGridTableBodyView,
) as typeof DataGridTableBodyView;
export type { DataGridTableBodyProps } from "./DataGridTableBody";
