interface DefaultCellProps {
	/** 표시할 값 */
	value: string | number;
}

/**
 * DefaultCell 컴포넌트
 * 기본 텍스트 값을 표시합니다. 빈 값은 "-"로 표시됩니다.
 *
 * @example
 * ```tsx
 * <DefaultCell value="홍길동" />
 * <DefaultCell value={123} />
 * <DefaultCell value="" /> // "-"
 * ```
 */
export const DefaultCell = ({ value }: DefaultCellProps) => {
	if (!value && value !== 0) {
		return <p>-</p>;
	}

	return <p>{String(value)}</p>;
};
