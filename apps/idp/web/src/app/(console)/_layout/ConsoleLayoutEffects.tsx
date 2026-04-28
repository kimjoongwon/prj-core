"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import {
	createUseSpaceGuard,
	useSpaceBootstrap as useInjectedSpaceBootstrap,
} from "@cocrepo/hook";
import { useConsolePersistStore } from "@cocrepo/store";
import { SpaceAlert } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

const useConsoleSpaceGuard = createUseSpaceGuard({
	usePersistStore: useConsolePersistStore,
});

function useConsoleSpaceBootstrap() {
	const persistStore = useConsolePersistStore();
	const isHydrated = persistStore.isHydrated === true;
	const { data: mySpacesResponse } = useGetMySpaces({
		query: {
			enabled: isHydrated,
		},
	});
	const { data: currentSpaceResponse, isFetched: isCurrentSpaceFetched } =
		useGetCurrentSpace({
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

export const ConsoleLayoutEffects = observer(function ConsoleLayoutEffects() {
	useConsoleSpaceBootstrap();
	const { showAlert, handleConfirm, handleDismiss } = useConsoleSpaceGuard();

	if (!showAlert) {
		return null;
	}

	return <SpaceAlert onConfirm={handleConfirm} onDismiss={handleDismiss} />;
});
