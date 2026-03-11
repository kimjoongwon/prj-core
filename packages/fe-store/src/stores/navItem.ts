import type { AppIconName, NavItemConfig, TabConfig } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

/**
 * NavItem - 네비게이션 아이템 클래스
 *
 * NavTreeItemData 인터페이스를 implements하여
 * Widget(NavTreePanel)에서 직접 사용 가능합니다.
 *
 * 역할:
 * - 네비게이션 항목의 데이터와 UI 상태 관리
 * - 활성화 상태 추적
 * - 하위 아이템 관리
 * - v7.0: 3depth 탭 관리
 *
 * @example
 * ```ts
 * const navItem = new NavItem({
 *   id: 'members',
 *   label: '회원',
 *   subject: 'Member',
 *   children: [
 *     {
 *       id: 'member-list',
 *       label: '회원 목록',
 *       path: '/members/list',
 *       subject: 'MemberList',
 *       tabs: [
 *         { id: 'all', label: '전체', href: '/members/list' },
 *         { id: 'active', label: '활성', href: '/members/list/active' },
 *       ],
 *     },
 *   ],
 * });
 * ```
 */
export class NavItem {
	readonly id: string;
	readonly label: string;
	readonly path: string | undefined;
	readonly icon: AppIconName | undefined;
	readonly subject: string;
	readonly children: NavItem[];
	/** v7.0 신규: 3depth 탭 목록 */
	readonly tabs: TabConfig[];
	private _active: boolean = false;

	/**
	 * 네비게이션 아이템 생성
	 * @param config 아이템 설정 데이터
	 */
	constructor(config: NavItemConfig) {
		this.id = config.id;
		this.label = config.label;
		this.path = config.path;
		this.icon = config.icon;
		this.subject = config.subject;
		this.children = config.children
			? config.children.map((child) => new NavItem(child))
			: [];
		this.tabs = config.tabs ?? [];

		makeAutoObservable(this);
	}

	/**
	 * 활성화 상태
	 */
	get active(): boolean {
		return this._active;
	}

	/**
	 * 활성화 상태 설정
	 */
	setActive(value: boolean): void {
		this._active = value;
	}

	/**
	 * 하위 아이템이 있는지 확인
	 */
	get hasChildren(): boolean {
		return this.children.length > 0;
	}

	/**
	 * 탭이 있는지 확인 (v7.0 신규)
	 */
	get hasTabs(): boolean {
		return this.tabs.length > 0;
	}

	/**
	 * 첫 번째 하위 아이템의 경로 반환
	 */
	get firstChildPath(): string | undefined {
		if (this.hasChildren) {
			return this.children[0].path;
		}
		return this.path;
	}

	/**
	 * 활성화된 하위 아이템 반환
	 */
	get activeChild(): NavItem | undefined {
		return this.children.find((child) => child.active);
	}

	/**
	 * 모든 하위 아이템의 활성화 상태 초기화
	 */
	resetChildrenActive(): void {
		for (const child of this.children) {
			child.setActive(false);
		}
	}

	/**
	 * ID로 하위 아이템 찾기
	 */
	findChildById(id: string): NavItem | undefined {
		return this.children.find((child) => child.id === id);
	}

	/**
	 * 경로로 하위 아이템 찾기
	 * 가장 구체적인 경로(가장 긴 매칭)를 우선 반환합니다.
	 * 경로 경계를 체크하여 /roles가 /rolesX를 매칭하지 않도록 합니다.
	 */
	findChildByPath(path: string): NavItem | undefined {
		let bestMatch: NavItem | undefined;
		let bestMatchLength = 0;

		for (const child of this.children) {
			if (!child.path) continue;

			// 경로 매칭 체크: 정확히 일치하거나, 경로 + '/'로 시작해야 함
			const isExactMatch = path === child.path;
			const isPrefixMatch = path.startsWith(child.path + "/");

			if (isExactMatch || isPrefixMatch) {
				if (child.path.length > bestMatchLength) {
					bestMatch = child;
					bestMatchLength = child.path.length;
				}
			}
		}

		return bestMatch;
	}

	/**
	 * 경로로 탭 찾기 (v7.0 신규)
	 */
	findTabByPath(path: string): TabConfig | undefined {
		return this.tabs.find((tab) => tab.href === path);
	}
}
