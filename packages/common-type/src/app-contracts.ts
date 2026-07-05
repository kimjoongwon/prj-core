import type { Context, FC, ReactNode } from "react";
import type { AppAction, AppSubject } from "./ability";
import type { FABAction, NavItemConfig, ScreenScopeKind } from "./navigation";

/**
 * 권한 체크 함수 타입
 */
export type AbilityChecker = (
	action: AppAction,
	subject: AppSubject,
) => boolean;

export type NavItemScopeChecker = (scopeKind?: ScreenScopeKind) => boolean;

/**
 * FAB 권한 체크 함수 타입
 */
export type FABAbilityChecker = AbilityChecker;

/**
 * 모달 열기 핸들러 타입
 */
export type ModalOpenHandler = (modalId: string) => void;

/**
 * App 상태 객체가 의존하는 최소 네비게이터 계약
 */
export interface NavigatorLike {
	push: (path: string) => void;
}

/**
 * Navigation 생성 옵션
 */
export interface NavigationOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: NavigatorLike;
	/** 권한 체크 함수 */
	abilityChecker?: AbilityChecker;
	/** 화면 스코프 기반 노출 체크 함수 */
	scopeChecker?: NavItemScopeChecker;
	/**
	 * @deprecated navigator 사용을 권장합니다
	 */
	onNavigate?: (path: string) => void;
}

/**
 * FAB 액션 설정 인터페이스 (생성자 파라미터용)
 */
export interface FABConfig {
	actions: FABAction[];
}

/**
 * FloatingActions 생성 옵션
 */
export interface FloatingActionsOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: NavigatorLike;
	/** 권한 체크 함수 */
	abilityChecker?: FABAbilityChecker;
	/** 모달 열기 핸들러 */
	onModalOpen?: ModalOpenHandler;
}

/**
 * App Provider 생성 설정
 */
export interface AppProviderConfig {
	/** 네비게이션 아이템 설정 */
	navItems: NavItemConfig[];
	/** BottomTab에 표시할 탭 ID 목록 */
	bottomTabIds: readonly string[];
	/** "더보기" 탭 ID */
	moreTabId?: string;
	/** FAB 액션 목록 */
	fabActions: FABAction[];
	/** Space localStorage 키 */
	persistStorageKey: string;
	/** Locale localStorage 키. 미지정 시 `${persistStorageKey}:locale` */
	localeStorageKey?: string;
}

/**
 * createAppProvider 반환 타입
 */
export interface AppProviderResult<TApp> {
	AppContext: Context<TApp | null>;
	AppProvider: FC<{ children: ReactNode }>;
	useApp: () => TApp;
}
