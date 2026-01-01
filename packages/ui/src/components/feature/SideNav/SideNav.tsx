"use client";

import type { Menu } from "@cocrepo/store";
import { useMenuStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useSyncExternalStore } from "react";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { Text } from "../../ui/data-display/Text/Text";
import { VStack } from "../../ui/surfaces/VStack/VStack";

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

export interface SideNavProps {
	/** 사이드바 너비 (기본값: 240px) */
	width?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SideNav Feature 컴포넌트
 * 좌측 사이드바에 2depth 트리 메뉴를 표시합니다.
 * MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <PageLayout leftAside={<SideNav />}>
 *   {children}
 * </PageLayout>
 * ```
 */
export const SideNav = observer(({ width = 240, className }: SideNavProps) => {
	const menuStore = useMenuStore();
	const isMounted = useIsMounted();

	// SSR 대응: 클라이언트 마운트 전에는 빈 배열
	const menuItems = isMounted ? menuStore.items : [];

	/**
	 * 1depth 메뉴 클릭 핸들러
	 * - 하위 메뉴가 있으면: 펼침/접힘 토글
	 * - 하위 메뉴가 없으면: 해당 경로로 이동
	 */
	const handleClickMenu = (menu: Menu) => {
		if (menu.hasChildren) {
			// 하위 메뉴가 있으면 펼침/접힘 토글
			menuStore.toggleMenu(menu.id);
		} else {
			// 하위 메뉴가 없으면 바로 이동 (대시보드 등)
			menuStore.selectMenu(menu.id);
		}
	};

	/**
	 * 2depth 메뉴 클릭 핸들러
	 * 해당 페이지로 이동
	 */
	const handleClickSubMenu = (subMenuId: string) => {
		menuStore.selectSubMenu(subMenuId);
	};

	return (
		<nav
			className={cn(
				"flex h-full flex-col border-r border-divider bg-content1",
				className,
			)}
			style={{ width: `${width}px` }}
		>
			<VStack className="flex-1 overflow-y-auto p-3" gap={1}>
				{menuItems.map((menu) => (
					<div key={menu.id}>
						{/* 1depth 메뉴 아이템 */}
						<button
							type="button"
							onClick={() => handleClickMenu(menu)}
							className={cn(
								"flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								menu.active
									? "text-primary"
									: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
							)}
						>
							<div className="flex items-center gap-3">
								{menu.icon && renderLucideIcon(menu.icon, "h-5 w-5", 20)}
								<Text>{menu.label}</Text>
							</div>

							{/* 펼침/접힘 화살표 (하위 메뉴가 있는 경우만) */}
							{menu.hasChildren && (
								<span className="text-foreground/40">
									{menuStore.isMenuExpanded(menu.id)
										? renderLucideIcon("ChevronDown", "h-4 w-4", 16)
										: renderLucideIcon("ChevronRight", "h-4 w-4", 16)}
								</span>
							)}
						</button>

						{/* 2depth 하위 메뉴 (펼쳐진 경우만 표시) */}
						{menu.hasChildren && menuStore.isMenuExpanded(menu.id) && (
							<VStack className="mt-1" gap={0}>
								{menu.children.map((subMenu) => (
									<button
										key={subMenu.id}
										type="button"
										onClick={() => handleClickSubMenu(subMenu.id)}
										className={cn(
											"flex w-full items-center rounded-md py-2 pl-11 pr-3 text-sm transition-colors",
											subMenu.active
												? "bg-primary/10 font-medium text-primary"
												: "text-foreground/60 hover:bg-default-100 hover:text-foreground",
										)}
									>
										<Text>{subMenu.label}</Text>
									</button>
								))}
							</VStack>
						)}
					</div>
				))}
			</VStack>
		</nav>
	);
});

SideNav.displayName = "SideNav";
