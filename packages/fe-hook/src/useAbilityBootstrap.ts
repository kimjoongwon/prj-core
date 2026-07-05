"use client";

import { useGetMyAbilities } from "@cocrepo/api/core/abilities";
import { useApp } from "@cocrepo/store";
import { usePathname } from "next/navigation";
import { useAbilities } from "./useAbilities";

export interface UseAbilityBootstrapOptions {
	/**
	 * 이 경로 접두사로 시작하면 권한 조회 API를 호출하지 않습니다.
	 * @default "/auth"
	 */
	skipPathPrefix?: string;
}

/**
 * 현재 route와 선택 Space 상태에 맞춰 권한 API 결과를 bootstrap 형태로 정규화합니다.
 */
export function useAbilityBootstrap(options: UseAbilityBootstrapOptions = {}) {
	const { skipPathPrefix = "/auth" } = options;
	const pathname = usePathname();
	const app = useApp();
	const space = app.space;
	if (!space) {
		throw new Error("space가 초기화되지 않았습니다.");
	}
	const isDisabled = pathname?.startsWith(skipPathPrefix) === true;
	const canLoadAbilities =
		!isDisabled &&
		space.isHydrated &&
		space.isSpaceSelectionResolved &&
		Boolean(space.tenantId);
	const query = useGetMyAbilities({
		query: {
			enabled: canLoadAbilities,
			queryKey: ["/api/v1/abilities/my", space.tenantId],
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
