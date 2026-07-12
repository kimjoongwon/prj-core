"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/idp/auth";
import { useApp } from "@cocrepo/store";
import type {
	AccountBootstrapSpaceLike,
	UseAccountBootstrapOptions,
	UseAccountBootstrapReturn,
} from "@cocrepo/type";
import { useEffect } from "react";

export type {
	AccountBootstrapLike,
	AccountBootstrapSpaceLike,
	AccountTenantSelection,
	UseAccountBootstrapOptions,
	UseAccountBootstrapReturn,
} from "@cocrepo/type";

export function resolveCurrentSpaceGroundName(
	currentSpace: AccountBootstrapSpaceLike | null | undefined,
	spaces: AccountBootstrapSpaceLike[],
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

export function useTenantBootstrap<
	TSpace extends AccountBootstrapSpaceLike = AccountBootstrapSpaceLike,
>(
	options: UseAccountBootstrapOptions<TSpace>,
): UseAccountBootstrapReturn<TSpace> {
	const {
		account,
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

		account.setAvailableSpaces(
			spaces
				.filter((space) => space.id && space.tenantId && space.ground)
				.map((space) => ({
					tenantId: space.tenantId!,
					spaceId: space.id!,
					groundName: space.ground?.name ?? "",
					contentLanguageCode: space.contentLanguageCode ?? null,
				})),
		);
	}, [account, spaces]);

	useEffect(() => {
		if (!isHydrated || !isCurrentSpaceFetched) {
			return;
		}

		if (currentSpace?.id && currentSpace.tenantId) {
			account.setCurrentTenant(
				currentSpace.tenantId,
				resolveCurrentSpaceGroundName(currentSpace, spaces),
				currentSpace.contentLanguageCode ??
					spaces.find((space) => space.id === currentSpace.id)
						?.contentLanguageCode ??
					null,
				currentSpace.id,
			);
		} else {
			account.clearCurrentTenant();
		}

		account.setSelectionResolved(true);
	}, [account, currentSpace, isCurrentSpaceFetched, isHydrated, spaces]);

	return {
		spaces,
		currentSpace,
		isCurrentSpaceFetched,
		isAccountBootstrapReady: isHydrated && account.isSelectionResolved === true,
	};
}

/**
 * 현재 앱 tenant와 Space API를 연결해 tenant 선택 상태를 bootstrap합니다.
 */
export function useTenantBootstrapFromApi() {
	const app = useApp();
	const account = app.account;
	const { authSession } = account;
	const isHydrated =
		account.isHydrated === true && authSession.isHydrated === true;
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

	return useTenantBootstrap({
		account,
		isHydrated,
		spaces: mySpacesResponse?.data,
		currentSpace: currentSpaceResponse?.data ?? null,
		isCurrentSpaceFetched,
	});
}
