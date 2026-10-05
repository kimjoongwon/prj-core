"use client";

import { useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import { useApp } from "@cocrepo/store";
import { isDecimalId, type Option } from "@cocrepo/type";
import { useCallback } from "react";

/** Account Tenant 선택 orchestration 훅의 반환 계약입니다. */
export interface UseAccountTenantSelectionReturn {
	currentTenantId: string | null;
	isPending: boolean;
	options: Option[];
	selectTenant: (tenantId: string) => void;
}

/** Space 응답의 FitnessCenter와 Company에서 표시 이름을 결정합니다. */
function resolveFitnessCenterName(
	space:
		| {
				fitnessCenter?: {
					name?: string | null;
					company?: { name?: string | null } | null;
				} | null;
		  }
		| null
		| undefined,
): string | null {
	return (
		space?.fitnessCenter?.name ?? space?.fitnessCenter?.company?.name ?? null
	);
}

/** Tenant 선택을 서버에 영구 저장하고 account 캐시를 확정합니다. */
export function useAccountTenantSelection(): UseAccountTenantSelectionReturn {
	const app = useApp();
	const account = app.account;
	const { mutate, isPending } = useSetCurrentSpace({
		mutation: {
			onSuccess: (response, variables) => {
				if (!isDecimalId(variables.tenantId)) {
					account.selectTenant(account.currentTenantId);
					return;
				}

				const selectedSpace = account.availableSpaces.find(
					(space) => space.tenantId === variables.tenantId,
				);
				if (!selectedSpace) {
					account.selectTenant(account.currentTenantId);
					return;
				}

				const currentSpace = response.data;
				const currentSpaceId = isDecimalId(currentSpace?.id)
					? currentSpace.id
					: selectedSpace.spaceId;
				account.setCurrentTenant(
					variables.tenantId,
					resolveFitnessCenterName(currentSpace) ??
						selectedSpace.fitnessCenterName,
					selectedSpace.contentLanguageCode ?? null,
					currentSpaceId,
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
				!isDecimalId(tenantId) ||
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
			text: space.fitnessCenterName,
			value: space.tenantId,
		})),
		selectTenant,
	};
}
