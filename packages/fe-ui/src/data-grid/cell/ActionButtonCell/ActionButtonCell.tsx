"use client";

import { observer } from "mobx-react-lite";
import type { ButtonProps } from "../../../input/Button/Button";
import { Button } from "../../../input/Button/Button";

export interface ActionButtonCellProps extends ButtonProps {
	/** 버튼 정렬 */
	align?: "center" | "start" | "end";
}

const ALIGN_CLASS_NAME: Record<
	NonNullable<ActionButtonCellProps["align"]>,
	string
> = {
	center: "justify-center",
	start: "justify-start",
	end: "justify-end",
};

/**
 * 테이블 셀 안에서 사용하는 범용 액션 버튼
 */
export const ActionButtonCell = observer(function ActionButtonCell({
	align = "center",
	size = "sm",
	children,
	fullWidth,
	...buttonProps
}: ActionButtonCellProps) {
	return (
		<div
			className={`flex ${fullWidth === false ? "w-auto" : "w-full"} ${ALIGN_CLASS_NAME[align]}`}
		>
			<Button fullWidth={fullWidth} size={size} {...buttonProps}>
				{children}
			</Button>
		</div>
	);
});
