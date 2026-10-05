import type { AppAction, AppSubject } from "./ability";
import type { NavItemConfig, ScreenScopeKind } from "./navigation";

/**
 * 권한 체크 함수 타입
 */
export type AbilityChecker = (
	action: AppAction,
	subject: AppSubject,
) => boolean;

export type NavItemScopeChecker = (scopeKind?: ScreenScopeKind) => boolean;

/**
 * App 상태 객체가 의존하는 최소 네비게이터 계약
 */
export interface NavigatorLike {
	push: (path: string) => void;
}

/**
 * App Provider 생성에 필요한 완성된 설정입니다.
 */
export interface AppProviderConfig {
	/** App 식별 이름 */
	appName: string;
	/** 네비게이션 아이템 설정 */
	navItems: NavItemConfig[];
	/** App persisted state 문서의 storage key */
	persistStorageKey: string;
}
