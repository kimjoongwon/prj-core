"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import { SpaceAlert } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useSpaceGuard } from "@/hooks";
import { usePersistStore } from "@/stores/AppStoreProvider";

type SpaceWithGroundLike = {
	id?: string;
	ground?: {
		name?: string | null;
	} | null;
};

export function resolveCurrentSpaceGroundName(
	currentSpace: SpaceWithGroundLike | null | undefined,
	spaces: SpaceWithGroundLike[],
) {
	if (!currentSpace?.id) {
		return "";
	}

	return (
		currentSpace.ground?.name ??
		spaces.find((space) => space.id === currentSpace.id)?.ground?.name ??
		""
	);
}

export const AdminLayoutEffects = observer(function AdminLayoutEffects() {
	const persistStore = usePersistStore();
	const { data: mySpacesResponse } = useGetMySpaces();
	const {
		data: currentSpaceResponse,
		isFetched: isCurrentSpaceFetched,
	} = useGetCurrentSpace();
	const { showAlert, handleConfirm, handleDismiss } = useSpaceGuard();
	const spaces = mySpacesResponse?.data ?? [];

	useEffect(() => {
		if (spaces.length === 0) {
			return;
		}

		const spaceInfoList: SpaceInfo[] = spaces
			.filter((space) => space.ground)
			.map((space) => ({
				spaceId: space.id,
				groundName: space.ground!.name,
			}));

		persistStore.setSpaces(spaceInfoList);
	}, [spaces, persistStore]);

	useEffect(() => {
		if (!isCurrentSpaceFetched) {
			return;
		}

		const currentSpace = currentSpaceResponse?.data;
		if (currentSpace?.id) {
			const resolvedGroundName = resolveCurrentSpaceGroundName(
				currentSpace,
				spaces,
			);
			persistStore.setSpace(currentSpace.id, resolvedGroundName);
		} else {
			persistStore.clearSpace();
		}
		persistStore.setSpaceSelectionResolved(true);
	}, [
		currentSpaceResponse,
		isCurrentSpaceFetched,
		spaces,
		persistStore,
	]);

	if (!showAlert) {
		return null;
	}

	return <SpaceAlert onConfirm={handleConfirm} onDismiss={handleDismiss} />;
});
