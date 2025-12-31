import { createContext, useContext } from "react";
import { RootStore } from "./Store";

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error("useStore must be used within a RootStoreProvider");
	}
	return store;
};
