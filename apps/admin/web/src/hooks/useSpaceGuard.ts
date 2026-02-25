"use client";

import { createUseSpaceGuard } from "@cocrepo/hook";
import { usePersistStore } from "../stores/AppStoreProvider";

/**
 * useSpaceGuard - Space 선택 여부를 확인하는 Guard 훅
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
export const useSpaceGuard = createUseSpaceGuard({
	usePersistStore,
	selectSpacePath: "/select-space",
});
