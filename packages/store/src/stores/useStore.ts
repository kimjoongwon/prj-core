import { createContext, useContext } from "react";
import { Store } from "./Store";

export const StoreContext = createContext<Store | null>(null);

export const useStore = () => {
	const store = useContext(StoreContext);
	if (!store) {
		throw new Error("usePlateStore must be used within a PlateStoreProvider");
	}
	return store;
};
