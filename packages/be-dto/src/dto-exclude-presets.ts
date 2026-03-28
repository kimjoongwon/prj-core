import type { ActionDto } from "./action.dto";

/**
 * 자주 사용하는 exclude 필드 프리셋
 * @ApiResponseEntity의 exclude 옵션에서 사용하여 타입 안전성과 재사용성 향상
 */

/**
 * Action DTO용 exclude 프리셋
 */
export const ActionExcludePresets = {
	/**
	 * 목록 조회용 - 최소 필드만 반환
	 * 제외: config, description, order
	 */
	LIST: ["config", "description", "order"] as const,

	/**
	 * 요약 정보용 - 목록보다 더 적은 필드
	 * 제외: config, description, order, isSystem, createdAt, updatedAt, removedAt
	 */
	SUMMARY: [
		"config",
		"description",
		"order",
		"isSystem",
		"createdAt",
		"updatedAt",
		"removedAt",
	] as const,
} satisfies Record<string, ReadonlyArray<keyof ActionDto>>;
