import { makeAutoObservable } from "mobx";

/**
 * 메뉴 설정 인터페이스 (생성자 파라미터용)
 */
export interface MenuConfig {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: MenuConfig[];
}

export class Menu {
	readonly id: string;
	readonly label: string;
	readonly path: string | undefined;
	readonly icon: string | undefined;
	readonly subject: string;
	readonly children: Menu[];
	private _active: boolean = false;

	/**
	 * 메뉴 생성
	 * @param config 메뉴 설정 데이터
	 */
	constructor(config: MenuConfig) {
		this.id = config.id;
		this.label = config.label;
		this.path = config.path;
		this.icon = config.icon;
		this.subject = config.subject;
		this.children = config.children
			? config.children.map((child) => new Menu(child))
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
	 * 하위 메뉴가 있는지 확인
	 */
	get hasChildren(): boolean {
		return this.children.length > 0;
	}

	/**
	 * 첫 번째 하위 메뉴의 경로 반환
	 */
	get firstChildPath(): string | undefined {
		if (this.hasChildren) {
			return this.children[0].path;
		}
		return this.path;
	}

	/**
	 * 활성화된 하위 메뉴 반환
	 */
	get activeChild(): Menu | undefined {
		return this.children.find((child) => child.active);
	}

	/**
	 * 모든 하위 메뉴의 활성화 상태 초기화
	 */
	resetChildrenActive(): void {
		for (const child of this.children) {
			child.setActive(false);
		}
	}

	/**
	 * ID로 하위 메뉴 찾기
	 */
	findChildById(id: string): Menu | undefined {
		return this.children.find((child) => child.id === id);
	}

	/**
	 * 경로로 하위 메뉴 찾기
	 */
	findChildByPath(path: string): Menu | undefined {
		return this.children.find(
			(child) => child.path && path.startsWith(child.path),
		);
	}
}
