"use client";

import { cn } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../../design-system/icon/AppIcon";
import { NavigationPanelSubItem } from "./NavigationPanelSubItem";
import type { NavigationPanelItemProps } from "./types";

export const NavigationPanelItem = observer(function NavigationPanelItem({
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
}: NavigationPanelItemProps) {
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
					"group flex w-full items-start text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40",
					density === "compact"
						? "gap-2 rounded-xl px-2.5 py-2"
						: "gap-3 rounded-[22px] px-3 py-3",
					isSelected
						? "bg-accent-soft text-accent-soft-foreground shadow-none"
						: isActiveBranch
							? "bg-default/70 text-foreground"
							: "bg-transparent text-muted hover:bg-default/70 hover:text-foreground",
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
								? "border-accent/20 bg-surface text-accent"
								: isActiveBranch
									? "border-accent/20 bg-accent-soft text-accent-soft-foreground"
									: "border-border bg-background text-muted group-hover:text-foreground",
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
									? "text-accent-soft-foreground/70"
									: isActiveBranch
										? "text-muted"
										: "text-muted",
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
								? "text-accent-soft-foreground/70"
								: isActiveBranch
									? "text-muted"
									: "text-muted",
							visualExpanded ? "rotate-180" : "",
						)}
					/>
				)}
			</button>

			{visualExpanded && (
				<div
					className={cn(
						"border-l border-border",
						density === "compact"
							? "ml-4 space-y-1 pl-3"
							: "ml-5 space-y-1.5 pl-4",
					)}
				>
					{item.children.map((child) => (
						<NavigationPanelSubItem
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

NavigationPanelItem.displayName = "NavigationPanelItem";
