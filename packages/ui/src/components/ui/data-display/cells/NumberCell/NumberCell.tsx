interface NumberCellProps {
	/** 숫자 값 */
	value: number | string | null | undefined;
}

/**
 * NumberCell 컴포넌트
 * 숫자를 천 단위 구분자와 함께 표시합니다.
 *
 * @example
 * ```tsx
 * <NumberCell value={1234567} /> // "1,234,567"
 * <NumberCell value="1000" />    // "1,000"
 * <NumberCell value={null} />    // "-"
 * ```
 */
export const NumberCell = ({ value }: NumberCellProps) => {
	if (value === null || value === undefined || value === "") {
		return <p>-</p>;
	}

	const numValue = Number(value);
	if (Number.isNaN(numValue)) {
		return <p>-</p>;
	}

	return <p>{numValue.toLocaleString()}</p>;
};
