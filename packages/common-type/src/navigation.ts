// ============================================
// 네비게이션 관련 타입
// ============================================

import type { AppIconName } from "./icon";

export type ScreenScopeKind =
	| "space"
	| "tenant-user"
	| "global-full-access-only";

/**
 * 탭 설정 인터페이스 (v7.0 신규)
 * 페이지 내 3depth 탭 정보
 */
export interface TabConfig {
	id: string;
	label: string;
	href: string;
}

/**
 * 네비게이션 아이템 설정 인터페이스 (생성자 파라미터용)
 */
export interface NavItemConfig {
	id: string;
	label: string;
	path?: string;
	icon?: AppIconName;
	subject: string;
	scopeKind?: ScreenScopeKind;
	children?: NavItemConfig[];
	/** v7.0 신규: 3depth 탭 정보 */
	tabs?: TabConfig[];
}
