"use client";

import type { NavItem } from "@cocrepo/store";
import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import type { AdminSidebarProps } from "./types";

/**
 * 하위 메뉴 아이템 컴포넌트
 */
interface SubMenuItemProps {
	item: NavItem;
	isSelected: boolean;
	onItemClick: (itemId: string) => void;
}

const SubMenuItem = observer(function SubMenuItem({
	item,
	isSelected,
	onItemClick,
}: SubMenuItemProps) {
	const handleClick = () => {
		onItemClick(item.id);
	};

	return (
		<Button
			variant={isSelected ? "flat" : "light"}
			color={isSelected ? "primary" : "default"}
			className="w-full justify-start pl-11 pr-3"
			size="sm"
			onPress={handleClick}
		>
			<span
				className={`flex-1 truncate text-left text-sm ${isSelected ? "font-medium" : ""}`}
			>
				{item.label}
			</span>
		</Button>
	);
});

/**
 * 메인 네비게이션 아이템 컴포넌트 (v7.0 - 항상 펼침)
 */
interface NavItemComponentProps {
	item: NavItem;
	isSelected: boolean;
	selectedSubItemId: string | null;
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
}

const NavItemComponent = observer(function NavItemComponent({
	item,
	isSelected,
	selectedSubItemId,
	onNavItemClick,
	onSubNavItemClick,
}: NavItemComponentProps) {
	const hasChildren = item.hasChildren;

	const handleClick = () => {
		onNavItemClick(item.id);
	};

	return (
		<div className="w-full">
			{/* 1depth 메뉴 아이템 */}
			<Button
				variant={isSelected && !hasChildren ? "flat" : "light"}
				color={isSelected && !hasChildren ? "primary" : "default"}
				className="w-full justify-start px-3"
				onPress={handleClick}
			>
				{/* 아이콘 */}
				{item.icon && (
					<span className="flex-shrink-0">
						{renderLucideIcon(
							item.icon,
							`w-5 h-5 ${isSelected ? "text-primary" : "text-default-500"}`,
							20,
						)}
					</span>
				)}

				{/* 라벨 */}
				<span
					className={`flex-1 truncate text-left ${isSelected ? "font-medium" : ""}`}
				>
					{item.label}
				</span>
			</Button>

			{/* 2depth 메뉴 - 항상 표시 (v7.0 변경사항) */}
			{hasChildren && (
				<div className="mt-1 space-y-0.5">
					{item.children.map((child) => (
						<SubMenuItem
							key={child.id}
							item={child}
							isSelected={selectedSubItemId === child.id}
							onItemClick={onSubNavItemClick}
						/>
					))}
				</div>
			)}
		</div>
	);
});

/**
 * AdminSidebar - 데스크톱 사이드바 (v7.0)
 *
 * 기획서 참조: 01-desktop.md
 * - 항상 펼침 모드 (collapsed 속성 제거)
 * - 모든 2depth 메뉴 항상 표시
 * - NavItem 기반 메뉴 시스템
 *
 * @example
 * ```tsx
 * <AdminSidebar
 *   navItems={navItems}
 *   selectedNavItem={selectedNavItem}
 *   selectedSubNavItem={selectedSubNavItem}
 *   onNavItemClick={(navItemId) => handleNavItemClick(navItemId)}
 *   onSubNavItemClick={(subNavItemId) => handleSubNavItemClick(subNavItemId)}
 *   logo={<Logo />}
 * />
 * ```
 */
export const AdminSidebar = observer(function AdminSidebar({
	navItems,
	selectedNavItem,
	selectedSubNavItem,
	onNavItemClick,
	onSubNavItemClick,
	logo,
}: AdminSidebarProps) {
	return (
		<aside className="flex h-full w-60 flex-col border-divider border-r bg-content1">
			{/* 로고 영역 */}
			{logo && (
				<div className="flex h-14 items-center border-divider border-b px-4">
					{logo}
				</div>
			)}

			{/* 메뉴 영역 */}
			<nav className="flex-1 overflow-y-auto py-2">
				<div className="space-y-1 px-2">
					{navItems.map((item) => (
						<NavItemComponent
							key={item.id}
							item={item}
							isSelected={selectedNavItem?.id === item.id}
							selectedSubItemId={selectedSubNavItem?.id ?? null}
							onNavItemClick={onNavItemClick}
							onSubNavItemClick={onSubNavItemClick}
						/>
					))}
				</div>
			</nav>
		</aside>
	);
});

AdminSidebar.displayName = "AdminSidebar";
