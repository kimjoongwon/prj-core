import { Pagination as HeroPagination } from "@heroui/react";

export interface PaginationProps {
	/** 전체 항목 수 */
	totalCount?: number;
	/** 전체 페이지 수 */
	total?: number;
	/** 페이지당 항목 수 */
	limit?: number;
	/** 현재 페이지 (1부터 시작) */
	page?: number;
	/** 페이지 변경 핸들러 */
	onChange?: (page: number) => void;
	showControls?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg";
	"aria-label"?: string;
}

/**
 * Pagination 컴포넌트
 * HeroUI Pagination을 래핑하여 totalCount/limit 기반으로 전체 페이지 수를 자동 계산합니다.
 */
export const Pagination = (props: PaginationProps) => {
	const {
		totalCount,
		total: totalProp,
		limit = 20,
		page = 1,
		onChange,
		showControls = false,
		...rest
	} = props;

	const safeLimit = limit > 0 ? limit : 20;
	const total = totalProp ?? Math.max(1, Math.ceil((totalCount ?? 0) / safeLimit));

	const handlePrevious = () => {
		onChange?.(Math.max(1, page - 1));
	};

	const handleNext = () => {
		onChange?.(Math.min(total, page + 1));
	};

	return (
		<HeroPagination {...rest}>
			<HeroPagination.Content>
				{showControls ? (
					<HeroPagination.Item>
						<HeroPagination.Previous onPress={handlePrevious}>
							Previous
						</HeroPagination.Previous>
					</HeroPagination.Item>
				) : null}
				{Array.from({ length: total }, (_, index) => {
					const pageNumber = index + 1;
					const handlePress = () => {
						onChange?.(pageNumber);
					};

					return (
						<HeroPagination.Item key={pageNumber}>
							<HeroPagination.Link
								isActive={pageNumber === page}
								onPress={handlePress}
							>
								{pageNumber}
							</HeroPagination.Link>
						</HeroPagination.Item>
					);
				})}
				{showControls ? (
					<HeroPagination.Item>
						<HeroPagination.Next onPress={handleNext}>Next</HeroPagination.Next>
					</HeroPagination.Item>
				) : null}
			</HeroPagination.Content>
		</HeroPagination>
	);
};
