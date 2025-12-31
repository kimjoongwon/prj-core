/**
 * CASL 액션 타입
 */
export type AbilityActions =
	| "ACCESS" // 메뉴/기능 접근
	| "CREATE" // 생성
	| "READ" // 조회
	| "UPDATE" // 수정
	| "DELETE" // 삭제
	| "MANAGE"; // 모든 권한

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
}
