import type { Context, FC, ReactNode } from "react";
import type { AppAction, AppSubject } from "./ability";
import type { FABAction, NavItemConfig } from "./navigation";

/**
 * 권한 체크 함수 타입
 */
export type AbilityChecker = (
	action: AppAction,
	subject: AppSubject,
) => boolean;

/**
 * FAB 권한 체크 함수 타입
 */
export type FABAbilityChecker = AbilityChecker;

/**
 * 모달 열기 핸들러 타입
 */
export type ModalOpenHandler = (modalId: string) => void;

/**
 * Store가 의존하는 최소 네비게이터 계약
 */
export interface NavigatorLike {
	push: (path: string) => void;
}

/**
 * NavigationStore 생성 옵션
 */
export interface NavigationStoreOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: NavigatorLike;
	/** 권한 체크 함수 */
	abilityChecker?: AbilityChecker;
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
 * FABStore 생성 옵션
 */
export interface FABStoreOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: NavigatorLike;
	/** 권한 체크 함수 */
	abilityChecker?: FABAbilityChecker;
	/** 모달 열기 핸들러 */
	onModalOpen?: ModalOpenHandler;
}

/**
 * AppStore Provider 생성 설정
 */
export interface AppStoreConfig {
	/** 네비게이션 아이템 설정 */
	navItems: NavItemConfig[];
	/** BottomTab에 표시할 탭 ID 목록 */
	bottomTabIds: readonly string[];
	/** "더보기" 탭 ID */
	moreTabId?: string;
	/** FAB 액션 목록 */
	fabActions: FABAction[];
	/** PersistStore localStorage 키 */
	persistStorageKey: string;
}

/**
 * createAppStoreProvider 반환 타입
 */
export interface AppStoreProviderResult<
	TStore,
	TNavigationStore,
	TPersistStore,
	TBottomTabStore,
	TFABStore,
> {
	AppStoreContext: Context<TStore | null>;
	AppStoreProvider: FC<{ children: ReactNode }>;
	useAppStore: () => TStore;
	useNavigationStore: () => TNavigationStore;
	usePersistStore: () => TPersistStore;
	useBottomTabStore: () => TBottomTabStore;
	useFABStore: () => TFABStore;
}
