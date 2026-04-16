"use client";

import { createUseSpaceGuard, useSpaceBootstrap } from "@cocrepo/hook";
import { useConsolePersistStore } from "@cocrepo/store";
import { SpaceAlert } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

const useConsoleSpaceGuard = createUseSpaceGuard({
	usePersistStore: useConsolePersistStore,
});

export const ConsoleLayoutEffects = observer(function ConsoleLayoutEffects() {
	useSpaceBootstrap();
	const { showAlert, handleConfirm, handleDismiss } = useConsoleSpaceGuard();

	if (!showAlert) {
		return null;
	}

	return <SpaceAlert onConfirm={handleConfirm} onDismiss={handleDismiss} />;
});
