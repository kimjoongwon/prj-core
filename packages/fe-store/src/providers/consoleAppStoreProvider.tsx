"use client";

import { IDP_NAV_ITEMS } from "@cocrepo/constant";
import { createAppStoreProvider } from "./createAppStoreProvider";

export const consoleAppStoreProvider = createAppStoreProvider({
  navItems: IDP_NAV_ITEMS,
  bottomTabIds: [],
  fabActions: [],
  persistStorageKey: "idp-persist",
});

export const {
  AppStoreContext: ConsoleAppStoreContext,
  AppStoreProvider: ConsoleAppStoreProvider,
  useAppStore: useConsoleAppStore,
  useNavigationStore: useConsoleNavigationStore,
  usePersistStore: useConsolePersistStore,
  useBottomTabStore: useConsoleBottomTabStore,
  useFABStore: useConsoleFABStore,
} = consoleAppStoreProvider;
