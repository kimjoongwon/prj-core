"use client";

import { IDP_NAV_ITEMS } from "@cocrepo/constant";
import { createAppStoreProvider } from "@cocrepo/store";

export const {
	AppStoreContext,
	AppStoreProvider,
	useAppStore,
	useNavigationStore,
	usePersistStore,
	useBottomTabStore,
	useFABStore,
} = createAppStoreProvider({
	navItems: IDP_NAV_ITEMS,
	bottomTabIds: [],
	fabActions: [],
	persistStorageKey: "idp-persist",
});
