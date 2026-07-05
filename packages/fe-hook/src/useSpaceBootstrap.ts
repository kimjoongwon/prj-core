"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import { useApp } from "@cocrepo/store";
import type {
	SpaceBootstrapSpaceLike,
	UseSpaceBootstrapOptions,
	UseSpaceBootstrapReturn,
} from "@cocrepo/type";
import { useEffect } from "react";

export type {
	SpaceBootstrapScopeLike,
	SpaceBootstrapSelection,
	SpaceBootstrapSpaceLike,
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
		space,
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

		space.setSpaces(
			spaces
				.filter((space) => space.id && space.tenantId && space.ground)
				.map((space) => ({
					tenantId: space.tenantId!,
					spaceId: space.id!,
					groundName: space.ground?.name ?? "",
					contentLanguageCode: space.contentLanguageCode ?? null,
				})),
		);
	}, [space, spaces]);

	useEffect(() => {
		if (!isHydrated || !isCurrentSpaceFetched) {
			return;
		}

		if (currentSpace?.id && currentSpace.tenantId) {
			space.setSpace(
				currentSpace.tenantId,
				resolveCurrentSpaceGroundName(currentSpace, spaces),
				currentSpace.contentLanguageCode ??
					spaces.find((space) => space.id === currentSpace.id)
						?.contentLanguageCode ??
					null,
				currentSpace.id,
			);
		} else {
			space.clearSpace();
		}

		space.setSpaceSelectionResolved(true);
	}, [currentSpace, isCurrentSpaceFetched, isHydrated, space, spaces]);

	return {
		spaces,
		currentSpace,
		isCurrentSpaceFetched,
		isSpaceBootstrapReady:
			isHydrated && space.isSpaceSelectionResolved === true,
	};
}

/**
 * 현재 앱 space와 Space API를 연결해 Space 선택 상태를 bootstrap합니다.
 */
export function useSpaceBootstrapFromApi() {
	const app = useApp();
	const space = app.space;
	if (!space) {
		throw new Error("space가 초기화되지 않았습니다.");
	}
	const isHydrated = space.isHydrated === true;
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
		space: space,
		isHydrated,
		spaces: mySpacesResponse?.data,
		currentSpace: currentSpaceResponse?.data ?? null,
		isCurrentSpaceFetched,
	});
}
