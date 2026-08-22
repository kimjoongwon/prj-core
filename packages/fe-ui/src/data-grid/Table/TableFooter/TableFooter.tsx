"use client";

import type { DataGridTableFooterState } from "../../state/table/DataGridTableFooterState";

export interface TableFooterProps {
	state: DataGridTableFooterState;
}

/** 합계·소계 요구가 생길 때 footer 내용을 추가하는 Table leaf입니다. */
export function TableFooter({ state: _state }: TableFooterProps) {
	return null;
}
