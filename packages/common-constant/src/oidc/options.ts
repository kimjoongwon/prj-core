/**
 * OIDC 관련 옵션 상수
 *
 * OIDC 클라이언트 등록/수정 및 세션 관리에서 사용하는 선택지 상수입니다.
 */

/** 인증 방식 옵션 */
export const AUTH_METHOD_OPTIONS = [
	{ value: "client_secret_basic", label: "client_secret_basic" },
	{ value: "client_secret_post", label: "client_secret_post" },
	{ value: "none", label: "none (Public Client)" },
] as const;

/** Grant Type 옵션 */
export const GRANT_TYPE_OPTIONS = [
	{ value: "authorization_code", label: "authorization_code" },
	{ value: "client_credentials", label: "client_credentials" },
	{ value: "refresh_token", label: "refresh_token" },
] as const;

/** Response Type 옵션 */
export const RESPONSE_TYPE_OPTIONS = [
	{ value: "code", label: "code" },
] as const;

/** 런타임 환경변수로 URL 보정을 적용하는 OIDC 클라이언트 ID */
export const OIDC_RUNTIME_MANAGED_CLIENT_IDS = [
	"admin-web",
	"storybook-web",
	"user-mobile",
	"swagger-web",
] as const;

/** 모델 타입 필터 옵션 */
export const MODEL_TYPE_OPTIONS = [
	{ value: "", label: "전체" },
	{ value: "AccessToken", label: "Access Token" },
	{ value: "RefreshToken", label: "Refresh Token" },
	{ value: "AuthorizationCode", label: "Auth Code" },
	{ value: "Session", label: "Session" },
	{ value: "Grant", label: "Grant" },
	{ value: "ClientCredentials", label: "Client Credentials" },
	{ value: "DeviceCode", label: "Device Code" },
	{ value: "Interaction", label: "Interaction" },
] as const;

/** Scope 한글 레이블 */
export const SCOPE_LABELS: Record<string, string> = {
	openid: "기본 프로필 정보",
	email: "이메일 주소",
	profile: "프로필 정보 (이름)",
	phone: "전화번호",
	roles: "역할 정보",
	permissions: "권한 정보",
};

/** Scope별 SVG path 아이콘 */
export const SCOPE_ICONS: Record<string, string> = {
	openid: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
	email:
		"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
	profile:
		"M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
	phone:
		"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
};

/** 기본 Scope 아이콘 (정의되지 않은 scope용) */
export const DEFAULT_SCOPE_ICON =
	"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
