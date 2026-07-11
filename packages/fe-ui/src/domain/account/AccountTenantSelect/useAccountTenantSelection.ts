"use client";

import { useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import { useApp } from "@cocrepo/store";
import type { Option } from "@cocrepo/type";
import { useCallback } from "react";

/** Account Tenant 선택 orchestration 훅의 반환 계약입니다. */
export interface UseAccountTenantSelectionReturn {
	currentTenantId: string | null;
	isPending: boolean;
	options: Option[];
	selectTenant: (tenantId: string) => void;
}

/** Tenant 선택을 서버에 영구 저장하고 account 캐시를 확정합니다. */
export function useAccountTenantSelection(): UseAccountTenantSelectionReturn {
	const app = useApp();
	const account = app.account;
	const { mutate, isPending } = useSetCurrentSpace({
		mutation: {
			onSuccess: (response, variables) => {
				const selectedSpace = account.availableSpaces.find(
					(space) => space.tenantId === variables.tenantId,
				);
				if (!selectedSpace) {
					account.selectTenant(account.currentTenantId);
					return;
				}

				const currentSpace = response.data;
				account.setCurrentTenant(
					variables.tenantId,
					currentSpace?.ground?.name ?? selectedSpace.groundName,
					selectedSpace.contentLanguageCode ?? null,
					currentSpace?.id ?? selectedSpace.spaceId,
				);
				window.location.reload();
			},
			onError: () => {
				account.selectTenant(account.currentTenantId);
			},
		},
	});

	const selectTenant = useCallback(
		(tenantId: string) => {
			if (
				isPending ||
				!tenantId ||
				tenantId === account.currentTenantId ||
				!account.availableSpaces.some((space) => space.tenantId === tenantId)
			) {
				return;
			}

			account.selectTenant(tenantId);
			mutate({ tenantId });
		},
		[account, isPending, mutate],
	);

	return {
		currentTenantId: account.selectedTenantId,
		isPending,
		options: account.availableSpaces.map((space) => ({
			text: space.groundName,
			value: space.tenantId,
		})),
		selectTenant,
	};
}
