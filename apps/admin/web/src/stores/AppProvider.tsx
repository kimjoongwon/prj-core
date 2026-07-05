import {
	ADMIN_FAB_ACTIONS,
	ADMIN_NAV_ITEMS,
	BOTTOM_TAB_IDS,
} from "@cocrepo/constant";
import { createAppProvider } from "@cocrepo/store";

export const { AppContext, AppProvider, useApp } = createAppProvider({
	navItems: ADMIN_NAV_ITEMS,
	bottomTabIds: BOTTOM_TAB_IDS,
	moreTabId: "more",
	fabActions: ADMIN_FAB_ACTIONS,
	persistStorageKey: "admin-persist",
});
