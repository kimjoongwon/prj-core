"use client";

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
				.filter((space) => space.id && space.ground)
				.map((space) => ({
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

		if (currentSpace?.id) {
			spaceStore.setSpace(
				currentSpace.id,
				resolveCurrentSpaceGroundName(currentSpace, spaces),
				currentSpace.contentLanguageCode ??
					spaces.find((space) => space.id === currentSpace.id)
						?.contentLanguageCode ??
					null,
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
