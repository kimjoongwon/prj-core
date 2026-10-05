"use client";

import type { ReactNode } from "react";

export interface TableFooterProps {
	children?: ReactNode;
}

/** 합계·소계 행을 감싸는 Table footer입니다. */
export function TableFooter({ children }: TableFooterProps) {
	return children ? <tfoot>{children}</tfoot> : null;
}
