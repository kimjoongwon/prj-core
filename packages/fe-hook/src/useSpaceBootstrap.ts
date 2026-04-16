"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import { usePersistStore } from "@cocrepo/store";
import { useEffect } from "react";

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
	const spaces = mySpacesResponse?.data ?? [];

	useEffect(() => {
		if (spaces.length === 0) {
			return;
		}

		persistStore.setSpaces(
			spaces
				.filter((space) => space.ground)
				.map((space) => ({
					spaceId: space.id,
					groundName: space.ground!.name,
				})),
		);
	}, [persistStore, spaces]);

	useEffect(() => {
		if (!isHydrated || !isCurrentSpaceFetched) {
			return;
		}

		const currentSpace = currentSpaceResponse?.data;

		if (currentSpace?.id) {
			persistStore.setSpace(
				currentSpace.id,
				resolveCurrentSpaceGroundName(currentSpace, spaces),
			);
		} else {
			persistStore.clearSpace();
		}

		persistStore.setSpaceSelectionResolved(true);
	}, [
		currentSpaceResponse,
		isCurrentSpaceFetched,
		isHydrated,
		persistStore,
		spaces,
	]);

	return {
		spaces,
		currentSpace: currentSpaceResponse?.data ?? null,
		isCurrentSpaceFetched,
		isSpaceBootstrapReady: isHydrated && persistStore.isSpaceSelectionResolved,
	};
}
