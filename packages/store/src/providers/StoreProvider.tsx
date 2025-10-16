import { PlateStore, PlateStoreContext } from "../stores";
import { useState } from "react";

interface StoreProviderProps {
	children: React.ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
	const { children } = props;
	const [store] = useState(() => new PlateStore());

	return (
		<PlateStoreContext.Provider value={store}>
			{children}
		</PlateStoreContext.Provider>
	);
};
