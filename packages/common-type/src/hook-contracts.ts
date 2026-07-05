/**
 * useFormField 공통 base 옵션
 */
interface UseFormFieldBaseOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
> {
	value: TValue;
	state: TState;
}

/**
 * useFormField 단일 경로 옵션
 */
export interface UseFormFieldSingleOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPath extends string = string,
> extends UseFormFieldBaseOptions<TState, TValue> {
	path: TPath;
	paths?: never;
	valueSplitter?: never;
	valueAggregator?: never;
}

/**
 * useFormField 다중 경로 옵션
 */
export interface UseFormFieldMultiOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends readonly string[] = readonly [string, string, ...string[]],
> extends UseFormFieldBaseOptions<TState, TValue> {
	path?: never;
	paths: TPaths;
	valueSplitter: (value: TValue, paths: TPaths) => Record<string, unknown>;
	valueAggregator?: (values: Record<string, unknown>, paths: TPaths) => TValue;
}

/**
 * useFormField 반환 타입
 */
export interface UseFormFieldReturn<TValue> {
	state: { value: TValue };
	setValue: (value: TValue) => void;
}

/**
 * useAbilities 입력 옵션 계약
 */
export interface UseAbilitiesOptions<TAbility = unknown> {
	abilities?: TAbility[] | null;
	isLoading?: boolean;
	isError?: boolean;
	isDisabled?: boolean;
}

/**
 * useAbilities 반환 계약
 */
export interface UseAbilitiesReturn<TAbility = unknown> {
	abilities: TAbility[];
	isLoading: boolean;
	isError: boolean;
	isDisabled: boolean;
}

export interface UseLayoutSideNavigationLike {
	items: unknown;
	selectedItem: unknown;
	selectedSubItem: unknown;
	expandedItemIds: unknown;
	selectItem: (itemId: string) => void;
	selectSubItem: (subItemId: string) => void;
	toggleItem: (itemId: string) => void;
}

export interface UseLayoutMobileBottomNavigationLike {
	items: unknown;
	activeItemId: unknown;
	selectItem: (itemId: string) => void;
}

export interface UseLayoutMobileMenuLike {
	isOpen: boolean;
	title: string;
	items: unknown;
	close: () => void;
}

export interface UseLayoutFloatingActionLike {
	isOpen: boolean;
	actions: unknown;
	toggle: () => void;
	execute: (actionId: string) => void;
}

/**
 * useLayout가 의존하는 App UI 최소 계약
 */
export interface UseLayoutAppLike {
	ui: {
		body: {
			leftAside: {
				sideNavigation: UseLayoutSideNavigationLike;
			};
		};
		footer: {
			mobileBottomNavigation: UseLayoutMobileBottomNavigationLike;
			mobileMenu: UseLayoutMobileMenuLike;
			floatingAction: UseLayoutFloatingActionLike;
		};
	};
}

/**
 * useLayout 옵션 인터페이스
 */
export type UseLayoutOptions = Record<string, never>;

/**
 * useLayout 반환 타입
 */
export interface UseLayoutReturn<
	TApp extends UseLayoutAppLike = UseLayoutAppLike,
> {
	// 네비게이션 데이터
	navItems: TApp["ui"]["body"]["leftAside"]["sideNavigation"]["items"];
	selectedNavItem: TApp["ui"]["body"]["leftAside"]["sideNavigation"]["selectedItem"];
	selectedSubNavItem: TApp["ui"]["body"]["leftAside"]["sideNavigation"]["selectedSubItem"];
	expandedNavItemIds: TApp["ui"]["body"]["leftAside"]["sideNavigation"]["expandedItemIds"];

	// 모바일 - BottomTab
	bottomTabItems: TApp["ui"]["footer"]["mobileBottomNavigation"]["items"];
	activeBottomTabId: TApp["ui"]["footer"]["mobileBottomNavigation"]["activeItemId"];

	// 모바일 - SubMenuList
	isSubMenuOpen: TApp["ui"]["footer"]["mobileMenu"]["isOpen"];
	subMenuTitle: TApp["ui"]["footer"]["mobileMenu"]["title"];
	subMenuItems: TApp["ui"]["footer"]["mobileMenu"]["items"];

	// 모바일 - FAB
	isFABOpen: TApp["ui"]["footer"]["floatingAction"]["isOpen"];
	fabActions: TApp["ui"]["footer"]["floatingAction"]["actions"];

	// 핸들러
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onNavItemToggle: (navItemId: string) => void;
	onBottomTabClick: (tabId: string) => void;
	onSubMenuClose: () => void;
	onFABToggle: () => void;
	onFABActionClick: (actionId: string) => void;
}

/**
 * useSpaceGuard가 의존하는 space 최소 계약
 */
export interface SpaceGuardScopeLike {
	tenantId?: string | null;
	spaceId?: string | null;
	groundName?: string | null;
	isHydrated?: boolean;
	isSpaceSelectionResolved?: boolean;
}

export interface SpaceGuardAppLike<
	TSpaceScope extends SpaceGuardScopeLike = SpaceGuardScopeLike,
> {
	space?: TSpaceScope;
}

/**
 * useSpaceGuard 옵션 인터페이스
 */
export interface UseSpaceGuardOptions<
	TSpaceScope extends SpaceGuardScopeLike = SpaceGuardScopeLike,
> {
	useApp: () => SpaceGuardAppLike<TSpaceScope>;
	/** Space 선택 페이지 경로 (기본값: "/select-space") */
	selectSpacePath?: string;
}

/**
 * useSpaceGuard 반환 타입
 */
export interface UseSpaceGuardReturn {
	/** Alert 표시 여부 */
	showAlert: boolean;
	/** Alert 확인 버튼 핸들러 */
	handleConfirm: () => void;
	/** Alert 닫기 핸들러 */
	handleDismiss: () => void;
	/** Space가 선택되어 있는지 여부 */
	hasSpace: boolean;
	/** 현재 선택된 Ground 이름 */
	groundName: string | null;
}

/**
 * Space bootstrap이 참조하는 Space 최소 계약
 */
export interface SpaceBootstrapSpaceLike {
	id?: string | null;
	tenantId?: string | null;
	contentLanguageCode?: string | null;
	ground?: {
		name?: string | null;
	} | null;
}

/**
 * Persist 계층에 저장할 Space 선택 항목 계약
 */
export interface SpaceBootstrapSelection {
	tenantId: string;
	spaceId: string;
	groundName: string;
	contentLanguageCode?: string | null;
}

/**
 * useSpaceBootstrap이 값을 반영할 space 최소 계약
 */
export interface SpaceBootstrapScopeLike {
	isSpaceSelectionResolved?: boolean;
	setSpaces: (spaces: SpaceBootstrapSelection[]) => void;
	setSpace: (
		tenantId: string,
		groundName: string,
		contentLanguageCode?: string | null,
		spaceId?: string | null,
	) => void;
	clearSpace: () => void;
	setSpaceSelectionResolved: (resolved: boolean) => void;
}

/**
 * useSpaceBootstrap 입력 옵션 계약
 */
export interface UseSpaceBootstrapOptions<
	TSpace extends SpaceBootstrapSpaceLike = SpaceBootstrapSpaceLike,
> {
	space: SpaceBootstrapScopeLike;
	isHydrated: boolean;
	spaces?: TSpace[] | null;
	currentSpace?: TSpace | null;
	isCurrentSpaceFetched: boolean;
}

/**
 * useSpaceBootstrap 반환 계약
 */
export interface UseSpaceBootstrapReturn<
	TSpace extends SpaceBootstrapSpaceLike = SpaceBootstrapSpaceLike,
> {
	spaces: TSpace[];
	currentSpace: TSpace | null;
	isCurrentSpaceFetched: boolean;
	isSpaceBootstrapReady: boolean;
}
