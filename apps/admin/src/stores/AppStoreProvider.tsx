"use client";

import { setApiPersistStore } from "@cocrepo/api";
import { ADMIN_MENUS } from "@cocrepo/constant";
import { type AbilityActions, useAbility } from "@cocrepo/hook";
import {
	AuthStore,
	CookieStore,
	createStoreContext,
	createStoreSelector,
	MenuStore,
	PersistStore,
	RootStore,
	RootStoreContext,
	TokenStore,
} from "@cocrepo/store";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

/**
 * 앱용 RootStore 생성 함수
 *
 * RootStore를 생성하고 앱에 필요한 Store들을 주입합니다.
 */
function createRootStore(): RootStore {
	const rootStore = new RootStore();

	// 각 Store를 인스턴스화하여 RootStore에 주입
	rootStore.tokenStore = new TokenStore(rootStore);
	rootStore.cookieStore = new CookieStore();
	rootStore.authStore = new AuthStore(rootStore);
	rootStore.menuStore = new MenuStore(ADMIN_MENUS);
	rootStore.persistStore = new PersistStore({
		storageKey: "admin-persist",
	});

	// API 인터셉터에 PersistStore 참조 주입 (x-space-id 헤더용)
	setApiPersistStore(rootStore.persistStore);

	return rootStore;
}

/**
 * 앱 전용 RootStore Context 생성
 * 제너릭을 활용하여 타입 안정성 확보
 */
const {
	StoreProvider: StoreProviderBase,
	useStore: useAppStore,
	StoreContext: AppStoreContext,
} = createStoreContext<RootStore>("AppStore");

/**
 * MenuStore selector hook
 * RootStore에서 menuStore만 선택하여 반환
 */
const useMenuStore = createStoreSelector(useAppStore, (store) => {
	if (!store.menuStore) {
		throw new Error("menuStore가 초기화되지 않았습니다.");
	}
	return store.menuStore;
});

/**
 * PersistStore selector hook
 * RootStore에서 persistStore만 선택하여 반환
 */
const usePersistStore = createStoreSelector(useAppStore, (store) => {
	if (!store.persistStore) {
		throw new Error("persistStore가 초기화되지 않았습니다.");
	}
	return store.persistStore;
});

interface AppStoreProviderProps {
	children: ReactNode;
}

/**
 * App Store Provider
 *
 * RootStore를 최상단에서 초기화하고 하위 컴포넌트에 제공합니다.
 * Router, Pathname, Ability 변경 시 MenuStore의 핸들러를 자동 업데이트합니다.
 *
 * RootStoreContext도 함께 제공하여 @cocrepo/ui의 Feature 컴포넌트가
 * @cocrepo/store의 hooks를 사용할 수 있도록 합니다.
 *
 * @example
 * ```tsx
 * // providers.tsx에서 사용
 * <AppStoreProvider>
 *   {children}
 * </AppStoreProvider>
 *
 * // 컴포넌트에서 사용
 * const store = useAppStore(); // RootStore 타입
 * const menuStore = useMenuStore(); // MenuStore 타입
 * const persistStore = usePersistStore(); // PersistStore 타입
 * ```
 */
function AppStoreProvider({ children }: AppStoreProviderProps) {
	return (
		<StoreProviderBase createStore={createRootStore}>
			<RootStoreContextBridge>{children}</RootStoreContextBridge>
		</StoreProviderBase>
	);
}

/**
 * RootStoreContext Bridge
 * AppStoreContext의 store를 RootStoreContext에도 제공하여
 * @cocrepo/store의 hooks (useMenuStore, usePersistStore 등)가
 * Feature 컴포넌트에서 사용 가능하도록 합니다.
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
 * Store 초기화 컴포넌트
 * Provider 내부에서 hooks를 사용하여 Store를 초기화합니다.
 */
function StoreInitializer({ children }: { children: ReactNode }) {
	const store = useAppStore();
	const router = useRouter();
	const pathname = usePathname();
	const ability = useAbility();

	const menuStore = store.menuStore;

	// menuStore가 없으면 초기화 중이므로 렌더링하지 않음
	if (!menuStore) {
		return null;
	}

	// ability 변경 시 체커 업데이트
	useEffect(() => {
		menuStore.setAbilityChecker((action, subject) =>
			ability.can(action as AbilityActions, subject),
		);
	}, [ability, menuStore]);

	// router 변경 시 네비게이션 핸들러 업데이트
	useEffect(() => {
		menuStore.setNavigateHandler((path) => router.push(path as never));
	}, [router, menuStore]);

	// URL 경로 변경 시 메뉴 활성화 상태 업데이트
	useEffect(() => {
		menuStore.setCurrentPath(pathname);
	}, [pathname, menuStore]);

	return children;
}

export {
	AppStoreContext,
	AppStoreProvider,
	useAppStore,
	useMenuStore,
	usePersistStore,
};
