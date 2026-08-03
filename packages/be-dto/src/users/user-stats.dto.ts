import { NumberField } from "@cocrepo/decorator/field";

/**
 * 사용자 목록 통계 정보
 */
export class UserStatsDto {
	@NumberField({ description: "전체 사용자 수" })
	total: number;

	@NumberField({ description: "활성 사용자 수 (최근 30일 내 활동)" })
	active: number;

	@NumberField({ description: "비활성 사용자 수 (30일 이상 미활동)" })
	inactive: number;

	@NumberField({ description: "이번 달 신규 가입자 수" })
	newThisMonth: number;
}
