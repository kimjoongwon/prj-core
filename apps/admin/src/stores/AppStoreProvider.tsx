"use client";

import {
	ADMIN_FAB_ACTIONS,
	ADMIN_NAV_ITEMS,
	BOTTOM_TAB_IDS,
} from "@cocrepo/constant";
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
	navItems: ADMIN_NAV_ITEMS,
	bottomTabIds: BOTTOM_TAB_IDS,
	moreTabId: "more",
	fabActions: ADMIN_FAB_ACTIONS,
	persistStorageKey: "admin-persist",
});
