import type { NavItemConfig } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { NavItem } from "./navItem";
import type { Navigator } from "./navigator";

/**
 * 권한 체크 함수 타입
 */
export type AbilityChecker = (action: string, subject: string) => boolean;

export interface NavigationStoreOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: Navigator;
	/** 권한 체크 함수 */
	abilityChecker?: AbilityChecker;
	/**
	 * @deprecated navigator 사용을 권장합니다
	 */
	onNavigate?: (path: string) => void;
}

/**
 * NavigationStore - 네비게이션 시스템을 관리하는 MobX 스토어
 *
 * 역할:
 * - NavItem 트리 구조 관리
 * - 권한 기반 아이템 필터링
 * - 현재 경로 기반 활성 아이템 관리
 * - Navigator를 통한 페이지 이동
 *
 * @example
 * ```ts
 * import { ADMIN_NAV_CONFIG } from '@cocrepo/constant';
 *
 * const navigator = new Navigator({ router });
 * const navigationStore = new NavigationStore(ADMIN_NAV_CONFIG, {
 *   navigator,
 *   abilityChecker: (action, subject) => ability.can(action, subject),
 * });
 *
 * // 현재 경로 기반으로 활성 아이템 설정
 * navigationStore.setCurrentPath('/members/list');
 *
 * // 아이템 선택 (이동 포함)
 * navigationStore.selectNavItem('members');
 * ```
 */
export class NavigationStore {
	private readonly _items: NavItem[];
	private _selectedNavItem: NavItem | null = null;
	private _selectedSubNavItem: NavItem | null = null;
	private _abilityChecker: AbilityChecker | null = null;
	private _navigator: Navigator | null = null;
	private _onNavigate: ((path: string) => void) | null = null;
	private _expandedNavItemIds: Set<string> = new Set();
	private _currentPath: string = "";

	/**
	 * NavigationStore 생성
	 * @param navItems 네비게이션 아이템 설정 배열
	 * @param options 옵션
	 */
	constructor(navItems: NavItemConfig[], options?: NavigationStoreOptions) {
		this._items = navItems.map((config) => new NavItem(config));
		this._navigator = options?.navigator ?? null;
		this._abilityChecker = options?.abilityChecker ?? null;
		this._onNavigate = options?.onNavigate ?? null;

		makeAutoObservable(this);
	}

	/**
	 * Navigator 설정
	 */
	setNavigator(navigator: Navigator): void {
		this._navigator = navigator;
	}

	/**
	 * 권한 체크 함수 설정
	 */
	setAbilityChecker(checker: AbilityChecker): void {
		this._abilityChecker = checker;
	}

	/**
	 * @deprecated navigator 사용을 권장합니다
	 */
	setNavigateHandler(handler: (path: string) => void): void {
		this._onNavigate = handler;
	}

	/**
	 * 전체 네비게이션 아이템 (필터링 없음)
	 */
	get allItems(): NavItem[] {
		return this._items;
	}

	/**
	 * 권한 필터링된 네비게이션 아이템
	 */
	get items(): NavItem[] {
		if (!this._abilityChecker) {
			return this._items;
		}

		return this._items
			.filter((navItem) => this._abilityChecker!("ACCESS", navItem.subject))
			.map((navItem) => {
				const filteredChildren = navItem.children.filter((child) =>
					this._abilityChecker!("ACCESS", child.subject),
				);

				return {
					...navItem,
					children: filteredChildren,
					hasChildren: filteredChildren.length > 0,
				} as NavItem;
			})
			.filter(
				(navItem) =>
					!navItem.hasChildren ||
					(navItem.children && navItem.children.length > 0),
			);
	}

	/**
	 * 현재 선택된 주요 아이템
	 */
	get selectedNavItem(): NavItem | null {
		return this._selectedNavItem;
	}

	/**
	 * 현재 선택된 하위 아이템
	 */
	get selectedSubNavItem(): NavItem | null {
		return this._selectedSubNavItem;
	}

	/**
	 * 선택된 주요 아이템의 하위 아이템 목록
	 */
	get subNavItems(): NavItem[] {
		if (!this._selectedNavItem) return [];

		if (this._abilityChecker) {
			return this._selectedNavItem.children.filter((child) =>
				this._abilityChecker!("ACCESS", child.subject),
			);
		}

		return this._selectedNavItem.children;
	}

	/**
	 * 펼쳐진 아이템 ID 목록
	 */
	get expandedNavItemIds(): Set<string> {
		return this._expandedNavItemIds;
	}

	/**
	 * 현재 경로
	 */
	get currentPath(): string {
		return this._currentPath;
	}

	/**
	 * 아이템 펼침/접힘 토글
	 */
	toggleNavItem(navItemId: string): void {
		if (this._expandedNavItemIds.has(navItemId)) {
			this._expandedNavItemIds.delete(navItemId);
		} else {
			this._expandedNavItemIds.add(navItemId);
		}
	}

	/**
	 * 아이템이 펼쳐진 상태인지 확인
	 */
	isNavItemExpanded(navItemId: string): boolean {
		return this._expandedNavItemIds.has(navItemId);
	}

	/**
	 * 특정 아이템 펼치기
	 */
	expandNavItem(navItemId: string): void {
		this._expandedNavItemIds.add(navItemId);
	}

	/**
	 * 특정 아이템 접기
	 */
	collapseNavItem(navItemId: string): void {
		this._expandedNavItemIds.delete(navItemId);
	}

	/**
	 * 현재 경로를 기반으로 아이템 활성화 상태 설정
	 */
	setCurrentPath(path: string): void {
		if (this._currentPath === path) {
			return;
		}
		this._currentPath = path;

		this.resetAllActive();

		for (const navItem of this._items) {
			const matchedChild = navItem.findChildByPath(path);

			if (matchedChild) {
				navItem.setActive(true);
				matchedChild.setActive(true);
				this._selectedNavItem = navItem;
				this._selectedSubNavItem = matchedChild;
				// Note: expandedNavItemIds는 여기서 변경하지 않음
				// 펼침 상태는 사용자 토글 또는 아이템 선택 시에만 변경
				return;
			}

			// 직접 경로 매칭 (children 없는 경우)
			if (navItem.path && path.startsWith(navItem.path)) {
				navItem.setActive(true);
				this._selectedNavItem = navItem;
				this._selectedSubNavItem = null;
				return;
			}
		}

		this._selectedNavItem = null;
		this._selectedSubNavItem = null;
	}

	/**
	 * 주요 아이템 선택
	 */
	selectNavItem(navItemId: string): void {
		const navItem = this.findNavItemById(navItemId);
		if (!navItem) return;

		this.resetAllActive();
		navItem.setActive(true);
		this._selectedNavItem = navItem;
		this._expandedNavItemIds.add(navItem.id);

		const firstPath = navItem.firstChildPath;
		if (firstPath) {
			const firstChild = navItem.children[0];
			if (firstChild) {
				firstChild.setActive(true);
				this._selectedSubNavItem = firstChild;
			}
			this._currentPath = firstPath;
			this.navigate(firstPath);
		}
	}

	/**
	 * 하위 아이템 선택
	 */
	selectSubNavItem(subNavItemId: string): void {
		let parentNavItem: NavItem | undefined;
		let subNavItem: NavItem | undefined;

		// 전체 아이템에서 subNavItemId를 찾음
		for (const navItem of this._items) {
			subNavItem = navItem.findChildById(subNavItemId);
			if (subNavItem) {
				parentNavItem = navItem;
				break;
			}
		}

		if (!parentNavItem || !subNavItem) return;

		this.resetAllActive();

		parentNavItem.setActive(true);
		this._selectedNavItem = parentNavItem;
		this._expandedNavItemIds.add(parentNavItem.id);

		subNavItem.setActive(true);
		this._selectedSubNavItem = subNavItem;

		if (subNavItem.path) {
			this._currentPath = subNavItem.path;
			this.navigate(subNavItem.path);
		}
	}

	/**
	 * 경로로 직접 이동
	 */
	navigateTo(path: string): void {
		this.navigate(path);
	}

	/**
	 * ID로 아이템 찾기
	 */
	findNavItemById(navItemId: string): NavItem | undefined {
		return this._items.find((navItem) => navItem.id === navItemId);
	}

	/**
	 * ID로 하위 아이템 찾기
	 */
	findSubNavItemById(subNavItemId: string): NavItem | undefined {
		for (const navItem of this._items) {
			const subNavItem = navItem.findChildById(subNavItemId);
			if (subNavItem) return subNavItem;
		}
		return undefined;
	}

	/**
	 * 경로로 아이템 찾기
	 */
	findNavItemByPath(path: string): NavItem | undefined {
		for (const navItem of this._items) {
			if (navItem.path === path) return navItem;

			const child = navItem.findChildByPath(path);
			if (child) return child;
		}
		return undefined;
	}

	/**
	 * 내부 이동 메서드 - Navigator 또는 콜백 사용
	 */
	private navigate(path: string): void {
		if (this._navigator) {
			this._navigator.push(path);
		} else if (this._onNavigate) {
			this._onNavigate(path);
		}
	}

	/**
	 * 모든 아이템의 활성화 상태 초기화
	 */
	private resetAllActive(): void {
		for (const navItem of this._items) {
			navItem.setActive(false);
			navItem.resetChildrenActive();
		}
	}
}
