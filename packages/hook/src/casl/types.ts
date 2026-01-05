/**
 * CASL 액션 타입
 */
export type AbilityActions =
	| "ACCESS" // 메뉴/기능 접근
	| "CREATE" // 생성
	| "READ" // 조회
	| "UPDATE" // 수정
	| "DELETE" // 삭제
	| "MANAGE" // 모든 권한
	| "EXPORT" // 내보내기
	| "IMPORT" // 가져오기
	| "APPROVE" // 승인
	| "REJECT"; // 거부

/**
 * CASL 권한 규칙
 */
export interface AbilityRule {
	action: AbilityActions | AbilityActions[];
	subject: string;
	inverted?: boolean; // true면 권한 거부
	conditions?: Record<string, unknown>;
}

/**
 * Ability 인터페이스
 */
export interface AppAbility {
	can: (action: AbilityActions, subject: string) => boolean;
	cannot: (action: AbilityActions, subject: string) => boolean;
	rules: AbilityRule[];
}

/**
 * Ability 컨텍스트 값
 */
export interface AbilityContextValue {
	ability: AppAbility;
	isLoading: boolean;
	refetch?: () => void;
}

/**
 * API 응답에서 온 권한 데이터 (AbilityResponseDto와 호환)
 */
export interface AbilityApiResponse {
	type: "CAN" | "CAN_NOT";
	action: string;
	conditions?: Record<string, unknown> | null;
	isActive: boolean;
	subject?: {
		name: string;
	};
}

/**
 * API 응답을 AbilityRule로 변환
 */
export function convertApiToRules(
	apiResponses: AbilityApiResponse[],
): AbilityRule[] {
	return apiResponses
		.filter((item) => item.isActive && item.subject)
		.map((item) => ({
			action: item.action as AbilityActions,
			subject: item.subject?.name ?? "",
			inverted: item.type === "CAN_NOT",
			conditions: item.conditions ?? undefined,
		}));
}
