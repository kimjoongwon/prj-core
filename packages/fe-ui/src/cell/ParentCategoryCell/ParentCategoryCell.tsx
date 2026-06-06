interface ParentCategoryCellProps {
	/** 부모 카테고리명 (없으면 null) */
	parentName: string | null | undefined;
}

/**
 * ParentCategoryCell 컴포넌트
 * 부모 카테고리명을 표시하며, 없으면 "-"를 표시합니다.
 *
 * @example
 * ```tsx
 * <ParentCategoryCell parentName="WORKSPACE" />
 * <ParentCategoryCell parentName={null} /> // "-"
 * ```
 */
export const ParentCategoryCell = ({ parentName }: ParentCategoryCellProps) => {
	if (!parentName) {
		return <p className="text-muted">-</p>;
	}

	return <p>{parentName}</p>;
};
