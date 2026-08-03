"use client";

import { useGetMyAbilities } from "@cocrepo/api/core/abilities";
import { useApp } from "@cocrepo/store";
import { usePathname } from "next/navigation";
import { useAbilities } from "./useAbilities";
import { isWireId } from "./wire-id";

export interface UseAbilityBootstrapOptions {
	/**
	 * 이 경로 접두사로 시작하면 권한 조회 API를 호출하지 않습니다.
	 * @default "/auth"
	 */
	skipPathPrefix?: string;
}

/**
 * 현재 route와 선택 tenant 상태에 맞춰 권한 API 결과를 bootstrap 형태로 정규화합니다.
 */
export function useAbilityBootstrap(options: UseAbilityBootstrapOptions = {}) {
	const { skipPathPrefix = "/auth" } = options;
	const pathname = usePathname();
	const app = useApp();
	const account = app.account;
	const currentTenantId = isWireId(account.currentTenantId)
		? account.currentTenantId
		: null;
	const isDisabled = pathname?.startsWith(skipPathPrefix) === true;
	const canLoadAbilities =
		!isDisabled &&
		account.isHydrated &&
		account.isSelectionResolved &&
		currentTenantId !== null;
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
		isLoading: !isDisabled && !canLoadAbilities ? true : query.isLoading,
		isError: query.isError,
		isDisabled,
	});
}
