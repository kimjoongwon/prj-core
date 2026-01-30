import { Chip } from "@heroui/react";

interface BooleanCellProps {
	/** 불린 값 */
	value: boolean | null | undefined;
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
export const BooleanCell = ({ value }: BooleanCellProps) => {
	if (value === null || value === undefined) {
		return <p>-</p>;
	}

	const boolValue = Boolean(value);

	return (
		<Chip color={boolValue ? "success" : "default"} size="sm" variant="flat">
			{boolValue ? "예" : "아니오"}
		</Chip>
	);
};
