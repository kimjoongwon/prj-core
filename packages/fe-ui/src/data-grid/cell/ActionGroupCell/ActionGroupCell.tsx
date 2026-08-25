import type { ReactNode } from "react";

export interface ActionGroupCellProps {
	children: ReactNode;
	gap?: "sm" | "md";
}

/** 여러 Cell action을 한 행으로 정렬합니다. */
export function ActionGroupCell({
	children,
	gap = "sm",
}: ActionGroupCellProps) {
	return (
		<div
			className={`flex items-center justify-center ${gap === "md" ? "gap-2" : "gap-1"}`}
		>
			{children}
		</div>
	);
}
