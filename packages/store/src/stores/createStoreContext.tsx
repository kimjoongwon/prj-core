"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";

/**
 * 제너릭 Store Context 생성 유틸리티
 *
 * 타입 안정성을 보장하면서 Store Provider와 Hook을 생성합니다.
 *
 * @example
 * ```tsx
 * class MyRootStore {
 *   menuStore: MenuStore;
 *   constructor() {
 *     this.menuStore = new MenuStore();
 *   }
 * }
 *
 * const { StoreProvider, useStore } = createStoreContext<MyRootStore>();
 *
 * // Provider에서 사용
 * <StoreProvider createStore={() => new MyRootStore()}>
 *   {children}
 * </StoreProvider>
 *
 * // Hook에서 사용 (완전한 타입 추론)
 * const store = useStore(); // MyRootStore 타입
 * store.menuStore // MenuStore 타입
 * ```
 */
export function createStoreContext<TStore>(displayName: string) {
	const StoreContext = createContext<TStore | null>(null);
	StoreContext.displayName = `${displayName}Context`;

	interface StoreProviderProps {
		children: ReactNode;
		createStore: () => TStore;
	}

	/**
	 * Store Provider 컴포넌트
	 * createStore 함수를 통해 Store 인스턴스를 생성하고 Context로 제공합니다.
	 */
	function StoreProvider({ children, createStore }: StoreProviderProps) {
		// useRef로 Store 인스턴스 안정적 참조 유지
		const storeRef = useRef<TStore | null>(null);
		if (!storeRef.current) {
			storeRef.current = createStore();
		}

		return (
			<StoreContext.Provider value={storeRef.current}>
				{children}
			</StoreContext.Provider>
		);
	}

	StoreProvider.displayName = `${displayName}Provider`;

	/**
	 * Store Hook
	 * Context에서 Store를 가져옵니다. Provider 외부에서 호출 시 에러를 던집니다.
	 */
	function useStore(): TStore {
		const store = useContext(StoreContext);
		if (!store) {
			throw new Error(
				`use${displayName}는 ${displayName}Provider 내부에서만 사용할 수 있습니다.`,
			);
		}
		return store;
	}

	return {
		StoreContext,
		StoreProvider,
		useStore,
	};
}

/**
 * Store의 특정 필드를 선택하는 selector hook 생성
 *
 * @example
 * ```tsx
 * const useMenuStore = createStoreSelector(useStore, (store) => store.menuStore);
 * const menuStore = useMenuStore(); // MenuStore 타입
 * ```
 */
export function createStoreSelector<TStore, TSelected>(
	useStore: () => TStore,
	selector: (store: TStore) => TSelected,
): () => TSelected {
	return () => {
		const store = useStore();
		return selector(store);
	};
}
