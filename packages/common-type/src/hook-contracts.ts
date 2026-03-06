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
 * useLayout가 의존하는 NavigationStore 최소 계약
 */
export interface UseLayoutNavigationStoreLike {
	items: unknown;
	selectedNavItem: unknown;
	selectedSubNavItem: unknown;
	expandedNavItemIds: unknown;
	selectNavItem: (navItemId: string) => void;
	selectSubNavItem: (subNavItemId: string) => void;
	toggleNavItem: (navItemId: string) => void;
}

/**
 * useLayout가 의존하는 BottomTabStore 최소 계약
 */
export interface UseLayoutBottomTabStoreLike {
	tabItems: unknown;
	activeTabId: unknown;
	isSubMenuOpen: boolean;
	subMenuTitle: string;
	subMenuItems: unknown;
	selectTab: (tabId: string) => void;
	closeSubMenu: () => void;
}

/**
 * useLayout가 의존하는 FABStore 최소 계약
 */
export interface UseLayoutFABStoreLike {
	isOpen: boolean;
	visibleActions: unknown;
	toggle: () => void;
	executeAction: (actionId: string) => void;
}

/**
 * useLayout 옵션 인터페이스
 */
export interface UseLayoutOptions<
	TNavigationStore extends
		UseLayoutNavigationStoreLike = UseLayoutNavigationStoreLike,
	TBottomTabStore extends
		UseLayoutBottomTabStoreLike = UseLayoutBottomTabStoreLike,
	TFABStore extends UseLayoutFABStoreLike = UseLayoutFABStoreLike,
> {
	useNavigationStore: () => TNavigationStore;
	useBottomTabStore: () => TBottomTabStore;
	useFABStore: () => TFABStore;
}

/**
 * useLayout 반환 타입
 */
export interface UseLayoutReturn<
	TNavigationStore extends
		UseLayoutNavigationStoreLike = UseLayoutNavigationStoreLike,
	TBottomTabStore extends
		UseLayoutBottomTabStoreLike = UseLayoutBottomTabStoreLike,
	TFABStore extends UseLayoutFABStoreLike = UseLayoutFABStoreLike,
> {
	// 네비게이션 데이터
	navItems: TNavigationStore["items"];
	selectedNavItem: TNavigationStore["selectedNavItem"];
	selectedSubNavItem: TNavigationStore["selectedSubNavItem"];
	expandedNavItemIds: TNavigationStore["expandedNavItemIds"];

	// 모바일 - BottomTab
	bottomTabItems: TBottomTabStore["tabItems"];
	activeBottomTabId: TBottomTabStore["activeTabId"];

	// 모바일 - SubMenuList
	isSubMenuOpen: TBottomTabStore["isSubMenuOpen"];
	subMenuTitle: TBottomTabStore["subMenuTitle"];
	subMenuItems: TBottomTabStore["subMenuItems"];

	// 모바일 - FAB
	isFABOpen: TFABStore["isOpen"];
	fabActions: TFABStore["visibleActions"];

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
 * useSpaceGuard가 의존하는 PersistStore 최소 계약
 */
export interface SpaceGuardPersistStoreLike {
	spaceId?: string | null;
	groundName?: string | null;
}

/**
 * useSpaceGuard 옵션 인터페이스
 */
export interface UseSpaceGuardOptions<
	TPersistStore extends SpaceGuardPersistStoreLike = SpaceGuardPersistStoreLike,
> {
	usePersistStore: () => TPersistStore;
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
