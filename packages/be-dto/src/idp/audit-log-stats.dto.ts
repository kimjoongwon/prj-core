import { NumberField } from "@cocrepo/decorator/field";

/**
 * 감사 로그 통계 DTO
 */
export class AuditLogStatsDto {
	@NumberField({ description: "오늘 성공 건수" })
	todaySuccessCount!: number;

	@NumberField({ description: "오늘 실패 건수" })
	todayFailureCount!: number;

	@NumberField({ description: "오늘 잠금 건수" })
	todayLockedCount!: number;

	@NumberField({ description: "전체 건수" })
	totalCount!: number;
}
