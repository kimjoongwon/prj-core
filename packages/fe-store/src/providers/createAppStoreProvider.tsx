"use client";

import { setApiPersistStore } from "@cocrepo/api";
import type { AppStoreConfig, AppStoreProviderResult } from "@cocrepo/type";
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
import { NavigationStore } from "../stores/navigationStore";
import { Navigator } from "../stores/navigator";
import { PersistStore } from "../stores/persistStore";
import { RootStore } from "../stores/rootStore";
import { TokenStore } from "../stores/tokenStore";
import { useAbility } from "../stores/useAbility";
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

		// BottomTabStore, FABStore 추가
		rootStore.bottomTabStore = new BottomTabStore(
			{
				tabIds: [...config.bottomTabIds],
				moreTabId: config.moreTabId,
			},
			{ navigationStore: rootStore.navigationStore },
		);

		rootStore.fabStore = new FABStore({ actions: config.fabActions });

		// API 인터셉터에 PersistStore 참조 주입 (x-space-id 헤더용)
		setApiPersistStore(rootStore.persistStore);

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
	function StoreInitializer({ children }: { children: ReactNode }) {
		const store = useAppStore();
		const router = useRouter();
		const pathname = usePathname();
		const { can } = useAbility();

		const navigationStore = store.navigationStore;
		const bottomTabStore = store.bottomTabStore;
		const fabStore = store.fabStore;

		// navigationStore가 없으면 초기화 중이므로 렌더링하지 않음
		if (!navigationStore) {
			return null;
		}

		// ability 변경 시 체커 업데이트
		useEffect(() => {
			navigationStore.setAbilityChecker((action, subject) =>
				can(action, subject),
			);
			fabStore?.setAbilityChecker((action, subject) => can(action, subject));
		}, [can, navigationStore, fabStore]);

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
	}

	/**
	 * RootStoreContext Bridge
	 */
	function RootStoreContextBridge({ children }: { children: ReactNode }) {
		const store = useAppStore();

		return (
			<RootStoreContext.Provider value={store}>
				<StoreInitializer>{children}</StoreInitializer>
			</RootStoreContext.Provider>
		);
	}

	/**
	 * App Store Provider
	 */
	function AppStoreProvider({ children }: { children: ReactNode }) {
		const storeRef = useRef<RootStore | null>(null);
		if (!storeRef.current) {
			storeRef.current = createRootStore();
		}

		return (
			<AppStoreContext.Provider value={storeRef.current}>
				<RootStoreContextBridge>{children}</RootStoreContextBridge>
			</AppStoreContext.Provider>
		);
	}

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
