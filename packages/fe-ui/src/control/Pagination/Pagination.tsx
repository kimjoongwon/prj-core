import {
	Pagination as HeroUIPagination,
	type PaginationProps as HeroUIPaginationProps,
} from "@cocrepo/ui/heroui";

export interface PaginationProps
	extends Omit<HeroUIPaginationProps, "total" | "page" | "onChange"> {
	/** 전체 항목 수 */
	totalCount: number;
	/** 페이지당 항목 수 */
	limit?: number;
	/** 현재 페이지 (1부터 시작) */
	page?: number;
	/** 페이지 변경 핸들러 */
	onChange?: (page: number) => void;
}

/**
 * Pagination 컴포넌트
 * HeroUI Pagination을 래핑하여 totalCount/limit 기반으로 전체 페이지 수를 자동 계산합니다.
 *
 * @example
 * ```tsx
 * <Pagination
 *   totalCount={100}
 *   limit={10}
 *   page={currentPage}
 *   onChange={setCurrentPage}
 * />
 * // totalCount=100, limit=10 → total=10 페이지
 * ```
 */
export const Pagination = (props: PaginationProps) => {
	const { totalCount, limit = 20, page = 1, onChange, ...rest } = props;

	const safeLimit = limit > 0 ? limit : 20;
	const total = Math.max(1, Math.ceil(totalCount / safeLimit));

	return (
		<HeroUIPagination {...rest} total={total} page={page} onChange={onChange} />
	);
};
