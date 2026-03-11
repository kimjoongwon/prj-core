import type { AppIconName } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import type { NavItem } from "./navItem";
import type { NavigationStore } from "./navigationStore";

/**
 * BottomTab 아이템 인터페이스
 */
export interface BottomTabItem {
	id: string;
	label: string;
	icon: AppIconName;
	/** SubMenuList 표시 여부 (children이 있는 경우) */
	hasSubMenu: boolean;
}

/**
 * BottomTab 설정
 */
export interface BottomTabConfig {
	/** BottomTab에 표시할 1depth 메뉴 ID 목록 (순서대로) */
	tabIds: string[];
	/** "더보기" 탭 ID */
	moreTabId?: string;
}

/**
 * BottomTabStore - 모바일 하단 탭 상태 관리
 *
 * 역할:
 * - BottomTab 활성 상태 관리
 * - SubMenuList 열림/닫힘 상태 관리
 * - NavigationStore와 연동하여 메뉴 데이터 제공
 *
 * @example
 * ```ts
 * const bottomTabStore = new BottomTabStore(
 *   { tabIds: ['dashboard', 'reservations', 'users', 'notifications', 'more'], moreTabId: 'more' },
 *   { navigationStore }
 * );
 *
 * bottomTabStore.selectTab('reservations'); // 탭 선택
 * bottomTabStore.closeSubMenu(); // SubMenuList 닫기
 * ```
 */
export class BottomTabStore {
	private readonly _tabIds: string[];
	private readonly _moreTabId: string;
	private _activeTabId: string | null = null;
	private _isSubMenuOpen: boolean = false;
	private _navigationStore: NavigationStore | null = null;

	constructor(
		config: BottomTabConfig,
		options?: { navigationStore?: NavigationStore },
	) {
		this._tabIds = config.tabIds;
		this._moreTabId = config.moreTabId ?? "more";
		this._navigationStore = options?.navigationStore ?? null;

		makeAutoObservable(this);
	}

	/**
	 * NavigationStore 설정
	 */
	setNavigationStore(store: NavigationStore): void {
		this._navigationStore = store;
	}

	/**
	 * 현재 활성 탭 ID
	 */
	get activeTabId(): string | null {
		return this._activeTabId;
	}

	/**
	 * SubMenuList 열림 상태
	 */
	get isSubMenuOpen(): boolean {
		return this._isSubMenuOpen;
	}

	/**
	 * BottomTab 아이템 목록
	 * NavigationStore의 items를 기반으로 BottomTabItem 형태로 변환
	 */
	get tabItems(): BottomTabItem[] {
		if (!this._navigationStore) {
			return [];
		}

		const items = this._navigationStore.items;
		const result: BottomTabItem[] = [];

		// tabIds 순서대로 아이템 추출
		for (const tabId of this._tabIds) {
			if (tabId === this._moreTabId) {
				// "더보기" 탭은 특수 처리
				result.push({
					id: this._moreTabId,
					label: "더보기",
					icon: "Ellipsis",
					hasSubMenu: true,
				});
			} else {
				const navItem = items.find((item) => item.id === tabId);
				if (navItem) {
					result.push({
						id: navItem.id,
						label: navItem.label,
						icon: navItem.icon ?? "Circle",
						hasSubMenu: navItem.hasChildren,
					});
				}
			}
		}

		return result;
	}

	/**
	 * "더보기" 메뉴 아이템 목록
	 * tabIds에 포함되지 않은 나머지 1depth 메뉴들
	 */
	get moreMenuItems(): NavItem[] {
		if (!this._navigationStore) {
			return [];
		}

		const items = this._navigationStore.items;
		const regularTabIds = this._tabIds.filter((id) => id !== this._moreTabId);

		return items.filter((item) => !regularTabIds.includes(item.id));
	}

	/**
	 * 현재 열린 서브메뉴의 NavItem
	 */
	get activeSubMenu(): NavItem | null {
		if (!this._isSubMenuOpen || !this._activeTabId || !this._navigationStore) {
			return null;
		}

		// "더보기" 탭인 경우 null 반환 (별도 처리 필요)
		if (this._activeTabId === this._moreTabId) {
			return null;
		}

		return (
			this._navigationStore.items.find(
				(item) => item.id === this._activeTabId,
			) ?? null
		);
	}

	/**
	 * 현재 열린 서브메뉴의 아이템 목록
	 */
	get subMenuItems(): NavItem[] {
		const activeSubMenu = this.activeSubMenu;
		if (!activeSubMenu) {
			// "더보기" 탭인 경우 moreMenuItems 반환
			if (this._activeTabId === this._moreTabId) {
				return this.moreMenuItems;
			}
			return [];
		}
		return activeSubMenu.children;
	}

	/**
	 * 현재 열린 서브메뉴의 제목
	 */
	get subMenuTitle(): string {
		if (this._activeTabId === this._moreTabId) {
			return "더보기";
		}
		return this.activeSubMenu?.label ?? "";
	}

	/**
	 * 탭 선택
	 * @param tabId 선택할 탭 ID
	 */
	selectTab(tabId: string): void {
		const tabItem = this.tabItems.find((item) => item.id === tabId);
		if (!tabItem) return;

		this._activeTabId = tabId;

		// SubMenu가 있는 탭인 경우 SubMenuList 열기
		if (tabItem.hasSubMenu) {
			this._isSubMenuOpen = true;
		} else {
			// SubMenu가 없는 탭인 경우 바로 이동
			this._isSubMenuOpen = false;
			if (this._navigationStore) {
				this._navigationStore.selectNavItem(tabId);
			}
		}
	}

	/**
	 * SubMenuList 열기
	 */
	openSubMenu(tabId: string): void {
		this._activeTabId = tabId;
		this._isSubMenuOpen = true;
	}

	/**
	 * SubMenuList 닫기
	 */
	closeSubMenu(): void {
		this._isSubMenuOpen = false;
	}

	/**
	 * 서브메뉴 아이템 선택
	 * @param subNavItemId 선택할 서브메뉴 아이템 ID
	 */
	selectSubMenuItem(subNavItemId: string): void {
		if (this._navigationStore) {
			this._navigationStore.selectSubNavItem(subNavItemId);
		}
		this.closeSubMenu();
	}

	/**
	 * 현재 경로 기반으로 활성 탭 업데이트
	 * @param _path 현재 경로 (향후 확장용)
	 */
	updateActiveTabFromPath(_path: string): void {
		if (!this._navigationStore) return;

		// 현재 선택된 NavItem 찾기
		const selectedNavItem = this._navigationStore.selectedNavItem;
		if (!selectedNavItem) {
			this._activeTabId = null;
			return;
		}

		// tabIds에 포함된 경우 해당 탭 활성화
		const regularTabIds = this._tabIds.filter((id) => id !== this._moreTabId);
		if (regularTabIds.includes(selectedNavItem.id)) {
			this._activeTabId = selectedNavItem.id;
		} else {
			// tabIds에 포함되지 않은 경우 "더보기" 탭 활성화
			this._activeTabId = this._moreTabId;
		}
	}
}
