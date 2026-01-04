"use client";

import { useMenuStore } from "@cocrepo/store";
import { cn, Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useSyncExternalStore } from "react";
import { renderLucideIcon } from "../../../utils/iconUtils";

export interface BottomTabProps {
	/** 탭 선택 시 콜백 (SubMenuList 표시 여부 결정용) */
	onSelectTab?: (menuId: string, hasChildren: boolean) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

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
 * BottomTab Feature 컴포넌트
 * 모바일에서 1depth 메뉴를 하단 탭으로 표시합니다.
 * MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <BottomTab onSelectTab={handleSelectTab} />
 * ```
 */
export const BottomTab = observer(
	({ onSelectTab, className }: BottomTabProps) => {
		const menuStore = useMenuStore();
		const isMounted = useIsMounted();

		// SSR 대응: 클라이언트 마운트 전에는 빈 배열
		const menuItems = isMounted ? menuStore.items : [];

		// 현재 선택된 메뉴 ID
		const selectedMenuId = menuStore.selectedMenu?.id;

		// 탭 선택 핸들러
		const handleSelectionChange = (key: React.Key) => {
			const menuId = key.toString();
			const menu = menuStore.findMenuById(menuId);

			if (!menu) return;

			// 하위 메뉴가 있는 경우
			if (menu.hasChildren) {
				menuStore.selectMenu(menuId);
				onSelectTab?.(menuId, true);
			} else {
				// 하위 메뉴가 없는 경우 바로 페이지 이동
				menuStore.selectMenu(menuId);
				onSelectTab?.(menuId, false);
			}
		};

		// 렌더링할 메뉴 아이템 (최대 5개)
		const displayItems = useMemo(() => {
			return menuItems.slice(0, 5);
		}, [menuItems]);

		if (!isMounted || displayItems.length === 0) {
			return null;
		}

		return (
			<nav
				className={cn(
					"fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-content1 md:hidden",
					className,
				)}
			>
				<Tabs
					aria-label="메뉴 탭"
					selectedKey={selectedMenuId}
					onSelectionChange={handleSelectionChange}
					variant="light"
					classNames={{
						base: "w-full",
						tabList:
							"w-full grid grid-cols-5 gap-0 p-0 bg-transparent rounded-none",
						cursor: "bg-transparent",
						tab: "h-16 px-2",
						tabContent: "group-data-[selected=true]:text-primary",
					}}
				>
					{displayItems.map((menu) => (
						<Tab
							key={menu.id}
							title={
								<div className="flex flex-col items-center gap-1">
									{menu.icon && (
										<span
											className={cn(
												"transition-colors",
												menu.active ? "text-primary" : "text-foreground/60",
											)}
										>
											{renderLucideIcon(menu.icon, "h-6 w-6", 24)}
										</span>
									)}
									<span
										className={cn(
											"text-xs transition-colors",
											menu.active
												? "font-medium text-primary"
												: "text-foreground/60",
										)}
									>
										{menu.label}
									</span>
								</div>
							}
						/>
					))}
				</Tabs>
			</nav>
		);
	},
);

BottomTab.displayName = "BottomTab";
