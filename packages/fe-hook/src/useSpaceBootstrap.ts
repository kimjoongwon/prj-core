"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import { usePersistStore } from "@cocrepo/store";
import type {
	SpaceBootstrapSpaceLike,
	UseSpaceBootstrapOptions,
	UseSpaceBootstrapReturn,
} from "@cocrepo/type";
import { useEffect } from "react";

export type {
	SpaceBootstrapSelection,
	SpaceBootstrapSpaceLike,
	SpaceBootstrapStoreLike,
	UseSpaceBootstrapOptions,
	UseSpaceBootstrapReturn,
} from "@cocrepo/type";

export function resolveCurrentSpaceGroundName(
	currentSpace: SpaceBootstrapSpaceLike | null | undefined,
	spaces: SpaceBootstrapSpaceLike[],
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

export function useSpaceBootstrap<
	TSpace extends SpaceBootstrapSpaceLike = SpaceBootstrapSpaceLike,
>(options: UseSpaceBootstrapOptions<TSpace>): UseSpaceBootstrapReturn<TSpace> {
	const {
		spaceStore,
		isHydrated,
		spaces: injectedSpaces,
		currentSpace = null,
		isCurrentSpaceFetched,
	} = options;
	const spaces = injectedSpaces ?? [];

	useEffect(() => {
		if (spaces.length === 0) {
			return;
		}

		spaceStore.setSpaces(
			spaces
				.filter((space) => space.id && space.tenantId && space.ground)
				.map((space) => ({
					tenantId: space.tenantId!,
					spaceId: space.id!,
					groundName: space.ground?.name ?? "",
					contentLanguageCode: space.contentLanguageCode ?? null,
				})),
		);
	}, [spaceStore, spaces]);

	useEffect(() => {
		if (!isHydrated || !isCurrentSpaceFetched) {
			return;
		}

		if (currentSpace?.id && currentSpace.tenantId) {
			spaceStore.setSpace(
				currentSpace.tenantId,
				resolveCurrentSpaceGroundName(currentSpace, spaces),
				currentSpace.contentLanguageCode ??
					spaces.find((space) => space.id === currentSpace.id)
						?.contentLanguageCode ??
					null,
				currentSpace.id,
			);
		} else {
			spaceStore.clearSpace();
		}

		spaceStore.setSpaceSelectionResolved(true);
	}, [currentSpace, isCurrentSpaceFetched, isHydrated, spaceStore, spaces]);

	return {
		spaces,
		currentSpace,
		isCurrentSpaceFetched,
		isSpaceBootstrapReady:
			isHydrated && spaceStore.isSpaceSelectionResolved === true,
	};
}

/**
 * 현재 앱 Store와 Space API를 연결해 Space 선택 상태를 bootstrap합니다.
 */
export function useSpaceBootstrapFromApi() {
	const persistStore = usePersistStore();
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

	return useSpaceBootstrap({
		spaceStore: persistStore,
		isHydrated,
		spaces: mySpacesResponse?.data,
		currentSpace: currentSpaceResponse?.data ?? null,
		isCurrentSpaceFetched,
	});
}
