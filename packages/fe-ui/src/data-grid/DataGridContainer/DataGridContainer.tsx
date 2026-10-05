"use client";

import type { ReactNode } from "react";

export interface DataGridContainerProps {
	children: ReactNode;
}

/** DataGrid compound child를 배치만 하는 state-less container입니다. */
export function DataGridContainer({ children }: DataGridContainerProps) {
	return <>{children}</>;
}
