import { NumberField } from "@cocrepo/decorator";

/**
 * 문의 통계 응답 DTO
 */
export class InquiryStatsDto {
	@NumberField({ description: "전체 문의 수" })
	total!: number;

	@NumberField({ description: "신규 문의 수" })
	new!: number;

	@NumberField({ description: "진행 중 문의 수" })
	inProgress!: number;

	@NumberField({ description: "대기 중 문의 수" })
	waiting!: number;

	@NumberField({ description: "해결된 문의 수" })
	resolved!: number;

	@NumberField({ description: "종료된 문의 수" })
	closed!: number;

	@NumberField({ description: "에스컬레이션 문의 수" })
	escalated!: number;

	@NumberField({ description: "SLA 위반 문의 수" })
	slaBreached!: number;

	@NumberField({ description: "평균 응답 시간 (분)" })
	avgResponseTime!: number;

	@NumberField({ description: "평균 해결 시간 (분)" })
	avgResolutionTime!: number;
}
