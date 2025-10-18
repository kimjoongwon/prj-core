import { useState } from "react";
import { Store, StoreContext } from "../stores";

interface StoreProviderProps {
	children: React.ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
	const { children } = props;
	const [store] = useState(() => new Store());

	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	);
};
