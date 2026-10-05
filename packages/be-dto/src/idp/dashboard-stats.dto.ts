import { NumberField } from "@cocrepo/decorator/field";

export class DashboardStatsDto {
	@NumberField({ description: "활성 세션 수" })
	activeSessionCount!: number;

	@NumberField({ description: "오늘 성공 건수" })
	todaySuccessCount!: number;

	@NumberField({ description: "오늘 실패 건수" })
	todayFailureCount!: number;

	@NumberField({ description: "오늘 잠금 건수" })
	todayLockedCount!: number;

	@NumberField({ description: "잠금 계정 수" })
	lockedAccountCount!: number;

	@NumberField({ description: "활성 클라이언트 수" })
	activeClientCount!: number;
}
