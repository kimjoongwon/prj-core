"use client";

import type { NavItem } from "@cocrepo/store";
import { Button } from "@heroui/react";
import { ChevronDown, icons, type LucideIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { SidePanelProps } from "./type";

function renderLucideIcon(
	iconName?: string,
	className?: string,
	size: number = 16,
) {
	if (!iconName) return null;

	const IconComponent = icons[iconName as keyof typeof icons] as
		| LucideIcon
		| undefined;

	if (!IconComponent) {
		console.warn(`Icon "${iconName}" not found in lucide-react`);
		return null;
	}

	return <IconComponent className={className} size={size} />;
}

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
 * 메인 네비게이션 아이템 컴포넌트 (v7.0 - 펼침/접힘 지원)
 */
interface NavItemComponentProps {
	item: NavItem;
	isSelected: boolean;
	isExpanded: boolean;
	selectedSubItemId: string | null;
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onToggle: (navItemId: string) => void;
}

const NavItemComponent = observer(function NavItemComponent({
	item,
	isSelected,
	isExpanded,
	selectedSubItemId,
	onNavItemClick,
	onSubNavItemClick,
	onToggle,
}: NavItemComponentProps) {
	const hasChildren = item.hasChildren;

	const handleClick = () => {
		if (hasChildren) {
			// 하위 메뉴가 있으면 토글
			onToggle(item.id);
		} else {
			// 하위 메뉴가 없으면 바로 이동
			onNavItemClick(item.id);
		}
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

				{/* 펼침/접힘 화살표 */}
				{hasChildren && (
					<ChevronDown
						className={`h-4 w-4 text-default-400 transition-transform duration-200 ${
							isExpanded ? "rotate-180" : ""
						}`}
					/>
				)}
			</Button>

			{/* 2depth 메뉴 - 펼쳐진 경우에만 표시 */}
			{hasChildren && isExpanded && (
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
 * SidePanel - 데스크톱 사이드바 (v7.0)
 *
 * 기획서 참조: 01-desktop.md
 * - 2depth 메뉴 펼침/접힘 지원
 * - NavItem 기반 메뉴 시스템
 *
 * @example
 * ```tsx
 * <SidePanel
 *   navItems={navItems}
 *   selectedNavItem={selectedNavItem}
 *   selectedSubNavItem={selectedSubNavItem}
 *   expandedNavItemIds={expandedNavItemIds}
 *   onNavItemClick={(navItemId) => handleNavItemClick(navItemId)}
 *   onSubNavItemClick={(subNavItemId) => handleSubNavItemClick(subNavItemId)}
 *   onNavItemToggle={(navItemId) => handleNavItemToggle(navItemId)}
 *   logo={<Logo />}
 * />
 * ```
 */
export const SidePanel = observer(function SidePanel({
	navItems,
	selectedNavItem,
	selectedSubNavItem,
	expandedNavItemIds,
	onNavItemClick,
	onSubNavItemClick,
	onNavItemToggle,
	logo,
}: SidePanelProps) {
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
							isExpanded={expandedNavItemIds.has(item.id)}
							selectedSubItemId={selectedSubNavItem?.id ?? null}
							onNavItemClick={onNavItemClick}
							onSubNavItemClick={onSubNavItemClick}
							onToggle={onNavItemToggle}
						/>
					))}
				</div>
			</nav>
		</aside>
	);
});

SidePanel.displayName = "SidePanel";
