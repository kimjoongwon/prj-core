"use client";

import type {
	SpaceGuardPersistStoreLike,
	UseSpaceGuardOptions,
	UseSpaceGuardReturn,
} from "@cocrepo/type";
import { useEffect, useState } from "react";

export type { UseSpaceGuardOptions, UseSpaceGuardReturn } from "@cocrepo/type";

/**
 * createUseSpaceGuard - Space Guard 훅 팩토리
 *
 * 앱별 PersistStore selector hook을 주입받아 useSpaceGuard 훅을 생성합니다.
 *
 * @example
 * ```tsx
 * // apps/admin/src/hooks/useSpaceGuard.ts
 * import { createUseSpaceGuard } from "@cocrepo/hook";
 * import { usePersistStore } from "../stores";
 *
 * export const useSpaceGuard = createUseSpaceGuard({
 *   usePersistStore,
 *   selectSpacePath: "/select-space",
 * });
 * ```
 */
export function createUseSpaceGuard<
	TPersistStore extends SpaceGuardPersistStoreLike,
>(options: UseSpaceGuardOptions<TPersistStore>) {
	const {
		usePersistStore,
		selectSpacePath: _selectSpacePath = "/select-space",
	} = options;

	return function useSpaceGuard(): UseSpaceGuardReturn {
		// TODO: Space 선택 페이지 구현 후 활성화
		// const router = useRouter();
		const persistStore = usePersistStore();
		const [showAlert, setShowAlert] = useState(false);

		useEffect(() => {
			if (
				!persistStore?.isHydrated ||
				!persistStore?.isSpaceSelectionResolved
			) {
				setShowAlert(false);
				return;
			}

			// spaceId가 없으면 Alert 표시
			if (!persistStore?.spaceId) {
				setShowAlert(true);
			} else {
				setShowAlert(false);
			}
		}, [
			persistStore?.isHydrated,
			persistStore?.isSpaceSelectionResolved,
			persistStore?.spaceId,
		]);

		const handleConfirm = () => {
			setShowAlert(false);
			// TODO: Space 선택 페이지 구현 후 활성화
			// router.push(selectSpacePath);
		};

		const handleDismiss = () => {
			setShowAlert(false);
		};

		return {
			showAlert,
			handleConfirm,
			handleDismiss,
			hasSpace: !!persistStore?.spaceId,
			groundName: persistStore?.groundName ?? null,
		};
	};
}
