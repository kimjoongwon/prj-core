"use client";

import type { UseAbilitiesOptions, UseAbilitiesReturn } from "@cocrepo/type";

export type { UseAbilitiesOptions, UseAbilitiesReturn } from "@cocrepo/type";

/**
 * useAbilities Hook
 *
 * 사용하는 앱/route가 소유한 권한 query 결과를 App Store Ability bootstrap에
 * 맞는 안정적인 shape으로 정규화합니다.
 *
 * @example
 * ```tsx
 * function AbilityStoreBootstrapper() {
 *   const query = useGetMyAbilities();
 *   const { abilities } = useAbilities({
 *     abilities: query.data?.data,
 *     isLoading: query.isLoading,
 *     isError: query.isError,
 *   });
 *   // abilities를 @cocrepo/store의 convertApiToAbilityRules로 변환 후 updateRules
 * }
 * ```
 */
export function useAbilities<TAbility = unknown>(
	options: UseAbilitiesOptions<TAbility>,
): UseAbilitiesReturn<TAbility> {
	const {
		abilities,
		isLoading = false,
		isError = false,
		isDisabled = false,
	} = options;

	return {
		abilities: isDisabled ? [] : (abilities ?? []),
		isLoading: isDisabled ? false : isLoading,
		isError: isDisabled ? false : isError,
		isDisabled,
	};
}
