"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

/**
 * Space 선택 여부를 확인하는 Guard 훅
 *
 * spaceId가 없으면 Alert을 표시하고,
 * 확인 시 Space 선택 페이지로 이동합니다.
 *
 * @example
 * ```tsx
 * function AdminLayout({ children }) {
 *   const { showAlert, handleConfirm, hasSpace } = useSpaceGuard();
 *
 *   return (
 *     <div>
 *       {children}
 *       {showAlert && (
 *         <SpaceAlert onConfirm={handleConfirm} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSpaceGuard() {
	const _router = useRouter();
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
		// router.push("/select-space");
	};

	const handleDismiss = () => {
		setShowAlert(false);
	};

	return {
		/** Alert 표시 여부 */
		showAlert,
		/** Alert 확인 버튼 핸들러 */
		handleConfirm,
		/** Alert 닫기 핸들러 */
		handleDismiss,
		/** Space가 선택되어 있는지 여부 */
		hasSpace: !!persistStore?.spaceId,
		/** 현재 선택된 Ground 이름 */
		groundName: persistStore?.groundName ?? null,
	};
}
