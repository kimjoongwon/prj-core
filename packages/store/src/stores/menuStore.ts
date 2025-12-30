import { makeAutoObservable } from "mobx";
import { MenuItem } from "./menuItem";

/**
 * 권한 체크 함수 타입
 */
export type AbilityChecker = (action: string, subject: string) => boolean;

/**
 * MenuStore - 메뉴 시스템을 관리하는 MobX 스토어
 *
 * 기능:
 * - 메뉴 데이터 인스턴스화
 * - 권한 기반 메뉴 필터링
 * - 현재 경로 기반 활성 메뉴 관리
 * - 메뉴 선택/탐색
 *
 * @example
 * ```ts
 * import { ADMIN_MENU_CONFIG } from '@cocrepo/constant';
 *
 * const menuStore = new MenuStore(ADMIN_MENU_CONFIG, {
 *   abilityChecker: (action, subject) => ability.can(action, subject),
 *   onNavigate: (path) => router.push(path),
 * });
 *
 * // 현재 경로 기반으로 활성 메뉴 설정
 * menuStore.setCurrentPath('/members');
 *
 * // 활성 메뉴 확인
 * console.log(menuStore.selectedMenu?.label); // '회원'
 * console.log(menuStore.selectedSubMenu?.label); // '회원 목록'
 * ```
 */
export class MenuStore {
  private readonly _items: MenuItem[];
  private _selectedMenu: MenuItem | null = null;
  private _selectedSubMenu: MenuItem | null = null;
  private _abilityChecker: AbilityChecker | null = null;
  private _onNavigate: ((path: string) => void) | null = null;

  /**
   * MenuStore 생성
   * @param menuConfig 메뉴 설정 DTO 배열
   * @param options 옵션
   */
  constructor(
    menuConfig: MenuItem[],
    options?: {
      abilityChecker?: AbilityChecker;
      onNavigate?: (path: string) => void;
    }
  ) {
    this._items = menuConfig.map((dto) => new MenuItem(dto));
    this._abilityChecker = options?.abilityChecker ?? null;
    this._onNavigate = options?.onNavigate ?? null;

    makeAutoObservable(this);
  }

  /**
   * 권한 체크 함수 설정
   */
  setAbilityChecker(checker: AbilityChecker): void {
    this._abilityChecker = checker;
  }

  /**
   * 네비게이션 핸들러 설정
   */
  setNavigateHandler(handler: (path: string) => void): void {
    this._onNavigate = handler;
  }

  /**
   * 전체 메뉴 아이템 (필터링 없음)
   */
  get allItems(): MenuItem[] {
    return this._items;
  }

  /**
   * 권한 필터링된 메뉴 아이템
   */
  get items(): MenuItem[] {
    if (!this._abilityChecker) {
      return this._items;
    }

    return this._items
      .filter((menu) => this._abilityChecker!("ACCESS", menu.subject))
      .map((menu) => {
        // 필터링된 children을 가진 새로운 객체 반환 (원본 유지)
        const filteredChildren = menu.children.filter((child) =>
          this._abilityChecker!("ACCESS", child.subject)
        );

        // 원본 menu의 children 참조를 변경하지 않고, 필터링 결과만 반환
        return {
          ...menu,
          children: filteredChildren,
          hasChildren: filteredChildren.length > 0,
        } as MenuItem;
      })
      .filter(
        (menu) =>
          !menu.hasChildren || (menu.children && menu.children.length > 0)
      );
  }

  /**
   * 현재 선택된 주요 메뉴
   */
  get selectedMenu(): MenuItem | null {
    return this._selectedMenu;
  }

  /**
   * 현재 선택된 하위 메뉴
   */
  get selectedSubMenu(): MenuItem | null {
    return this._selectedSubMenu;
  }

  /**
   * 선택된 주요 메뉴의 하위 메뉴 목록
   */
  get subMenuItems(): MenuItem[] {
    if (!this._selectedMenu) return [];

    // 권한 필터링 적용
    if (this._abilityChecker) {
      return this._selectedMenu.children.filter((child) =>
        this._abilityChecker!("ACCESS", child.subject)
      );
    }

    return this._selectedMenu.children;
  }

  /**
   * 현재 경로를 기반으로 메뉴 활성화 상태 설정
   */
  setCurrentPath(path: string): void {
    this.resetAllActive();

    for (const menu of this._items) {
      const matchedChild = menu.findChildByPath(path);

      if (matchedChild) {
        menu.setActive(true);
        matchedChild.setActive(true);
        this._selectedMenu = menu;
        this._selectedSubMenu = matchedChild;
        return;
      }

      // 직접 경로 매칭 (children 없는 경우)
      if (menu.path && path.startsWith(menu.path)) {
        menu.setActive(true);
        this._selectedMenu = menu;
        this._selectedSubMenu = null;
        return;
      }
    }

    this._selectedMenu = null;
    this._selectedSubMenu = null;
  }

  /**
   * 주요 메뉴 선택
   */
  selectMenu(menuId: string): void {
    const menu = this.findMenuById(menuId);
    if (!menu) return;

    this.resetAllActive();
    menu.setActive(true);
    this._selectedMenu = menu;

    // 첫 번째 하위 메뉴로 이동
    const firstPath = menu.firstChildPath;
    if (firstPath && this._onNavigate) {
      const firstChild = menu.children[0];
      if (firstChild) {
        firstChild.setActive(true);
        this._selectedSubMenu = firstChild;
      }
      this._onNavigate(firstPath);
    }
  }

  /**
   * 하위 메뉴 선택
   */
  selectSubMenu(subMenuId: string): void {
    if (!this._selectedMenu) return;

    const subMenu = this._selectedMenu.findChildById(subMenuId);
    if (!subMenu) return;

    this._selectedMenu.resetChildrenActive();
    subMenu.setActive(true);
    this._selectedSubMenu = subMenu;

    if (subMenu.path && this._onNavigate) {
      this._onNavigate(subMenu.path);
    }
  }

  /**
   * 경로로 직접 이동
   */
  navigateTo(path: string): void {
    if (this._onNavigate) {
      this._onNavigate(path);
    }
  }

  /**
   * ID로 메뉴 찾기
   */
  findMenuById(menuId: string): MenuItem | undefined {
    return this._items.find((menu) => menu.id === menuId);
  }

  /**
   * ID로 하위 메뉴 찾기
   */
  findSubMenuById(subMenuId: string): MenuItem | undefined {
    for (const menu of this._items) {
      const subMenu = menu.findChildById(subMenuId);
      if (subMenu) return subMenu;
    }
    return undefined;
  }

  /**
   * 모든 메뉴의 활성화 상태 초기화
   */
  private resetAllActive(): void {
    for (const menu of this._items) {
      menu.setActive(false);
      menu.resetChildrenActive();
    }
  }
}
