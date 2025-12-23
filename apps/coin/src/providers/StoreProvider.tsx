"use client";

import { createContext, type ReactNode, useContext } from "react";
import { rootStore } from "@/stores";

const StoreContext = createContext(rootStore);

interface StoreProviderProps {
	children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
	return (
		<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
	);
}

export function useStores() {
	return useContext(StoreContext);
}

export function useWalletStore() {
	return useContext(StoreContext).wallet;
}

export function useSafeStore() {
	return useContext(StoreContext).safe;
}
