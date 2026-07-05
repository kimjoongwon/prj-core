"use client";

import { createContext, useContext } from "react";
import { AppStore } from "./appStore";

export const AppContext = createContext<AppStore | null>(null);
export const AppStoreContext = AppContext;

/**
 * 앱 전역 상태 컨테이너를 가져오는 단일 hook
 */
export const useApp = () => {
	const app = useContext(AppContext);
	if (!app) {
		throw new Error("useApp must be used within AppProvider");
	}
	return app;
};
