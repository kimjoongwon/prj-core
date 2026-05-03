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
	density: NonNullable<SidePanelProps["density"]>;
	onItemClick: (itemId: string) => void;
}

const SubMenuItem = observer(function SubMenuItem({
	item,
	isSelected,
	density,
	onItemClick,
}: SubMenuItemProps) {
	const handleClick = () => {
		onItemClick(item.id);
	};

	return (
		<button
			type="button"
			className={cn(
				"flex w-full items-center text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
				density === "compact"
					? "rounded-lg px-2.5 py-1.5 text-[13px] leading-5"
					: "rounded-2xl px-3 py-2.5 text-sm",
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
	isActiveBranch: boolean;
	isExpanded: boolean;
	selectedSubItemId: string | null;
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onToggle: (navItemId: string) => void;
	density: NonNullable<SidePanelProps["density"]>;
	descriptionVisibility: NonNullable<SidePanelProps["descriptionVisibility"]>;
	renderItemIcon?: SidePanelProps["renderItemIcon"];
	getItemDescription?: SidePanelProps["getItemDescription"];
}

const NavItemComponent = observer(function NavItemComponent({
	item,
	isSelected,
	isActiveBranch,
	isExpanded,
	selectedSubItemId,
	onNavItemClick,
	onSubNavItemClick,
	onToggle,
	density,
	descriptionVisibility,
	renderItemIcon,
	getItemDescription,
}: NavItemComponentProps) {
	const hasChildren = item.hasChildren;
	const visualExpanded = hasChildren && isExpanded;
	const shouldShowDescription =
		descriptionVisibility === "always" ||
		(descriptionVisibility === "active" &&
			(isSelected || isActiveBranch || visualExpanded));
	const description = shouldShowDescription ? getItemDescription?.(item) : null;

	const handleClick = () => {
		if (hasChildren) {
			onToggle(item.id);
		} else {
			onNavItemClick(item.id);
		}
	};

	return (
		<div className={density === "compact" ? "space-y-1" : "space-y-1.5"}>
			<button
				type="button"
				aria-current={isSelected ? "page" : undefined}
				className={cn(
					"group flex w-full items-start text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
					density === "compact"
						? "gap-2 rounded-xl px-2.5 py-2"
						: "gap-3 rounded-[22px] px-3 py-3",
					isSelected
						? cn(
								"bg-slate-950 text-white dark:bg-white dark:text-slate-950",
								density === "compact"
									? "shadow-[0_12px_28px_-24px_rgba(15,23,42,0.72)]"
									: "shadow-[0_22px_46px_-28px_rgba(15,23,42,0.7)]",
							)
						: isActiveBranch
							? "bg-slate-100/90 text-slate-950 dark:bg-white/5 dark:text-slate-50"
						: "bg-transparent text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-white/5",
				)}
				onClick={handleClick}
			>
				{(renderItemIcon || item.icon) && (
					<span
						className={cn(
							"flex shrink-0 items-center justify-center border transition",
							density === "compact"
								? "h-8 w-8 rounded-lg"
								: "mt-0.5 h-11 w-11 rounded-2xl",
							isSelected
								? "border-white/15 bg-white/10 text-white dark:border-slate-200/70 dark:bg-slate-100 dark:text-slate-950"
								: isActiveBranch
									? "border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-primary-300"
								: "border-slate-200/70 bg-white/80 text-slate-500 group-hover:border-slate-300 group-hover:text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:group-hover:text-slate-50",
						)}
					>
						{renderItemIcon ? (
							renderItemIcon(item, { isSelected })
						) : item.icon ? (
							<AppIcon
								name={item.icon}
								className={density === "compact" ? "h-4 w-4" : "h-5 w-5"}
								size={density === "compact" ? 16 : 19}
							/>
						) : null}
					</span>
				)}

				<span className="min-w-0 flex-1">
					<span
						className={cn(
							"block truncate",
							density === "compact" ? "text-[13px] leading-5" : "text-sm",
							isSelected ? "font-semibold" : "font-medium",
						)}
					>
						{item.label}
					</span>
					{description && (
						<span
							className={cn(
								"block truncate",
								density === "compact"
								? "mt-0.5 text-[11px] leading-4"
								: "mt-1 text-xs leading-5",
								isSelected
									? "text-white/70 dark:text-slate-600"
									: isActiveBranch
										? "text-slate-500 dark:text-slate-400"
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
							"shrink-0 transition-transform",
							density === "compact" ? "mt-0.5 h-3.5 w-3.5" : "mt-1 h-4 w-4",
							isSelected
								? "text-white/70 dark:text-slate-600"
								: isActiveBranch
									? "text-slate-500 dark:text-slate-300"
								: "text-slate-400 dark:text-slate-500",
							visualExpanded ? "rotate-180" : "",
						)}
					/>
				)}
			</button>

			{visualExpanded && (
				<div
					className={cn(
						"border-l border-slate-200/80 dark:border-white/10",
						density === "compact"
							? "ml-4 space-y-1 pl-3"
							: "ml-5 space-y-1.5 pl-4",
					)}
				>
					{item.children.map((child) => (
						<SubMenuItem
							key={child.id}
							item={child}
							isSelected={selectedSubItemId === child.id}
							density={density}
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
	density = "comfortable",
	descriptionVisibility = "always",
	renderItemIcon,
	getItemDescription,
}: SidePanelProps) {
	const defaultHeaderContent =
		logo || logoDescription ? (
			<div
				className={cn(
					"border-b border-slate-200/70 dark:border-white/10",
					density === "compact" ? "px-3 pb-3 pt-3" : "px-4 pb-4 pt-5",
				)}
			>
				<div
					className={cn(
						"border border-slate-200/70 bg-slate-100/82 dark:border-white/10 dark:bg-white/5",
						density === "compact" ? "rounded-2xl p-3" : "rounded-[24px] p-4",
					)}
				>
					{logo}
					{logoDescription && (
						<p
							className={cn(
								"text-slate-600 dark:text-slate-300",
								density === "compact"
									? "mt-2 text-xs leading-5"
									: "mt-3 text-sm leading-6",
							)}
						>
							{logoDescription}
						</p>
					)}
				</div>
			</div>
		) : null;

	return (
		<aside
			className={cn(
				"flex h-full flex-col",
				density === "compact" ? "px-2.5 pb-3 pt-3" : "px-4 pb-5 pt-5",
				className,
			)}
		>
			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col overflow-hidden border border-slate-200/70 bg-white/84 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72",
					density === "compact"
						? "rounded-[20px] shadow-[0_18px_52px_-44px_rgba(15,23,42,0.58)]"
						: "rounded-[30px] shadow-[0_28px_80px_-56px_rgba(15,23,42,0.55)]",
				)}
			>
				{header ?? defaultHeaderContent}

				<nav
					className={cn(
						"flex-1 overflow-y-auto",
						density === "compact" ? "p-2" : "p-3",
					)}
				>
					<div className={density === "compact" ? "space-y-1" : "space-y-2"}>
						{navItems.map((item) => (
							<NavItemComponent
								key={item.id}
								item={item}
								isSelected={
									selectedNavItem?.id === item.id && selectedSubNavItem === null
								}
								isActiveBranch={
									selectedNavItem?.id === item.id && selectedSubNavItem !== null
								}
								isExpanded={expandedNavItemIds.has(item.id)}
								selectedSubItemId={selectedSubNavItem?.id ?? null}
								onNavItemClick={onNavItemClick}
								onSubNavItemClick={onSubNavItemClick}
								onToggle={onNavItemToggle}
								density={density}
								descriptionVisibility={descriptionVisibility}
								renderItemIcon={renderItemIcon}
								getItemDescription={getItemDescription}
							/>
						))}
					</div>
				</nav>

				{footer && (
					<div
						className={cn(
							"border-t border-slate-200/70 dark:border-white/10",
							density === "compact" ? "px-3 py-2" : "px-4 py-3",
						)}
					>
						{footer}
					</div>
				)}
			</div>
		</aside>
	);
});

SidePanel.displayName = "SidePanel";
