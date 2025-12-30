"use client";

import { ADMIN_PATHS } from "@cocrepo/constant";
import type { MenuItem } from "@cocrepo/store";
import type {
	TopNavContext,
	TopNavMenuItem,
	TopNavUser,
} from "@cocrepo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAdminMenuStore } from "../stores";

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
 * Ground 정보 인터페이스
 */
interface AdminGround {
	id: string;
	name: string;
}

/**
 * useAdminLayout 훅 반환 타입
 */
export interface UseAdminLayoutReturn {
	/** 주요 메뉴 아이템 (TopNav용) */
	menuItems: TopNavMenuItem[];
	/** 하위 메뉴 아이템 (SubNav용) */
	subMenuItems: TopNavMenuItem[];
	/** 현재 Ground 컨텍스트 */
	currentContext: TopNavContext | null;
	/** 현재 사용자 */
	currentUser: TopNavUser | null;
	/** 주요 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
	/** 하위 메뉴 클릭 핸들러 */
	onClickSubMenu: (menuId: string) => void;
	/** Ground 변경 핸들러 */
	onChangeContext: () => void;
	/** 로그아웃 핸들러 */
	onLogout: () => void;
	/** 로고 클릭 핸들러 */
	onClickLogo: () => void;
}

/**
 * MenuItem을 TopNavMenuItem으로 변환
 */
function toTopNavMenuItem(item: MenuItem): TopNavMenuItem {
	return {
		id: item.id,
		label: item.label,
		icon: item.icon,
		active: item.active,
	};
}

/**
 * AdminLayout 상태 관리 및 핸들러 훅
 * MobX MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * 주의: useCallback/useMemo 사용하지 않음 (MobX 자동 메모이제이션)
 */
export function useAdminLayout(): UseAdminLayoutReturn {
	const router = useRouter();
	const menuStore = useAdminMenuStore();
	const isMounted = useIsMounted();

	// Ground 정보 (localStorage에서 로드)
	const [currentGround, setCurrentGround] = useState<AdminGround | null>(null);

	// 사용자 정보 (임시 mock 데이터)
	const [currentUser] = useState<TopNavUser | null>({
		id: "1",
		name: "관리자",
		role: "최고 관리자",
	});

	// localStorage에서 Ground 정보 로드
	useEffect(() => {
		const groundId = localStorage.getItem("currentGroundId");
		const groundName = localStorage.getItem("currentGroundName");
		if (groundId && groundName) {
			setCurrentGround({ id: groundId, name: groundName });
		}
	}, []);

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
		// 인증 정보 제거
		localStorage.removeItem("currentGroundId");
		localStorage.removeItem("currentGroundName");
		localStorage.removeItem("currentSpaceId");
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

	// 현재 컨텍스트 변환
	const currentContext: TopNavContext | null = currentGround
		? { id: currentGround.id, name: currentGround.name }
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
