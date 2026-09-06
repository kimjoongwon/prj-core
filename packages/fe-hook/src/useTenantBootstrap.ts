"use client";

import { useGetCurrentSpace, useGetMySpaces } from "@cocrepo/api/core/auth";
import { useApp } from "@cocrepo/store";
import type {
	AccountBootstrapSpaceLike,
	UseAccountBootstrapOptions,
	UseAccountBootstrapReturn,
} from "@cocrepo/type";
import { useEffect, useMemo } from "react";
import { isSameWireId, isWireId, toWireId } from "./wire-id";

type UnknownRecord = Record<string, unknown>;

function toAccountBootstrapSpace(
	value: unknown,
): AccountBootstrapSpaceLike | null {
	if (!isRecord(value)) {
		return null;
	}

	const source = value as UnknownRecord;
	const contentLanguageCode = normalizeContentLanguageCode(
		source.contentLanguageCode,
	);
	const fitnessCenter = normalizeFitnessCenter(source.fitnessCenter);
	const id = toWireId(source.id);
	const tenantId = toWireId(source.tenantId);

	return {
		id: id ?? undefined,
		tenantId: tenantId ?? undefined,
		contentLanguageCode,
		fitnessCenter,
	};
}

export function normalizeAccountBootstrapSpaces(
	spaces: unknown,
): AccountBootstrapSpaceLike[] {
	if (!Array.isArray(spaces)) {
		return [];
	}

	return spaces
		.map(toAccountBootstrapSpace)
		.filter((space): space is AccountBootstrapSpaceLike => {
			return space !== null;
		});
}

function normalizeContentLanguageCode(
	value: unknown,
): string | null | undefined {
	if (typeof value === "string") {
		return value;
	}

	if (value === null) {
		return null;
	}

	return undefined;
}

function normalizeFitnessCenter(
	value: unknown,
): AccountBootstrapSpaceLike["fitnessCenter"] {
	if (!isRecord(value)) {
		return value === null ? null : undefined;
	}

	const source = value as UnknownRecord;
	const company = normalizeCompany(source.company);

	return {
		name: typeof source.name === "string" ? source.name : null,
		company,
	};
}

function normalizeCompany(value: unknown):
	| {
			name?: string | null;
	  }
	| null
	| undefined {
	if (!isRecord(value)) {
		return value === null ? null : undefined;
	}

	const source = value as UnknownRecord;
	const name = source.name;

	return {
		name: typeof name === "string" ? name : null,
	};
}

function isRecord(value: unknown): value is UnknownRecord {
	return (
		value !== null &&
		typeof value === "object" &&
		Array.isArray(value) === false
	);
}

function toCurrentSpace(value: unknown): AccountBootstrapSpaceLike | null {
	return toAccountBootstrapSpace(value);
}

export type {
	AccountBootstrapLike,
	AccountBootstrapSpaceLike,
	AccountTenantSelection,
	UseAccountBootstrapOptions,
	UseAccountBootstrapReturn,
} from "@cocrepo/type";

export function resolveCurrentSpaceFitnessCenterName(
	currentSpace: AccountBootstrapSpaceLike | null | undefined,
	spaces: AccountBootstrapSpaceLike[],
) {
	if (!currentSpace) {
		return "";
	}

	const currentSpaceId = currentSpace?.id;
	if (!isWireId(currentSpaceId)) {
		return "";
	}

	return (
		currentSpace.fitnessCenter?.name ??
		spaces.find((space) => isSameWireId(space.id, currentSpaceId))
			?.fitnessCenter?.name ??
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
				.filter(
					(space) =>
						isWireId(space.id) &&
						isWireId(space.tenantId) &&
						space.fitnessCenter,
				)
				.map((space) => ({
					tenantId: space.tenantId!,
					spaceId: space.id!,
					fitnessCenterName: space.fitnessCenter?.name ?? "",
					contentLanguageCode: space.contentLanguageCode ?? null,
				})),
		);
	}, [account, spaces]);

	useEffect(() => {
		if (!isHydrated || !isCurrentSpaceFetched) {
			return;
		}

		if (
			currentSpace !== null &&
			currentSpace !== undefined &&
			isWireId(currentSpace.id) &&
			isWireId(currentSpace.tenantId)
		) {
			account.setCurrentTenant(
				currentSpace.tenantId,
				resolveCurrentSpaceFitnessCenterName(currentSpace, spaces),
				currentSpace.contentLanguageCode ??
					spaces.find((space) => isSameWireId(space.id, currentSpace.id))
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
	const spaces = useMemo(
		() => normalizeAccountBootstrapSpaces(mySpacesResponse?.data),
		[mySpacesResponse?.data],
	);
	const currentSpace = useMemo(
		() => toCurrentSpace(currentSpaceResponse?.data) ?? null,
		[currentSpaceResponse?.data],
	);

	return useTenantBootstrap({
		account,
		isHydrated,
		spaces,
		currentSpace,
		isCurrentSpaceFetched,
	});
}
