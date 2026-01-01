"use client";

import { useUpdateSelectedSpace } from "@cocrepo/api";
import { useCallback } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

interface UseChangeSpaceOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

/**
 * Space 변경 훅
 *
 * - API 호출로 DB에 selectedSpaceId 저장
 * - PersistStore 업데이트 (x-space-id 헤더용)
 *
 * @example
 * ```tsx
 * function SpaceSelector() {
 *   const { changeSpace, isLoading } = useChangeSpace({
 *     onSuccess: () => window.location.reload(),
 *   });
 *
 *   const handleSelectSpace = (tenant: Tenant) => {
 *     changeSpace(tenant.spaceId, tenant.space.ground.name);
 *   };
 *
 *   return (
 *     <Dropdown>
 *       {tenants.map(tenant => (
 *         <DropdownItem
 *           key={tenant.id}
 *           onClick={() => handleSelectSpace(tenant)}
 *           disabled={isLoading}
 *         >
 *           {tenant.space.ground.name}
 *         </DropdownItem>
 *       ))}
 *     </Dropdown>
 *   );
 * }
 * ```
 */
export function useChangeSpace(options?: UseChangeSpaceOptions) {
	const persistStore = usePersistStore();

	const mutation = useUpdateSelectedSpace({
		mutation: {
			onSuccess: () => options?.onSuccess?.(),
			onError: (error) => options?.onError?.(error as Error),
		},
	});

	const changeSpace = useCallback(
		async (spaceId: string, groundName: string) => {
			try {
				// 백엔드 API 호출 (DB 저장)
				await mutation.mutateAsync({ data: { spaceId } });

				// PersistStore 업데이트 (x-space-id 헤더용)
				persistStore.setSpace(spaceId, groundName);
			} catch (error) {
				// mutation.onError에서 처리됨
			}
		},
		[mutation, persistStore],
	);

	return {
		/** Space 변경 함수 */
		changeSpace,
		/** API 호출 중 여부 */
		isLoading: mutation.isPending,
	};
}
