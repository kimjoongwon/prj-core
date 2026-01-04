"use client";

import { useMenuStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useSyncExternalStore } from "react";
import { Text } from "../../ui/data-display/Text/Text";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface SubMenuListProps {
	/** 하위 메뉴 클릭 시 콜백 */
	onSelectSubMenu?: (subMenuId: string) => void;
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
 * SubMenuList Feature 컴포넌트
 * 모바일에서 선택된 1depth 메뉴의 2depth 하위 메뉴를 전체 화면 리스트로 표시합니다.
 * MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <SubMenuList onSelectSubMenu={handleSelectSubMenu} />
 * ```
 */
export const SubMenuList = observer(
	({ onSelectSubMenu, className }: SubMenuListProps) => {
		const menuStore = useMenuStore();
		const isMounted = useIsMounted();

		// SSR 대응: 클라이언트 마운트 전에는 빈 배열
		const subMenuItems = isMounted ? menuStore.subMenuItems : [];

		// 현재 선택된 메뉴
		const selectedMenu = menuStore.selectedMenu;

		// 하위 메뉴 클릭 핸들러
		const handleClickSubMenu = (subMenuId: string) => {
			menuStore.selectSubMenu(subMenuId);
			onSelectSubMenu?.(subMenuId);
		};

		if (!isMounted || !selectedMenu || subMenuItems.length === 0) {
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
					{subMenuItems.map((subMenu) => (
						<button
							key={subMenu.id}
							type="button"
							onClick={() => handleClickSubMenu(subMenu.id)}
							className={cn(
								"flex w-full items-center rounded-lg px-4 py-3 text-left transition-colors",
								subMenu.active
									? "bg-primary/10 font-medium text-primary"
									: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
							)}
						>
							<Text variant="body1">{subMenu.label}</Text>
						</button>
					))}
				</VStack>
			</div>
		);
	},
);

SubMenuList.displayName = "SubMenuList";
