"use client";

import { Button, type ButtonProps } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

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
	...buttonProps
}: ActionButtonCellProps) {
	const t = useT();
	const ariaLabel =
		typeof buttonProps["aria-label"] === "string"
			? t(buttonProps["aria-label"])
			: buttonProps["aria-label"];
	const title =
		typeof buttonProps.title === "string"
			? t(buttonProps.title)
			: buttonProps.title;

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Button size={size} {...buttonProps} aria-label={ariaLabel} title={title}>
				{translateNode(children, t)}
			</Button>
		</div>
	);
});
