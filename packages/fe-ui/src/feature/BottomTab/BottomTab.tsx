"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn, Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";

export interface BottomTabProps {
	/** 탭 선택 시 콜백 (SubMenuList 표시 여부 결정용) */
	onSelectTab?: (navItemId: string, hasChildren: boolean) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * BottomTab Feature 컴포넌트
 * 모바일에서 1depth 아이템을 하단 탭으로 표시합니다.
 * NavigationStore를 사용하여 네비게이션 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <BottomTab onSelectTab={handleSelectTab} />
 * ```
 */
export const BottomTab = observer(
	({ onSelectTab, className }: BottomTabProps) => {
		const navigationStore = useNavigationStore();
		const navItems = navigationStore.items;

		// 현재 선택된 아이템 ID
		const selectedNavItemId = navigationStore.selectedNavItem?.id;

		// 탭 선택 핸들러
		const handleSelectionChange = (key: React.Key) => {
			const navItemId = key.toString();
			const navItem = navigationStore.findNavItemById(navItemId);

			if (!navItem) return;

			// 하위 아이템이 있는 경우
			if (navItem.hasChildren) {
				navigationStore.selectNavItem(navItemId);
				onSelectTab?.(navItemId, true);
			} else {
				// 하위 아이템이 없는 경우 바로 페이지 이동
				navigationStore.selectNavItem(navItemId);
				onSelectTab?.(navItemId, false);
			}
		};

		// 렌더링할 네비게이션 아이템 (최대 5개)
		const displayItems = navItems.slice(0, 5);

		if (displayItems.length === 0) {
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
					aria-label="네비게이션 탭"
					selectedKey={selectedNavItemId}
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
					{displayItems.map((navItem) => (
						<Tab
							key={navItem.id}
							title={
								<div className="flex flex-col items-center gap-1">
									{navItem.icon && (
										<span
											className={cn(
												"transition-colors",
												navItem.active ? "text-primary" : "text-foreground/60",
											)}
										>
											<AppIcon name={navItem.icon} className="h-6 w-6" size={24} />
										</span>
									)}
									<span
										className={cn(
											"text-xs transition-colors",
											navItem.active
												? "font-medium text-primary"
												: "text-foreground/60",
										)}
									>
										{navItem.label}
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
