import { NumberField } from "@cocrepo/decorator";

/**
 * 페이지네이션 메타 정보
 */
export class UserPaginationMetaDto {
	@NumberField({ description: "전체 사용자 수" })
	total: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip: number;

	@NumberField({ description: "조회 항목 수" })
	take: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages: number;
}
