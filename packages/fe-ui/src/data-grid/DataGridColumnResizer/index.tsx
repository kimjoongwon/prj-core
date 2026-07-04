"use client";

import { observer } from "mobx-react-lite";
import { DataGridColumnResizerView } from "./DataGridColumnResizer";

export const DataGridColumnResizer = observer(DataGridColumnResizerView);
export type { DataGridColumnResizerProps } from "./DataGridColumnResizer";
