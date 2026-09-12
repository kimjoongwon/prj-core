"use client";

import { useGetMyAbilities } from "@cocrepo/api/core/abilities";
import { useApp } from "@cocrepo/store";
import { useAbilities } from "./useAbilities";
import { isWireId } from "./wire-id";

/**
 * 선택 tenant 상태에 맞춰 권한 API 결과를 bootstrap 형태로 정규화합니다.
 * 마운트 시점의 호출 여부는 소비자(인증 라우트 그룹 layout)가 결정합니다.
 */
export function useAbilityBootstrap() {
	const app = useApp();
	const account = app.account;
	const currentTenantId = isWireId(account.currentTenantId)
		? account.currentTenantId
		: null;
	const canLoadAbilities =
		account.isHydrated && account.isSelectionResolved && currentTenantId !== null;
	const query = useGetMyAbilities({
		query: {
			enabled: canLoadAbilities,
			queryKey: ["/api/v1/abilities/my"].concat(
				currentTenantId ? [currentTenantId] : [],
			),
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
		},
	});

	return useAbilities({
		abilities: query.data?.data,
		isLoading: !canLoadAbilities ? true : query.isLoading,
		isError: query.isError,
	});
}
