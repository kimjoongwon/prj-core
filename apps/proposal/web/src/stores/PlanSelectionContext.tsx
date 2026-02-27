"use client";

import { observer } from "mobx-react-lite";
import { createContext, type ReactNode, useContext } from "react";
import { PlanSelectionStore } from "./planSelectionStore";

const PlanSelectionContext = createContext<PlanSelectionStore | null>(null);

interface PlanSelectionProviderProps {
	children: ReactNode;
	store: PlanSelectionStore;
}

/**
 * PlanSelectionStore Provider
 */
export const PlanSelectionProvider = observer(function PlanSelectionProvider({
	children,
	store,
}: PlanSelectionProviderProps) {
	return (
		<PlanSelectionContext.Provider value={store}>
			{children}
		</PlanSelectionContext.Provider>
	);
});

/**
 * PlanSelectionStore 훅
 */
export function usePlanSelectionStore(): PlanSelectionStore {
	const store = useContext(PlanSelectionContext);
	if (!store) {
		throw new Error(
			"usePlanSelectionStore는 PlanSelectionProvider 내에서 사용해야 합니다",
		);
	}
	return store;
}
