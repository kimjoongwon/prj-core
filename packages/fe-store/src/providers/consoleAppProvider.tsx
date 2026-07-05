import { IDP_BOTTOM_TAB_IDS, IDP_NAV_ITEMS } from "@cocrepo/constant";
import { createAppProvider } from "./createAppProvider";

export const consoleAppProvider = createAppProvider({
	navItems: IDP_NAV_ITEMS,
	bottomTabIds: [...IDP_BOTTOM_TAB_IDS],
	fabActions: [],
	persistStorageKey: "idp-persist",
});

export const {
	AppContext: ConsoleAppContext,
	AppProvider: ConsoleAppProvider,
	useApp: useConsoleApp,
} = consoleAppProvider;
