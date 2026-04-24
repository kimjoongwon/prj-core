"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import { useSpaceBootstrap as useInjectedSpaceBootstrap } from "@cocrepo/hook";
import { usePersistStore } from "../stores/AppStoreProvider";

/**
 * admin 앱 Space bootstrap hook
 *
 * Space API query와 PersistStore selector는 admin 앱이 소유하고,
 * @cocrepo/hook의 useSpaceBootstrap에는 값과 Store-like sink만 주입합니다.
 */
export function useSpaceBootstrap() {
	const persistStore = usePersistStore();
	const isHydrated = persistStore.isHydrated === true;
	const { data: mySpacesResponse } = useGetMySpaces({
		query: {
			enabled: isHydrated,
		},
	});
	const {
		data: currentSpaceResponse,
		isFetched: isCurrentSpaceFetched,
	} = useGetCurrentSpace({
		query: {
			enabled: isHydrated,
		},
	});

	return useInjectedSpaceBootstrap({
		spaceStore: persistStore,
		isHydrated,
		spaces: mySpacesResponse?.data,
		currentSpace: currentSpaceResponse?.data ?? null,
		isCurrentSpaceFetched,
	});
}
