"use client";

import { useGetMyAbilities } from "@cocrepo/api/core/abilities";
import { useAbilities as useInjectedAbilities } from "@cocrepo/hook";
import { usePathname } from "next/navigation";
import { usePersistStore } from "@/stores/AppStoreProvider";

interface UseAbilitiesOptions {
	/**
	 * 이 경로 접두사로 시작하면 권한 조회 API를 호출하지 않습니다.
	 * @default "/auth"
	 */
	skipPathPrefix?: string;
}

/**
 * admin 앱 권한 bootstrap hook
 *
 * URL/pathname과 Orval 권한 query는 admin 앱이 소유하고,
 * @cocrepo/hook의 useAbilities에는 query 결과만 주입합니다.
 */
export function useAbilities(options: UseAbilitiesOptions = {}) {
	const { skipPathPrefix = "/auth" } = options;
	const pathname = usePathname();
	const persistStore = usePersistStore();
	const isDisabled = pathname?.startsWith(skipPathPrefix) === true;
	const canLoadAbilities =
		!isDisabled &&
		persistStore.isHydrated &&
		persistStore.isSpaceSelectionResolved &&
		Boolean(persistStore.spaceId);
	const query = useGetMyAbilities({
		query: {
			enabled: canLoadAbilities,
			queryKey: ["/api/v1/abilities/my", persistStore.spaceId],
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
		},
	});

	return useInjectedAbilities({
		abilities: query.data?.data,
		isLoading: !isDisabled && !canLoadAbilities ? true : query.isLoading,
		isError: query.isError,
		isDisabled,
	});
}
