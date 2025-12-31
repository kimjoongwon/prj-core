"use client";

import { ADMIN_PATHS } from "@cocrepo/constant";
import type { Menu } from "@cocrepo/store";
import type {
	ContextSelectorContext,
	NavMenuItem,
	UserMenuUser,
} from "@cocrepo/ui";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useMenuStore, usePersistStore } from "../stores";

/**
 * 클라이언트 마운트 상태를 추적하는 훅
 * SSR과 클라이언트 초기 렌더링을 일관되게 유지
 */
function useIsMounted(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
}

/**
 * useAppLayout 훅 반환 타입
 */
export interface UseAppLayoutReturn {
	/** Main menu items (for Nav) */
	menuItems: NavMenuItem[];
	/** Sub menu items (for SubNav) */
	subMenuItems: NavMenuItem[];
	/** 현재 Space 컨텍스트 */
	currentContext: ContextSelectorContext | null;
	/** 현재 사용자 */
	currentUser: UserMenuUser | null;
	/** 주요 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
	/** 하위 메뉴 클릭 핸들러 */
	onClickSubMenu: (menuId: string) => void;
	/** Space 변경 핸들러 */
	onChangeContext: () => void;
	/** 로그아웃 핸들러 */
	onLogout: () => void;
	/** 로고 클릭 핸들러 */
	onClickLogo: () => void;
}

/**
 * Menu를 NavMenuItem으로 변환
 */
function toNavMenuItem(item: Menu): NavMenuItem {
	return {
		id: item.id,
		label: item.label,
		icon: item.icon,
		active: item.active,
	};
}

/**
 * AppLayout 상태 관리 및 핸들러 훅
 * MobX MenuStore와 PersistStore를 사용하여 상태를 관리합니다.
 *
 * 주의: useCallback/useMemo 사용하지 않음 (MobX 자동 메모이제이션)
 */
export function useAppLayout(): UseAppLayoutReturn {
	const router = useRouter();
	const menuStore = useMenuStore();
	const persistStore = usePersistStore();
	const isMounted = useIsMounted();

	// 사용자 정보 (임시 mock 데이터)
	const [currentUser] = useState<TopNavUser | null>({
		id: "1",
		name: "관리자",
		role: "최고 관리자",
	});

	// 메뉴 아이템 변환 (observable 상태 반영)
	const menuItems = menuStore.items.map(toTopNavMenuItem);
	// 하위 메뉴는 클라이언트 마운트 후에만 렌더링 (Hydration 오류 방지)
	const subMenuItems = isMounted
		? menuStore.subMenuItems.map(toTopNavMenuItem)
		: [];

	// 주요 메뉴 클릭 핸들러 (MobX action이 자동 메모이제이션됨)
	const onClickMenu = (menuId: string) => {
		menuStore.selectMenu(menuId);
	};

	// 하위 메뉴 클릭 핸들러
	const onClickSubMenu = (menuId: string) => {
		menuStore.selectSubMenu(menuId);
	};

	// Ground 변경 핸들러
	const onChangeContext = () => {
		router.push(ADMIN_PATHS.SELECT_SPACE as never);
	};

	// 로그아웃 핸들러
	const onLogout = () => {
		// PersistStore를 통해 영속 데이터 초기화
		persistStore.clearSpace();
		// 세션 스토리지 정리
		sessionStorage.removeItem("adminRole");
		// 로그인 페이지로 이동
		router.push(ADMIN_PATHS.AUTH_LOGIN as never);
	};

	// 로고 클릭 핸들러
	const onClickLogo = () => {
		// 첫 번째 메뉴로 이동
		const firstMenu = menuStore.items[0];
		if (firstMenu) {
			menuStore.selectMenu(firstMenu.id);
		}
	};

	// 현재 컨텍스트 (PersistStore에서 가져옴)
	const currentContext: TopNavContext | null =
		persistStore.spaceId && persistStore.spaceName
			? { id: persistStore.spaceId, name: persistStore.spaceName }
			: null;

	return {
		menuItems,
		subMenuItems,
		currentContext,
		currentUser,
		onClickMenu,
		onClickSubMenu,
		onChangeContext,
		onLogout,
		onClickLogo,
	};
}
