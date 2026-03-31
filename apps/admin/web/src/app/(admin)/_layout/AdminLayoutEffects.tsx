"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import { SpaceAlert } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useSpaceGuard } from "@/hooks";
import { usePersistStore } from "@/stores/AppStoreProvider";

export const AdminLayoutEffects = observer(function AdminLayoutEffects() {
	const persistStore = usePersistStore();
	const { data: mySpacesResponse } = useGetMySpaces();
	const {
		data: currentSpaceResponse,
		isFetched: isCurrentSpaceFetched,
	} = useGetCurrentSpace();
	const { showAlert, handleConfirm, handleDismiss } = useSpaceGuard();

	useEffect(() => {
		const spaces = mySpacesResponse?.data;
		if (!spaces || spaces.length === 0) {
			return;
		}

		const spaceInfoList: SpaceInfo[] = spaces
			.filter((space) => space.ground)
			.map((space) => ({
				spaceId: space.id,
				groundName: space.ground!.name,
			}));

		persistStore.setSpaces(spaceInfoList);
	}, [mySpacesResponse, persistStore]);

	useEffect(() => {
		if (!isCurrentSpaceFetched) {
			return;
		}

		const spaces = mySpacesResponse?.data ?? [];
		const currentSpace = currentSpaceResponse?.data;
		if (currentSpace?.id) {
			const resolvedGroundName =
				currentSpace.ground?.name ??
				spaces.find((space) => space.id === currentSpace.id)?.ground?.name ??
				"";
			persistStore.setSpace(currentSpace.id, resolvedGroundName);
		} else {
			persistStore.clearSpace();
		}
		persistStore.setSpaceSelectionResolved(true);
	}, [
		currentSpaceResponse,
		isCurrentSpaceFetched,
		mySpacesResponse,
		persistStore,
	]);

	if (!showAlert) {
		return null;
	}

	return <SpaceAlert onConfirm={handleConfirm} onDismiss={handleDismiss} />;
});
