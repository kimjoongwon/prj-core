"use client";

import type { NavItem } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import type { SidePanelProps } from "../../display/layout/type";

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
		<button
			type="button"
			className={cn(
				"flex w-full items-center rounded-2xl px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
				isSelected
					? "bg-primary/10 font-semibold text-primary dark:bg-primary/15 dark:text-primary-300"
					: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-50",
			)}
			onClick={handleClick}
		>
			<span className="truncate">{item.label}</span>
		</button>
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
	renderItemIcon?: SidePanelProps["renderItemIcon"];
	getItemDescription?: SidePanelProps["getItemDescription"];
}

const NavItemComponent = observer(function NavItemComponent({
	item,
	isSelected,
	isExpanded,
	selectedSubItemId,
	onNavItemClick,
	onSubNavItemClick,
	onToggle,
	renderItemIcon,
	getItemDescription,
}: NavItemComponentProps) {
	const hasChildren = item.hasChildren;
	const description = getItemDescription?.(item);
	const visualExpanded = hasChildren && (isExpanded || isSelected);

	const handleClick = () => {
		if (hasChildren) {
			onToggle(item.id);
		} else {
			onNavItemClick(item.id);
		}
	};

	return (
		<div className="space-y-1.5">
			<button
				type="button"
				aria-current={isSelected ? "page" : undefined}
				className={cn(
					"group flex w-full items-start gap-3 rounded-[22px] px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
					isSelected
						? "bg-slate-950 text-white shadow-[0_22px_46px_-28px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950"
						: "bg-transparent text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-white/5",
				)}
				onClick={handleClick}
			>
				{(renderItemIcon || item.icon) && (
					<span
						className={cn(
							"mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition",
							isSelected
								? "border-white/15 bg-white/10 text-white dark:border-slate-200/70 dark:bg-slate-100 dark:text-slate-950"
								: "border-slate-200/70 bg-white/80 text-slate-500 group-hover:border-slate-300 group-hover:text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:group-hover:text-slate-50",
						)}
					>
						{renderItemIcon ? (
							renderItemIcon(item, { isSelected })
						) : item.icon ? (
							<AppIcon name={item.icon} className="h-5 w-5" size={19} />
						) : null}
					</span>
				)}

				<span className="min-w-0 flex-1">
					<span
						className={cn(
							"block truncate text-sm",
							isSelected ? "font-semibold" : "font-medium",
						)}
					>
						{item.label}
					</span>
					{description && (
						<span
							className={cn(
								"mt-1 block truncate text-xs leading-5",
								isSelected
									? "text-white/70 dark:text-slate-600"
									: "text-slate-500 dark:text-slate-400",
							)}
						>
							{description}
						</span>
					)}
				</span>

				{hasChildren && (
					<ChevronDown
						className={cn(
							"mt-1 h-4 w-4 shrink-0 transition-transform",
							isSelected
								? "text-white/70 dark:text-slate-600"
								: "text-slate-400 dark:text-slate-500",
							visualExpanded ? "rotate-180" : "",
						)}
					/>
				)}
			</button>

			{visualExpanded && (
				<div className="ml-5 space-y-1.5 border-l border-slate-200/80 pl-4 dark:border-white/10">
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
	header,
	logo,
	logoDescription,
	footer,
	className,
	renderItemIcon,
	getItemDescription,
}: SidePanelProps) {
	const defaultHeaderContent =
		logo || logoDescription ? (
			<div className="border-b border-slate-200/70 px-4 pb-4 pt-5 dark:border-white/10">
				<div className="rounded-[24px] border border-slate-200/70 bg-slate-100/82 p-4 dark:border-white/10 dark:bg-white/5">
					{logo}
					{logoDescription && (
						<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
							{logoDescription}
						</p>
					)}
				</div>
			</div>
		) : null;

	return (
		<aside className={cn("flex h-full flex-col px-4 pb-5 pt-5", className)}>
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/84 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72">
				{header ?? defaultHeaderContent}

				<nav className="flex-1 overflow-y-auto p-3">
					<div className="space-y-2">
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
								renderItemIcon={renderItemIcon}
								getItemDescription={getItemDescription}
							/>
						))}
					</div>
				</nav>

				{footer && (
					<div className="border-t border-slate-200/70 px-4 py-3 dark:border-white/10">
						{footer}
					</div>
				)}
			</div>
		</aside>
	);
});

SidePanel.displayName = "SidePanel";
