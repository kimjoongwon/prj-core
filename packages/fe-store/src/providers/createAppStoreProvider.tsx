"use client";

import {
	setApiLocaleStore,
	setApiPersistStore,
} from "@cocrepo/api/core/client";
import {
	setIdpLocaleStore,
	setIdpPersistStore,
} from "@cocrepo/api/idp/client";
import type { AppStoreConfig, AppStoreProviderResult } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from "react";
import { AbilityStore } from "../stores/abilityStore";
import { AuthStore } from "../stores/authStore";
import { BottomTabStore } from "../stores/bottomTabStore";
import { CookieStore } from "../stores/cookieStore";
import { FABStore } from "../stores/fabStore";
import { LocaleStore } from "../stores/localeStore";
import { NavigationStore } from "../stores/navigationStore";
import { Navigator } from "../stores/navigator";
import { PersistStore } from "../stores/persistStore";
import { RootStore } from "../stores/rootStore";
import { TokenStore } from "../stores/tokenStore";
import { RootStoreContext } from "../stores/useStore";

export type { AppStoreConfig, AppStoreProviderResult } from "@cocrepo/type";

/**
 * createAppStoreProvider - 앱별 Store Provider 팩토리
 *
 * 앱별 설정(navItems, fabActions 등)을 주입받아
 * Provider와 selector hooks를 생성합니다.
 *
 * @example
 * ```tsx
 * // apps/admin/src/stores/AppStoreProvider.tsx
 * import { ADMIN_FAB_ACTIONS, ADMIN_NAV_ITEMS, BOTTOM_TAB_IDS } from "@cocrepo/constant";
 * import { createAppStoreProvider } from "@cocrepo/store";
 *
 * export const {
 *   AppStoreContext,
 *   AppStoreProvider,
 *   useAppStore,
 *   useNavigationStore,
 *   usePersistStore,
 *   useBottomTabStore,
 *   useFABStore,
 * } = createAppStoreProvider({
 *   navItems: ADMIN_NAV_ITEMS,
 *   bottomTabIds: BOTTOM_TAB_IDS,
 *   moreTabId: "more",
 *   fabActions: ADMIN_FAB_ACTIONS,
 *   persistStorageKey: "admin-persist",
 * });
 * ```
 */
export function createAppStoreProvider(
	config: AppStoreConfig,
): AppStoreProviderResult<
	RootStore,
	NavigationStore,
	PersistStore,
	BottomTabStore,
	FABStore
> {
	const AppStoreContext = createContext<RootStore | null>(null);
	AppStoreContext.displayName = "AppStoreContext";

	/**
	 * RootStore 생성 함수
	 */
	function createRootStore(): RootStore {
		const rootStore = new RootStore();

		// 각 Store를 인스턴스화하여 RootStore에 주입
		rootStore.tokenStore = new TokenStore(rootStore);
		rootStore.cookieStore = new CookieStore();
		rootStore.authStore = new AuthStore(rootStore);
		rootStore.abilityStore = new AbilityStore(rootStore);
		rootStore.navigationStore = new NavigationStore(config.navItems);
		rootStore.persistStore = new PersistStore({
			storageKey: config.persistStorageKey,
		});
		rootStore.localeStore = new LocaleStore({
			storageKey: config.localeStorageKey ?? `${config.persistStorageKey}:locale`,
		});

		// BottomTabStore, FABStore 추가
		rootStore.bottomTabStore = new BottomTabStore(
			{
				tabIds: [...config.bottomTabIds],
				moreTabId: config.moreTabId,
			},
			{ navigationStore: rootStore.navigationStore },
		);

		rootStore.fabStore = new FABStore({ actions: config.fabActions });

		// Core/IDP API 인터셉터가 모두 동일한 현재 Space를 읽도록 연결합니다.
		setApiPersistStore(rootStore.persistStore);
		setIdpPersistStore(rootStore.persistStore);
		setApiLocaleStore(rootStore.localeStore);
		setIdpLocaleStore(rootStore.localeStore);

		return rootStore;
	}

	/**
	 * Store Hook
	 */
	function useAppStore(): RootStore {
		const store = useContext(AppStoreContext);
		if (!store) {
			throw new Error(
				"useAppStore는 AppStoreProvider 내부에서만 사용할 수 있습니다.",
			);
		}
		return store;
	}

	/**
	 * NavigationStore selector hook
	 */
	function useNavigationStore(): NavigationStore {
		const store = useAppStore();
		if (!store.navigationStore) {
			throw new Error("navigationStore가 초기화되지 않았습니다.");
		}
		return store.navigationStore;
	}

	/**
	 * PersistStore selector hook
	 */
	function usePersistStore(): PersistStore {
		const store = useAppStore();
		if (!store.persistStore) {
			throw new Error("persistStore가 초기화되지 않았습니다.");
		}
		return store.persistStore;
	}

	/**
	 * BottomTabStore selector hook
	 */
	function useBottomTabStore(): BottomTabStore {
		const store = useAppStore();
		if (!store.bottomTabStore) {
			throw new Error("bottomTabStore가 초기화되지 않았습니다.");
		}
		return store.bottomTabStore;
	}

	/**
	 * FABStore selector hook
	 */
	function useFABStore(): FABStore {
		const store = useAppStore();
		if (!store.fabStore) {
			throw new Error("fabStore가 초기화되지 않았습니다.");
		}
		return store.fabStore;
	}

	/**
	 * Store 초기화 컴포넌트
	 */
	const StoreInitializer = observer(function StoreInitializer({
		children,
	}: {
		children: ReactNode;
	}) {
		const store = useAppStore();
		const router = useRouter();
		const pathname = usePathname();

		const navigationStore = store.navigationStore;
		const bottomTabStore = store.bottomTabStore;
		const fabStore = store.fabStore;
		const abilityStore = store.abilityStore;
		const persistStore = store.persistStore;
		const localeStore = store.localeStore;

		// navigationStore가 없으면 초기화 중이므로 렌더링하지 않음
		if (!navigationStore) {
			return null;
		}

		// PersistStore hydrate는 첫 클라이언트 렌더 이후에만 수행하여
		// SSR/CSR 첫 렌더 트리를 동일하게 유지합니다.
		useEffect(() => {
			persistStore?.hydrateFromStorage();
		}, [persistStore]);

		useEffect(() => {
			localeStore?.hydrateFromStorage();
		}, [localeStore]);

		// ability 변경 시 체커 업데이트
		useEffect(() => {
			if (!abilityStore) {
				return;
			}

			navigationStore.setAbilityChecker((action, subject) =>
				abilityStore.can(action, subject),
			);
			fabStore?.setAbilityChecker((action, subject) =>
				abilityStore.can(action, subject),
			);
		}, [abilityStore, navigationStore, fabStore]);

		// router 변경 시 Navigator 설정
		useEffect(() => {
			const navigator = new Navigator({ router });
			navigationStore.setNavigator(navigator);
			fabStore?.setNavigator(navigator);
		}, [router, navigationStore, fabStore]);

		// URL 경로 변경 시 메뉴 활성화 상태 업데이트
		useEffect(() => {
			navigationStore.setCurrentPath(pathname);
			bottomTabStore?.updateActiveTabFromPath(pathname);
		}, [pathname, navigationStore, bottomTabStore]);

		return children;
	});

	/**
	 * RootStoreContext Bridge
	 */
	const RootStoreContextBridge = observer(function RootStoreContextBridge({
		children,
	}: {
		children: ReactNode;
	}) {
		const store = useAppStore();

		return (
			<RootStoreContext.Provider value={store}>
				<StoreInitializer>{children}</StoreInitializer>
			</RootStoreContext.Provider>
		);
	});

	/**
	 * App Store Provider
	 */
	const AppStoreProvider = observer(function AppStoreProvider({
		children,
	}: {
		children: ReactNode;
	}) {
		const storeRef = useRef<RootStore | null>(null);
		if (!storeRef.current) {
			storeRef.current = createRootStore();
		}

		return (
			<AppStoreContext.Provider value={storeRef.current}>
				<RootStoreContextBridge>{children}</RootStoreContextBridge>
			</AppStoreContext.Provider>
		);
	});

	return {
		AppStoreContext,
		AppStoreProvider,
		useAppStore,
		useNavigationStore,
		usePersistStore,
		useBottomTabStore,
		useFABStore,
	};
}
