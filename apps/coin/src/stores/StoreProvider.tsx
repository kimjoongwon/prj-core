"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type RootStore, rootStore } from "./RootStore";

const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
	children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
	return (
		<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
	);
}

export function useStore(): RootStore {
	const store = useContext(StoreContext);
	if (!store) {
		throw new Error("useStore must be used within a StoreProvider");
	}
	return store;
}
