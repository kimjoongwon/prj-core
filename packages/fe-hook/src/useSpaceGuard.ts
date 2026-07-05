"use client";

import { useApp } from "@cocrepo/store";
import type {
	SpaceGuardScopeLike,
	UseSpaceGuardOptions,
	UseSpaceGuardReturn,
} from "@cocrepo/type";
import { useEffect, useState } from "react";

export type { UseSpaceGuardOptions, UseSpaceGuardReturn } from "@cocrepo/type";

/**
 * createUseSpaceGuard - Space Guard 훅 팩토리
 *
 * 앱별 App hook을 주입받아 useSpaceGuard 훅을 생성합니다.
 *
 * @example
 * ```tsx
 * // packages/fe-hook/src/useSpaceGuard.ts
 * import { createUseSpaceGuard } from "@cocrepo/hook";
 * import { useApp } from "../stores";
 *
 * export const useSpaceGuard = createUseSpaceGuard({
 *   useApp,
 *   selectSpacePath: "/select-space",
 * });
 * ```
 */
export function createUseSpaceGuard<TSpaceScope extends SpaceGuardScopeLike>(
	options: UseSpaceGuardOptions<TSpaceScope>,
) {
	const { useApp, selectSpacePath: _selectSpacePath = "/select-space" } =
		options;

	return function useSpaceGuard(): UseSpaceGuardReturn {
		// TODO: Space 선택 페이지 구현 후 활성화
		// const router = useRouter();
		const space = useApp().space;
		const [showAlert, setShowAlert] = useState(false);

		useEffect(() => {
			if (!space?.isHydrated || !space?.isSpaceSelectionResolved) {
				setShowAlert(false);
				return;
			}

			// tenantId가 없으면 Alert 표시
			if (!space?.tenantId) {
				setShowAlert(true);
			} else {
				setShowAlert(false);
			}
		}, [space?.isHydrated, space?.isSpaceSelectionResolved, space?.tenantId]);

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
			hasSpace: !!space?.tenantId,
			groundName: space?.groundName ?? null,
		};
	};
}

export const useSpaceGuard = createUseSpaceGuard({
	useApp,
	selectSpacePath: "/select-space",
});
