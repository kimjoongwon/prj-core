import { makeAutoObservable } from "mobx";

/**
 * Menu - 개별 메뉴를 나타내는 MobX 도메인 객체
 *
 * 주의: Store 접미사를 사용하지 않습니다.
 * Menu는 MenuStore에 복수개 존재하는 엔티티이며,
 * 항상 MenuStore를 통해 접근합니다.
 *
 * @example
 * ```ts
 * // MenuStore를 통해 접근
 * const menuStore = new MenuStore(ADMIN_MENU_CONFIG);
 * const menu = menuStore.items[0];
 *
 * // 활성화 상태 확인
 * console.log(menu.active); // false
 *
 * // 활성화
 * menu.setActive(true);
 * console.log(menu.active); // true
 * ```
 */
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
   * @param config 메뉴 설정
   */
  constructor(config: Menu) {
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
      (child) => child.path && path.startsWith(child.path)
    );
  }
}
