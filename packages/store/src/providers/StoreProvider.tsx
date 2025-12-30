import { useRef } from "react";
import { RootStore, RootStoreContext } from "../stores";

interface StoreProviderProps {
	children: React.ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
	const { children } = props;
	// useRef로 Store 인스턴스 안정적 참조 유지 (useMemo/useState 대신)
	const storeRef = useRef<RootStore | null>(null);
	if (!storeRef.current) {
		storeRef.current = new RootStore();
	}

	return (
		<RootStoreContext.Provider value={storeRef.current}>
			{children}
		</RootStoreContext.Provider>
	);
};
