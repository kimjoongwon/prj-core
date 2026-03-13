"use client";

import type { AbilityResponseDto } from "@cocrepo/api/core/abilities";
import { customInstance } from "@cocrepo/api/core/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

interface UseAbilitiesOptions {
	/**
	 * 이 경로 접두사로 시작하면 권한 조회 API를 호출하지 않습니다.
	 * @default "/auth"
	 */
	skipPathPrefix?: string;
}

/**
 * useAbilities Hook
 *
 * 서버에서 현재 사용자의 권한을 조회합니다.
 * App Store Ability bootstrap 단계에서 사용됩니다.
 *
 * 주의: 지정된 경로(기본값: /auth)에서는 인증이 필요한 API 호출을 방지하기 위해 비활성화됩니다.
 *
 * @param options - 옵션 객체
 * @param options.skipPathPrefix - 이 경로 접두사로 시작하면 API 호출 스킵 (기본값: "/auth")
 *
 * @example
 * ```tsx
 * function AbilityStoreBootstrapper() {
 *   const { abilities } = useAbilities();
 *   // abilities를 @cocrepo/store의 convertApiToAbilityRules로 변환 후 updateRules
 * }
 *
 * // 커스텀 스킵 경로
 * const { abilities } = useAbilities({ skipPathPrefix: "/login" });
 * ```
 */
export function useAbilities(options: UseAbilitiesOptions = {}) {
	const { skipPathPrefix = "/auth" } = options;
	const pathname = usePathname();
	const shouldSkip = pathname?.startsWith(skipPathPrefix);

	// 서버에서 권한 조회 (스킵 경로에서는 비활성화)
	const { data, isLoading, isError } = useQuery({
		queryKey: ["abilities", "my"],
		queryFn: async () => {
			const response = await customInstance<{
				data: AbilityResponseDto[];
			}>({ url: "/api/v1/abilities/my", method: "GET" });
			return response.data;
		},
		staleTime: 1000 * 60 * 5, // 5분간 캐시
		gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
		enabled: !shouldSkip, // 스킵 경로에서는 API 호출 스킵
	});

	return {
		isLoading,
		isError,
		abilities: data,
	};
}
