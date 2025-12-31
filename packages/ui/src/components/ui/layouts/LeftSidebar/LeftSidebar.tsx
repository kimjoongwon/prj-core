"use client";

import { Button, Tooltip } from "@heroui/react";
import { observer } from "mobx-react-lite";

import { renderLucideIcon } from "../../../../utils/iconUtils";
import { Text } from "../../data-display/Text/Text";

/**
 * 사이드바 메뉴 아이템 타입
 */
export interface SidebarMenuItem {
	id: string;
	label: string;
	icon?: string;
	active?: boolean;
	children?: SidebarSubMenuItem[];
}

/**
 * 사이드바 하위 메뉴 아이템 타입
 */
export interface SidebarSubMenuItem {
	id: string;
	label: string;
	active?: boolean;
}

export interface LeftSidebarProps {
	/** 메뉴 아이템 */
	menuItems: SidebarMenuItem[];
	/** 선택된 메뉴 */
	selectedMenu: SidebarMenuItem | null;
	/** 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
	/** 하위 메뉴 클릭 핸들러 */
	onClickSubMenu: (subMenuId: string) => void;
	/** 사이드바 너비 (접힌 상태) */
	collapsedWidth?: string;
	/** 하위 메뉴 패널 너비 */
	subMenuWidth?: string;
}

/**
 * LeftSidebar 컴포넌트
 * 2단 구조: 좌측 메인 메뉴 아이콘 + 우측 하위 메뉴 리스트
 *
 * 특징:
 * - 메인 메뉴는 아이콘으로 표시
 * - 메뉴 선택 시 하위 메뉴 패널이 표시됨
 * - flat한 구조 유지
 *
 * @example
 * ```tsx
 * <LeftSidebar
 *   menuItems={menuItems}
 *   selectedMenu={selectedMenu}
 *   onClickMenu={onClickMenu}
 *   onClickSubMenu={onClickSubMenu}
 * />
 * ```
 */
export const LeftSidebar = observer<LeftSidebarProps>(
	({
		menuItems,
		selectedMenu,
		onClickMenu,
		onClickSubMenu,
		collapsedWidth = "w-16",
		subMenuWidth = "w-48",
	}) => {
		const hasSubMenus =
			selectedMenu?.children && selectedMenu.children.length > 0;

		return (
			<div className="flex h-full">
				{/* 메인 메뉴 아이콘 영역 */}
				<div
					className={`flex flex-col ${collapsedWidth} items-center gap-1 py-4`}
				>
					{menuItems.map((menu) => (
						<MainMenuItem
							key={menu.id}
							menu={menu}
							isSelected={selectedMenu?.id === menu.id}
							onClickMenu={onClickMenu}
						/>
					))}
				</div>

				{/* 하위 메뉴 패널 */}
				{hasSubMenus && (
					<div
						className={`flex flex-col ${subMenuWidth} border-divider border-l bg-content2/50`}
					>
						{/* 선택된 메뉴 헤더 */}
						<div className="border-divider border-b px-4 py-3">
							<Text variant="subtitle2" className="font-semibold">
								{selectedMenu.label}
							</Text>
						</div>

						{/* 하위 메뉴 리스트 */}
						<div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
							{selectedMenu.children?.map((subMenu) => (
								<SubMenuItem
									key={subMenu.id}
									subMenu={subMenu}
									onClickSubMenu={onClickSubMenu}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		);
	},
);

LeftSidebar.displayName = "LeftSidebar";

/**
 * 메인 메뉴 아이템 컴포넌트
 */
interface MainMenuItemProps {
	menu: SidebarMenuItem;
	isSelected: boolean;
	onClickMenu: (menuId: string) => void;
}

const MainMenuItem = observer<MainMenuItemProps>(
	({ menu, isSelected, onClickMenu }) => {
		const handleClick = () => {
			onClickMenu(menu.id);
		};

		return (
			<Tooltip content={menu.label} placement="right" delay={300}>
				<Button
					isIconOnly
					variant={isSelected ? "flat" : "light"}
					color={isSelected ? "primary" : "default"}
					size="lg"
					onPress={handleClick}
					className={`
						${isSelected ? "bg-primary/10" : "hover:bg-default-100"}
					`}
					aria-label={menu.label}
				>
					{renderLucideIcon(
						menu.icon ?? "Circle",
						`w-5 h-5 ${isSelected ? "text-primary" : "text-default-500"}`,
						20,
					)}
				</Button>
			</Tooltip>
		);
	},
);

MainMenuItem.displayName = "MainMenuItem";

/**
 * 하위 메뉴 아이템 컴포넌트
 */
interface SubMenuItemProps {
	subMenu: SidebarSubMenuItem;
	onClickSubMenu: (subMenuId: string) => void;
}

const SubMenuItem = observer<SubMenuItemProps>(
	({ subMenu, onClickSubMenu }) => {
		const handleClick = () => {
			onClickSubMenu(subMenu.id);
		};

		return (
			<Button
				variant={subMenu.active ? "flat" : "light"}
				color={subMenu.active ? "primary" : "default"}
				size="sm"
				onPress={handleClick}
				className={`
					justify-start px-3
					${subMenu.active ? "bg-primary/10 font-medium" : "hover:bg-default-100"}
				`}
			>
				<Text
					variant="body2"
					className={subMenu.active ? "text-primary" : "text-default-600"}
				>
					{subMenu.label}
				</Text>
			</Button>
		);
	},
);

SubMenuItem.displayName = "SubMenuItem";
