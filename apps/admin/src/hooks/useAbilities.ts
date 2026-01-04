"use client";

import type { AbilityResponseDto } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import { useQuery } from "@tanstack/react-query";

/**
 * useAbilities Hook
 *
 * 서버에서 현재 사용자의 권한을 조회합니다.
 * AbilityProvider에서 사용됩니다.
 *
 * @example
 * ```tsx
 * function AbilityProviderWrapper() {
 *   const { abilities } = useAbilities();
 *   return <AbilityProvider rules={abilities} />
 * }
 * ```
 */
export function useAbilities() {
	// 서버에서 권한 조회
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
	});

	return {
		isLoading,
		isError,
		abilities: data,
	};
}
