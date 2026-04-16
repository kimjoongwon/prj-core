"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { isScopeKindAccessible } from "@cocrepo/constant";
import { useSpaceBootstrap } from "@cocrepo/hook";
import { SpaceAlert } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useSpaceGuard } from "@/hooks";
import {
	useNavigationStore,
	usePersistStore,
} from "@/stores/AppStoreProvider";

export { resolveCurrentSpaceGroundName } from "@cocrepo/hook";

export const AdminLayoutEffects = observer(function AdminLayoutEffects() {
	useSpaceBootstrap();
	const persistStore = usePersistStore();
	const navigationStore = useNavigationStore();
	const { showAlert, handleConfirm, handleDismiss } = useSpaceGuard();
	const shouldVerifyCurrentTenant =
		persistStore.isHydrated && persistStore.isSpaceSelectionResolved;
	const { data: verifyTokenResponse } = useVerifyToken({
		query: {
			enabled: shouldVerifyCurrentTenant,
			retry: false,
			refetchOnWindowFocus: false,
		},
	});
	const hasFullAccessInCurrentTenant =
		verifyTokenResponse?.data?.hasFullAccess === true;

	useEffect(() => {
		navigationStore.setScopeChecker((scopeKind) =>
			isScopeKindAccessible(scopeKind, hasFullAccessInCurrentTenant),
		);

		return () => {
			navigationStore.setScopeChecker(null);
		};
	}, [hasFullAccessInCurrentTenant, navigationStore]);

	if (!showAlert) {
		return null;
	}

	return <SpaceAlert onConfirm={handleConfirm} onDismiss={handleDismiss} />;
});
