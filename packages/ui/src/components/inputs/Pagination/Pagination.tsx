import {
	Pagination as HeroUIPagination,
	type PaginationProps as HeroUIPaginationProps,
} from "@heroui/react";

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
 * Pagination Pure 컴포넌트
 *
 * HeroUI Pagination을 래핑하여 totalCount/limit 기반으로 total 페이지 수를 계산합니다.
 */
export const Pagination = (props: PaginationProps) => {
	const { totalCount, limit = 20, page = 1, onChange, ...rest } = props;

	const total = Math.max(1, Math.ceil(totalCount / limit));

	const handleChange = (newPage: number) => {
		onChange?.(newPage);
	};

	return (
		<HeroUIPagination
			{...rest}
			total={total}
			page={page}
			onChange={handleChange}
		/>
	);
};
