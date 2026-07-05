import { makeAutoObservable } from "mobx";
import { Ability } from "./ability";
import { Cookies } from "./cookies";
import { FloatingActions } from "./floatingActions";
import { Locale } from "./locale";
import { MobileNavigation } from "./mobileNavigation";
import { Navigation } from "./navigation";
import type { Navigator } from "./navigator";
import { Session } from "./session";
import { Space } from "./space";
import { Tokens } from "./tokens";

export class TopBarUi {
	constructor(private readonly app: AppStore) {}

	get navigation(): Navigation | undefined {
		return this.app.navigation;
	}

	get space(): Space | undefined {
		return this.app.space;
	}

	get locale(): Locale | undefined {
		return this.app.locale;
	}
}

export class HeaderUi {
	readonly topBar: TopBarUi;

	constructor(app: AppStore) {
		this.topBar = new TopBarUi(app);
	}
}

export class SideNavigationUi {
	constructor(private readonly app: AppStore) {}

	private get navigation(): Navigation {
		const navigation = this.app.navigation;
		if (!navigation) {
			throw new Error("navigation이 초기화되지 않았습니다.");
		}
		return navigation;
	}

	get items(): Navigation["items"] {
		return this.navigation.items;
	}

	get selectedItem(): Navigation["selectedNavItem"] {
		return this.navigation.selectedNavItem;
	}

	get selectedSubItem(): Navigation["selectedSubNavItem"] {
		return this.navigation.selectedSubNavItem;
	}

	get expandedItemIds(): Navigation["expandedNavItemIds"] {
		return this.navigation.expandedNavItemIds;
	}

	selectItem(itemId: string): void {
		this.navigation.selectNavItem(itemId);
	}

	selectSubItem(subItemId: string): void {
		this.navigation.selectSubNavItem(subItemId);
	}

	toggleItem(itemId: string): void {
		this.navigation.toggleNavItem(itemId);
	}
}

export class LeftAsideUi {
	readonly sideNavigation: SideNavigationUi;

	constructor(app: AppStore) {
		this.sideNavigation = new SideNavigationUi(app);
	}
}

export class MainUi {}

export class BodyUi {
	readonly leftAside: LeftAsideUi;
	readonly main = new MainUi();

	constructor(app: AppStore) {
		this.leftAside = new LeftAsideUi(app);
	}
}

export class MobileBottomNavigationUi {
	constructor(private readonly app: AppStore) {}

	private get bottomTab(): MobileNavigation {
		const bottomTab = this.app.mobileNavigation;
		if (!bottomTab) {
			throw new Error("mobileBottomNavigation이 초기화되지 않았습니다.");
		}
		return bottomTab;
	}

	get items(): MobileNavigation["tabItems"] {
		return this.bottomTab.tabItems;
	}

	get activeItemId(): MobileNavigation["activeTabId"] {
		return this.bottomTab.activeTabId;
	}

	selectItem(itemId: string): void {
		this.bottomTab.selectTab(itemId);
	}

	updateActiveItemFromPath(path: string): void {
		this.bottomTab.updateActiveTabFromPath(path);
	}
}

export class MobileMenuUi {
	constructor(private readonly app: AppStore) {}

	private get bottomTab(): MobileNavigation {
		const bottomTab = this.app.mobileNavigation;
		if (!bottomTab) {
			throw new Error("mobileMenu가 초기화되지 않았습니다.");
		}
		return bottomTab;
	}

	get isOpen(): boolean {
		return this.bottomTab.isSubMenuOpen;
	}

	get title(): string {
		return this.bottomTab.subMenuTitle;
	}

	get items(): MobileNavigation["subMenuItems"] {
		return this.bottomTab.subMenuItems;
	}

	close(): void {
		this.bottomTab.closeSubMenu();
	}
}

export class FloatingActionUi {
	constructor(private readonly app: AppStore) {}

	private get floatingAction(): FloatingActions {
		const floatingAction = this.app.floatingActions;
		if (!floatingAction) {
			throw new Error("floatingAction이 초기화되지 않았습니다.");
		}
		return floatingAction;
	}

	get isOpen(): boolean {
		return this.floatingAction.isOpen;
	}

	get actions(): FloatingActions["visibleActions"] {
		return this.floatingAction.visibleActions;
	}

	toggle(): void {
		this.floatingAction.toggle();
	}

	execute(actionId: string): void {
		this.floatingAction.executeAction(actionId);
	}
}

export class FooterUi {
	readonly mobileMenu: MobileMenuUi;
	readonly floatingAction: FloatingActionUi;
	readonly mobileBottomNavigation: MobileBottomNavigationUi;

	constructor(app: AppStore) {
		this.mobileMenu = new MobileMenuUi(app);
		this.floatingAction = new FloatingActionUi(app);
		this.mobileBottomNavigation = new MobileBottomNavigationUi(app);
	}
}

export class AppUi {
	readonly header: HeaderUi;
	readonly body: BodyUi;
	readonly footer: FooterUi;

	constructor(app: AppStore) {
		this.header = new HeaderUi(app);
		this.body = new BodyUi(app);
		this.footer = new FooterUi(app);
	}
}

/**
 * AppStore - 앱 전체 상태와 UI 상태를 묶는 최상위 컨테이너
 *
 * AppStore는 순수 컨테이너로, 내부에서 하위 상태 객체를 생성하지 않습니다.
 * 각 앱에서 필요한 상태 객체를 인스턴스화하여 주입합니다.
 *
 * @example
 * ```typescript
 * const app = new AppStore();
 * app.navigator = new Navigator({ router });
 * app.navigation = new Navigation(MENU_CONFIG, { navigator: app.navigator });
 *
 * app.floatingActions = new FloatingActions(FAB_CONFIG);
 * app.mobileNavigation = new MobileNavigation(BOTTOM_TAB_CONFIG, { navigation: app.navigation });
 *
 * ```
 *
 * App Tree 구조 (앱에 따라 다름):
 * AppStore
 * ├── navigator (Navigator) - 페이지 이동 담당
 * ├── navigation (Navigation) - 메뉴 및 네비게이션 관리
 * ├── session - 인증 상태
 * ├── space - 현재 space와 세션 저장 상태
 * ├── locale - 언어 상태
 * ├── ability - 권한 상태
 * └── ui - 실제 컴포넌트 생존 위치를 반영하는 UI 상태
 */
export class AppStore {
	name: string = "PROTOTYPE";
	readonly ui: AppUi;

	// 각 상태 객체는 외부에서 주입됨
	navigator?: Navigator;
	navigation?: Navigation;
	tokens?: Tokens;
	session?: Session;
	cookies?: Cookies;
	space?: Space;
	locale?: Locale;
	ability?: Ability;
	floatingActions?: FloatingActions;
	mobileNavigation?: MobileNavigation;

	constructor() {
		this.ui = new AppUi(this);
		makeAutoObservable<this, "ui">(this, {
			ui: false,
		});
	}
}
