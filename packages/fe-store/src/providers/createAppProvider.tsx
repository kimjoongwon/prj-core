"use client";

import { setApiLocale, setApiSpace } from "@cocrepo/api/core/client";
import { setIdpLocale, setIdpSpace } from "@cocrepo/api/idp/client";
import type { AppProviderConfig, AppProviderResult } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from "react";
import { Ability } from "../stores/ability";
import { AppStore } from "../stores/appStore";
import { Cookies } from "../stores/cookies";
import { FloatingActions } from "../stores/floatingActions";
import { Locale } from "../stores/locale";
import { MobileNavigation } from "../stores/mobileNavigation";
import { Navigation } from "../stores/navigation";
import { Navigator } from "../stores/navigator";
import { Session } from "../stores/session";
import { Space } from "../stores/space";
import { Tokens } from "../stores/tokens";
import { AppStoreContext } from "../stores/useApp";

export type { AppProviderConfig, AppProviderResult } from "@cocrepo/type";

/**
 * createAppProvider - 앱별 Provider 팩토리
 *
 * 앱별 설정(navItems, fabActions 등)을 주입받아
 * Provider와 useApp hook을 생성합니다.
 *
 * @example
 * ```tsx
 * // apps/admin/src/stores/AppProvider.tsx
 * import { ADMIN_FAB_ACTIONS, ADMIN_NAV_ITEMS, BOTTOM_TAB_IDS } from "@cocrepo/constant";
 * import { createAppProvider } from "@cocrepo/store";
 *
 * export const {
 *   AppContext,
 *   AppProvider,
 *   useApp,
 * } = createAppProvider({
 *   navItems: ADMIN_NAV_ITEMS,
 *   bottomTabIds: BOTTOM_TAB_IDS,
 *   moreTabId: "more",
 *   fabActions: ADMIN_FAB_ACTIONS,
 *   persistStorageKey: "admin-persist",
 * });
 * ```
 */
export function createAppProvider(
	config: AppProviderConfig,
): AppProviderResult<AppStore> {
	const AppContext = createContext<AppStore | null>(null);
	AppContext.displayName = "AppContext";

	/**
	 * AppStore 생성 함수
	 */
	function createAppStore(): AppStore {
		const app = new AppStore();

		// 각 상태 객체를 인스턴스화하여 app에 주입합니다.
		app.tokens = new Tokens(app);
		app.cookies = new Cookies();
		app.session = new Session(app);
		app.ability = new Ability(app);
		app.navigation = new Navigation(config.navItems);
		app.space = new Space({
			storageKey: config.persistStorageKey,
		});
		app.locale = new Locale({
			storageKey:
				config.localeStorageKey ?? `${config.persistStorageKey}:locale`,
		});

		// MobileNavigation, FloatingActions 추가
		app.mobileNavigation = new MobileNavigation(
			{
				tabIds: [...config.bottomTabIds],
				moreTabId: config.moreTabId,
			},
			{ navigation: app.navigation },
		);

		app.floatingActions = new FloatingActions({ actions: config.fabActions });

		const space = app.space;
		const locale = app.locale;
		if (!space || !locale) {
			throw new Error("App 초기 상태가 올바르게 구성되지 않았습니다.");
		}

		// Core/IDP API 인터셉터가 모두 동일한 현재 Space를 읽도록 연결합니다.
		setApiSpace(space);
		setIdpSpace(space);
		setApiLocale(locale);
		setIdpLocale(locale);

		return app;
	}

	/**
	 * App Hook
	 */
	function useApp(): AppStore {
		const app = useContext(AppContext);
		if (!app) {
			throw new Error("useApp은 AppProvider 내부에서만 사용할 수 있습니다.");
		}
		return app;
	}

	/**
	 * App 초기화 컴포넌트
	 */
	const AppInitializer = observer(function AppInitializer({
		children,
	}: {
		children: ReactNode;
	}) {
		const app = useApp();
		const router = useRouter();
		const pathname = usePathname();

		const navigation = app.navigation;
		const mobileNavigation = app.mobileNavigation;
		const floatingActions = app.floatingActions;
		const ability = app.ability;
		const space = app.space;
		const locale = app.locale;

		// navigation이 없으면 초기화 중이므로 렌더링하지 않음
		if (!navigation) {
			return null;
		}

		// Space hydrate는 첫 클라이언트 렌더 이후에만 수행하여
		// SSR/CSR 첫 렌더 트리를 동일하게 유지합니다.
		useEffect(() => {
			space?.hydrateFromStorage();
		}, [space]);

		useEffect(() => {
			locale?.hydrateFromStorage();
		}, [locale]);

		useEffect(() => {
			if (!locale || typeof document === "undefined") {
				return;
			}

			document.documentElement.lang = locale.languageCode.replace("_", "-");
		}, [locale, locale?.languageCode]);

		// ability 변경 시 체커 업데이트
		useEffect(() => {
			if (!ability) {
				return;
			}

			navigation.setAbilityChecker((action, subject) =>
				ability.can(action, subject),
			);
			floatingActions?.setAbilityChecker((action, subject) =>
				ability.can(action, subject),
			);
		}, [ability, navigation, floatingActions]);

		// router 변경 시 Navigator 설정
		useEffect(() => {
			const navigator = new Navigator({ router });
			navigation.setNavigator(navigator);
			floatingActions?.setNavigator(navigator);
		}, [router, navigation, floatingActions]);

		// URL 경로 변경 시 메뉴 활성화 상태 업데이트
		useEffect(() => {
			navigation.setCurrentPath(pathname);
			mobileNavigation?.updateActiveTabFromPath(pathname);
		}, [pathname, navigation, mobileNavigation]);

		return children;
	});

	/**
	 * AppStoreContext Bridge
	 */
	const AppStoreContextBridge = observer(function AppStoreContextBridge({
		children,
	}: {
		children: ReactNode;
	}) {
		const app = useApp();

		return (
			<AppStoreContext.Provider value={app}>
				<AppInitializer>{children}</AppInitializer>
			</AppStoreContext.Provider>
		);
	});

	/**
	 * App Provider
	 */
	const AppProvider = observer(function AppProvider({
		children,
	}: {
		children: ReactNode;
	}) {
		const appRef = useRef<AppStore | null>(null);
		if (!appRef.current) {
			appRef.current = createAppStore();
		}

		return (
			<AppContext.Provider value={appRef.current}>
				<AppStoreContextBridge>{children}</AppStoreContextBridge>
			</AppContext.Provider>
		);
	});

	return {
		AppContext,
		AppProvider,
		useApp,
	};
}
