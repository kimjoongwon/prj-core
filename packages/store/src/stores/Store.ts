import { makeAutoObservable } from "mobx";
import type { AuthStore } from "./authStore";
import type { CookieStore } from "./cookieStore";
import type { MenuStore } from "./menuStore";
import type { NavigationStore } from "./navigationStore";
import type { TokenStore } from "./tokenStore";

/**
 * RootStore - 모든 하위 Store를 관리하는 최상위 Store
 *
 * RootStore는 순수 컨테이너로, 내부에서 Store를 생성하지 않습니다.
 * 각 앱에서 필요한 Store를 인스턴스화하여 주입합니다.
 *
 * @example
 * ```typescript
 * // 앱에서 Store 생성 및 주입
 * const rootStore = new RootStore();
 * rootStore.tokenStore = new TokenStore(rootStore);
 * rootStore.cookieStore = new CookieStore();
 * rootStore.authStore = new AuthStore(rootStore);
 * rootStore.menuStore = new MenuStore(MENU_CONFIG);
 * ```
 *
 * Store Tree 구조 (앱에 따라 다름):
 * RootStore
 * ├── tokenStore (TokenStore) - 토큰 관리
 * ├── cookieStore (CookieStore) - 쿠키 관리
 * ├── authStore (AuthStore) - 인증 상태 관리
 * ├── menuStore (MenuStore) - 메뉴 관리 (앱별)
 * └── navigation (NavigationStore) - 네비게이션 관리
 */
export class RootStore {
	name: string = "PROTOTYPE";

	// 각 Store는 외부에서 주입됨
	navigation?: NavigationStore;
	tokenStore?: TokenStore;
	authStore?: AuthStore;
	cookieStore?: CookieStore;
	menuStore?: MenuStore;

	constructor() {
		makeAutoObservable(this);
	}
}
