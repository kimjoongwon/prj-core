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

/**
 * AIFormTemplateStore를 가져오는 selector hook
 * RootStore에서 aiFormTemplateStore만 선택하여 반환
 */
export const useAIFormTemplateStore = () => {
	const store = useStore();
	if (!store.aiFormTemplateStore) {
		throw new Error("aiFormTemplateStore가 초기화되지 않았습니다.");
	}
	return store.aiFormTemplateStore;
};

/**
 * InquiryStore를 가져오는 selector hook
 * RootStore에서 inquiryStore만 선택하여 반환
 */
export const useInquiryStore = () => {
	const store = useStore();
	if (!store.inquiryStore) {
		throw new Error("inquiryStore가 초기화되지 않았습니다.");
	}
	return store.inquiryStore;
};
