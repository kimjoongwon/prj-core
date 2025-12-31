"use client";

import { createContext, useContext } from "react";
import { RootStore } from "./Store";

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
 * MenuStore를 가져오는 selector hook
 * RootStore에서 menuStore만 선택하여 반환
 */
export const useMenuStore = () => {
	const store = useStore();
	if (!store.menuStore) {
		throw new Error("menuStore가 초기화되지 않았습니다.");
	}
	return store.menuStore;
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
