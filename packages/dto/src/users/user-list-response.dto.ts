import { NumberField } from "@cocrepo/decorator";

/**
 * 회원 목록 통계 정보
 */
export class UserStatsDto {
	@NumberField({ description: "전체 회원 수" })
	total: number;

	@NumberField({ description: "활성 회원 수 (최근 30일 내 활동)" })
	active: number;

	@NumberField({ description: "비활성 회원 수 (30일 이상 미활동)" })
	inactive: number;

	@NumberField({ description: "이번 달 신규 가입자 수" })
	newThisMonth: number;
}

/**
 * 페이지네이션 메타 정보
 */
export class UserPaginationMetaDto {
	@NumberField({ description: "전체 회원 수" })
	total: number;

	@NumberField({ description: "현재 페이지 번호" })
	page: number;

	@NumberField({ description: "페이지 크기" })
	limit: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages: number;
}
