"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { VStack } from "../../rhythm/VStack/VStack";

export interface SubMenuListProps {
	/** 하위 아이템 클릭 시 콜백 */
	onSelectSubNavItem?: (subNavItemId: string) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SubMenuList Feature 컴포넌트
 * 모바일에서 선택된 1depth 아이템의 2depth 하위 아이템을 전체 화면 리스트로 표시합니다.
 * NavigationStore를 사용하여 네비게이션 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <SubMenuList onSelectSubNavItem={handleSelectSubNavItem} />
 * ```
 */
export const SubMenuList = observer(
	({ onSelectSubNavItem, className }: SubMenuListProps) => {
		const navigationStore = useNavigationStore();
		const subNavItems = navigationStore.subNavItems;

		// 현재 선택된 아이템
		const selectedNavItem = navigationStore.selectedNavItem;

		// 하위 아이템 클릭 핸들러
		const handleClickSubNavItem = (subNavItemId: string) => {
			navigationStore.selectSubNavItem(subNavItemId);
			onSelectSubNavItem?.(subNavItemId);
		};

		if (!selectedNavItem || subNavItems.length === 0) {
			return null;
		}

		return (
			<div
				className={cn(
					"fixed inset-0 z-40 bg-content1 pt-16 md:hidden",
					className,
				)}
			>
				<VStack className="h-full overflow-y-auto p-4" gap={2}>
					{subNavItems.map((subNavItem) => (
						<button
							key={subNavItem.id}
							type="button"
							onClick={() => handleClickSubNavItem(subNavItem.id)}
							className={cn(
								"flex w-full items-center rounded-lg px-4 py-3 text-left transition-colors",
								subNavItem.active
									? "bg-primary/10 font-medium text-primary"
									: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
							)}
						>
							<span>{subNavItem.label}</span>
						</button>
					))}
				</VStack>
			</div>
		);
	},
);

SubMenuList.displayName = "SubMenuList";
