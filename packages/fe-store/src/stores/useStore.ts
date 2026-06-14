"use client";

import { createContext, useContext } from "react";
import { RootStore } from "./rootStore";

export const RootStoreContext = createContext<RootStore | null>(null);

/**
 * RootStore를 가져오는 기본 hook
 */
export const useStore = () => {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error("useStore must be used within a RootStoreProvider");
	}
	return store;
};

/**
 * RootStore를 가져오는 hook (별칭)
 */
export const useRootStore = useStore;

/**
 * NavigationStore를 가져오는 selector hook
 * RootStore에서 navigationStore만 선택하여 반환
 */
export const useNavigationStore = () => {
	const store = useStore();
	if (!store.navigationStore) {
		throw new Error("navigationStore가 초기화되지 않았습니다.");
	}
	return store.navigationStore;
};

/**
 * PersistStore를 가져오는 selector hook
 * RootStore에서 persistStore만 선택하여 반환
 */
export const usePersistStore = () => {
	const store = useStore();
	if (!store.persistStore) {
		throw new Error("persistStore가 초기화되지 않았습니다.");
	}
	return store.persistStore;
};

/**
 * LocaleStore를 가져오는 selector hook
 * RootStore에서 localeStore만 선택하여 반환
 */
export const useLocaleStore = () => {
	const store = useStore();
	if (!store.localeStore) {
		throw new Error("localeStore가 초기화되지 않았습니다.");
	}
	return store.localeStore;
};

/**
 * BottomTabStore를 가져오는 selector hook
 * RootStore에서 bottomTabStore만 선택하여 반환
 */
export const useBottomTabStore = () => {
	const store = useStore();
	if (!store.bottomTabStore) {
		throw new Error("bottomTabStore가 초기화되지 않았습니다.");
	}
	return store.bottomTabStore;
};

/**
 * FABStore를 가져오는 selector hook
 * RootStore에서 fabStore만 선택하여 반환
 */
export const useFABStore = () => {
	const store = useStore();
	if (!store.fabStore) {
		throw new Error("fabStore가 초기화되지 않았습니다.");
	}
	return store.fabStore;
};

/**
 * AuthStore를 가져오는 selector hook
 * RootStore에서 authStore만 선택하여 반환
 */
export const useAuthStore = () => {
	const store = useStore();
	if (!store.authStore) {
		throw new Error("authStore가 초기화되지 않았습니다.");
	}
	return store.authStore;
};
