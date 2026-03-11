"use client";

import type { NavItem } from "@cocrepo/store";
import { Button } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../../design-system/icon/AppIcon";
import type { SidePanelProps } from "./type";

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
			onToggle(item.id);
		} else {
			onNavItemClick(item.id);
		}
	};

	return (
		<div className="w-full">
			<Button
				variant={isSelected && !hasChildren ? "flat" : "light"}
				color={isSelected && !hasChildren ? "primary" : "default"}
				className="w-full justify-start px-3"
				onPress={handleClick}
			>
				{item.icon && (
					<span className="flex-shrink-0">
						<AppIcon
							name={item.icon}
							className={`h-5 w-5 ${isSelected ? "text-primary" : "text-default-500"}`}
							size={20}
						/>
					</span>
				)}

				<span
					className={`flex-1 truncate text-left ${isSelected ? "font-medium" : ""}`}
				>
					{item.label}
				</span>

				{hasChildren && (
					<ChevronDown
						className={`h-4 w-4 text-default-400 transition-transform duration-200 ${
							isExpanded ? "rotate-180" : ""
						}`}
					/>
				)}
			</Button>

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
			{logo && (
				<div className="flex h-14 items-center border-divider border-b px-4">
					{logo}
				</div>
			)}

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
