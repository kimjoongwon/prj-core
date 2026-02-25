"use client";

import { createUseLayout } from "@cocrepo/hook";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "../stores/AppStoreProvider";

/**
 * useAdminLayout - AdminLayout 통합 훅
 *
 * NavigationStore, BottomTabStore, FABStore의 데이터와 핸들러를
 * AdminLayout props 형태로 반환합니다.
 *
 * @example
 * ```tsx
 * function AdminLayoutWrapper({ children }) {
 *   const layoutProps = useAdminLayout();
 *   return <AdminLayout {...layoutProps}>{children}</AdminLayout>;
 * }
 * ```
 */
export const useAdminLayout = createUseLayout({
	useNavigationStore,
	useBottomTabStore,
	useFABStore,
});
