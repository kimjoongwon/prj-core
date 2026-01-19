"use client";

import type { PersistStore } from "@cocrepo/store";
import { useEffect, useState } from "react";

/**
 * useSpaceGuard 옵션 인터페이스
 */
export interface UseSpaceGuardOptions {
	usePersistStore: () => PersistStore;
	/** Space 선택 페이지 경로 (기본값: "/select-space") */
	selectSpacePath?: string;
}

/**
 * useSpaceGuard 반환 타입
 */
export interface UseSpaceGuardReturn {
	/** Alert 표시 여부 */
	showAlert: boolean;
	/** Alert 확인 버튼 핸들러 */
	handleConfirm: () => void;
	/** Alert 닫기 핸들러 */
	handleDismiss: () => void;
	/** Space가 선택되어 있는지 여부 */
	hasSpace: boolean;
	/** 현재 선택된 Ground 이름 */
	groundName: string | null;
}

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
export function createUseSpaceGuard(options: UseSpaceGuardOptions) {
	const { usePersistStore, selectSpacePath: _selectSpacePath = "/select-space" } = options;

	return function useSpaceGuard(): UseSpaceGuardReturn {
		// TODO: Space 선택 페이지 구현 후 활성화
		// const router = useRouter();
		const persistStore = usePersistStore();
		const [showAlert, setShowAlert] = useState(false);

		useEffect(() => {
			// spaceId가 없으면 Alert 표시
			if (!persistStore?.spaceId) {
				setShowAlert(true);
			} else {
				setShowAlert(false);
			}
		}, [persistStore?.spaceId]);

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
