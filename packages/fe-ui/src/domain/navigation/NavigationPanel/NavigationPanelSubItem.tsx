"use client";

import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { NavigationPanelSubItemProps } from "./types";

export const NavigationPanelSubItem = observer(function NavigationPanelSubItem({
	item,
	isSelected,
	density,
	onItemClick,
}: NavigationPanelSubItemProps) {
	const handleClick = () => {
		onItemClick(item.id);
	};

	return (
		<button
			type="button"
			className={cn(
				"flex w-full items-center text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40",
				density === "compact"
					? "rounded-lg px-2.5 py-1.5 text-[13px] leading-5"
					: "rounded-2xl px-3 py-2.5 text-sm",
				isSelected
					? "bg-accent-soft font-semibold text-accent-soft-foreground"
					: "text-muted hover:bg-default/70 hover:text-foreground",
			)}
			onClick={handleClick}
		>
			<span className="truncate">{item.label}</span>
		</button>
	);
});

NavigationPanelSubItem.displayName = "NavigationPanelSubItem";
