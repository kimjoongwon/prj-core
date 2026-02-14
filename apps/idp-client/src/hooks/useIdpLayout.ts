"use client";

import { createUseLayout } from "@cocrepo/hook";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "../stores/AppStoreProvider";

/**
 * useIdpLayout - IDP 콘솔 AdminLayout 통합 훅
 */
export const useIdpLayout = createUseLayout({
	useNavigationStore,
	useBottomTabStore,
	useFABStore,
});
