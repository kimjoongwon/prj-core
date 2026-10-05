/**
 * Frontend CASL 액션 표준(소문자)
 *
 * 백엔드 Action name과 1:1로 같지 않을 수 있으므로,
 * 매핑은 @cocrepo/store의 변환 유틸에서 처리합니다.
 */
export const APP_ACTIONS = [
	"create",
	"read",
	"update",
	"delete",
	"manage",
	"view",
	"view_masked",
	"view_partial",
	"view_hidden",
	"export",
	"import",
	"approve",
	"reject",
	"submit",
	"cancel",
] as const;

/**
 * CASL Action 타입
 */
export type AppAction = (typeof APP_ACTIONS)[number];

/**
 * CASL Subject 타입
 * - entity:xxx, menu:xxx, feature:xxx, ui:xxx 패턴
 */
export type AppSubject = string | "all";

/**
 * 앱 상태에 저장되는 표준 권한 규칙
 */
export interface AbilityRule {
	action: AppAction | AppAction[];
	subject: AppSubject | AppSubject[];
	fields?: string[];
	conditions?: Record<string, unknown>;
	inverted?: boolean;
	reason?: string;
}

/**
 * API 응답 권한 데이터를 앱 권한 규칙으로 변환하기 위한 입력 타입
 * - action/subject는 문자열 또는 객체(name 필드) 모두 허용
 */
export interface AbilityApiResponse {
	action?: string | { name?: string | null } | null;
	subject?: string | { name?: string | null } | null;
	fields?: string[] | null;
	conditions?: Record<string, unknown> | null;
	inverted?: boolean;
	reason?: string | null;
	isActive?: boolean;
}
