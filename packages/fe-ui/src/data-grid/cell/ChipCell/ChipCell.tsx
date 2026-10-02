"use client";

import { observer } from "mobx-react-lite";
import type { ChipProps } from "../../../data-display/Chip/Chip";
import { Chip } from "../../../data-display/Chip/Chip";
import { useT } from "../../../i18n";
import { DefaultCell } from "../DefaultCell/DefaultCell";

export interface ChipCellProps {
	/** 표시 라벨 */
	label?: string | number | null;
	/** 칩 색상 */
	color?: ChipProps["color"];
	/** 칩 variant */
	variant?: ChipProps["variant"];
	/** 칩 크기 */
	size?: ChipProps["size"];
	/** 값이 없을 때 대체 텍스트 */
	placeholder?: string;
	/** 추가 클래스 */
	className?: string;
	/** 정렬 */
	align?: "center" | "start" | "end";
}

const ALIGN_CLASS_NAME: Record<NonNullable<ChipCellProps["align"]>, string> = {
	center: "justify-center",
	start: "justify-start",
	end: "justify-end",
};

/**
 * 문자열 라벨을 HeroUI Chip으로 감싸는 범용 셀
 */
export const ChipCell = observer(function ChipCell({
	label,
	color = "default",
	variant = "soft",
	size = "sm",
	placeholder = "-",
	className,
	align = "center",
}: ChipCellProps) {
	const t = useT();

	if (label === null || label === undefined || label === "") {
		return <DefaultCell value={placeholder} />;
	}

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Chip size={size} color={color} variant={variant} className={className}>
				{typeof label === "string" ? t(label) : String(label)}
			</Chip>
		</div>
	);
});
