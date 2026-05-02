"use client";

import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { DefaultCell } from "../DefaultCell/DefaultCell";

type BooleanCellColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";

export interface BooleanCellProps {
	/** 불린 값 */
	value: boolean | null | undefined;
	/** 값이 true일 때 라벨 */
	trueLabel?: string;
	/** 값이 false일 때 라벨 */
	falseLabel?: string;
	/** 값이 true일 때 칩 색상 */
	trueColor?: BooleanCellColor;
	/** 값이 false일 때 칩 색상 */
	falseColor?: BooleanCellColor;
	/** 값이 없을 때 대체 텍스트 */
	placeholder?: string;
}

/**
 * BooleanCell 컴포넌트
 * 불린 값을 "예/아니오" Chip으로 표시합니다.
 *
 * @example
 * ```tsx
 * <BooleanCell value={true} />  // "예" (success 색상)
 * <BooleanCell value={false} /> // "아니오" (default 색상)
 * <BooleanCell value={null} />  // "-"
 * ```
 */
export const BooleanCell = observer(function BooleanCell({
	value,
	trueLabel = "예",
	falseLabel = "아니오",
	trueColor = "success",
	falseColor = "default",
	placeholder = "-",
}: BooleanCellProps) {
	const t = useT();

	if (value === null || value === undefined) {
		return <DefaultCell value={placeholder} />;
	}

	const boolValue = Boolean(value);

	return (
		<Chip color={boolValue ? trueColor : falseColor} size="sm" variant="flat">
			{t(boolValue ? trueLabel : falseLabel)}
		</Chip>
	);
});
