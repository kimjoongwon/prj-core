import { makeAutoObservable } from "mobx";

/**
 * 네비게이션 아이템 설정 인터페이스 (생성자 파라미터용)
 */
export interface NavItemConfig {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: NavItemConfig[];
}

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
 *
 * @example
 * ```ts
 * const navItem = new NavItem({
 *   id: 'members',
 *   label: '회원',
 *   subject: 'Member',
 *   children: [
 *     { id: 'member-list', label: '회원 목록', path: '/members/list', subject: 'MemberList' },
 *   ],
 * });
 * ```
 */
export class NavItem {
	readonly id: string;
	readonly label: string;
	readonly path: string | undefined;
	readonly icon: string | undefined;
	readonly subject: string;
	readonly children: NavItem[];
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
	 */
	findChildByPath(path: string): NavItem | undefined {
		return this.children.find(
			(child) => child.path && path.startsWith(child.path),
		);
	}
}
