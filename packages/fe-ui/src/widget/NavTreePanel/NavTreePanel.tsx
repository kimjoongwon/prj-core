"use client";

import type { NavItem } from "@cocrepo/store";
import {
	Accordion,
	AccordionItem,
	type AccordionItemIndicatorProps,
	cn,
} from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { ChevronRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { VStack } from "../../rhythm/VStack/VStack";

type NavTreeItem = NavItem & {};

export interface NavTreePanelProps {
	items: NavTreeItem[];
	expandedKeys: Set<string>;
	onToggle: (id: string) => void;
	onSelectItem: (id: string) => void;
	onSelectSubItem: (id: string) => void;
	width?: number;
	className?: string;
}

export const NavTreePanel = observer(
	({
		items,
		expandedKeys,
		onToggle,
		onSelectItem,
		onSelectSubItem,
		width = 240,
		className,
	}: NavTreePanelProps) => {
		const parentItems = items.filter((item) => item.hasChildren);
		const standaloneItems = items.filter((item) => !item.hasChildren);

		const handleSelectionChange = (keys: Selection) => {
			if (keys === "all") return;

			const keysSet = keys as Set<string>;

			for (const item of parentItems) {
				const isExpanded = expandedKeys.has(item.id);
				const shouldBeExpanded = keysSet.has(item.id);

				if (isExpanded !== shouldBeExpanded) {
					onToggle(item.id);
				}
			}
		};

		const renderIndicator = ({ isOpen }: AccordionItemIndicatorProps) => (
			<ChevronRight
				className={cn(
					"h-4 w-4 text-foreground/40 transition-transform duration-200",
					isOpen && "rotate-90",
				)}
			/>
		);

		return (
			<nav
				className={cn(
					"flex h-full flex-col border-r border-divider bg-content1",
					className,
				)}
				style={{ width: `${width}px` }}
			>
				<VStack className="flex-1 overflow-y-auto p-3" gap={1}>
					{standaloneItems.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => onSelectItem(item.id)}
							className={cn(
								"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								item.active
									? "bg-primary/10 text-primary"
									: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
							)}
						>
							{item.icon && (
								<AppIcon name={item.icon} className="h-5 w-5" size={20} />
							)}
							<span>{item.label}</span>
						</button>
					))}

					{parentItems.length > 0 && (
						<Accordion
							selectionMode="multiple"
							selectedKeys={expandedKeys}
							onSelectionChange={handleSelectionChange}
							className="px-0"
							itemClasses={{
								base: "py-0",
								title: "text-sm font-medium",
								trigger: cn(
									"rounded-lg px-3 py-2.5 data-[hover=true]:bg-default-100",
									"flex-row-reverse justify-between",
								),
								indicator: "text-foreground/40",
								content: "pt-1 pb-0",
							}}
							motionProps={{
								variants: {
									enter: {
										y: 0,
										opacity: 1,
										height: "auto",
										transition: {
											height: { type: "spring", stiffness: 500, damping: 30 },
											opacity: { duration: 0.2 },
										},
									},
									exit: {
										y: -10,
										opacity: 0,
										height: 0,
										transition: {
											height: { duration: 0.2 },
											opacity: { duration: 0.15 },
										},
									},
								},
							}}
						>
							{parentItems.map((item) => (
								<AccordionItem
									key={item.id}
									aria-label={item.label}
									title={
										<span
											className={cn(
												"transition-colors",
												item.active ? "text-primary" : "text-foreground/70",
											)}
										>
											{item.label}
										</span>
									}
									startContent={
										item.icon && (
											<span
												className={cn(
													"transition-colors",
													item.active ? "text-primary" : "text-foreground/70",
												)}
											>
												<AppIcon
													name={item.icon}
													className="h-5 w-5"
													size={20}
												/>
											</span>
										)
									}
									indicator={renderIndicator}
									classNames={{
										title: item.active ? "text-primary" : "text-foreground/70",
									}}
								>
									<div className="ml-3 flex flex-col gap-1">
										{item.children.map((child) => (
											<button
												key={child.id}
												type="button"
												onClick={() => onSelectSubItem(child.id)}
												className={cn(
													"flex items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
													child.active
														? "bg-primary/10 font-medium text-primary"
														: "text-foreground/60 hover:bg-default-50 hover:text-foreground",
												)}
											>
												{child.label}
											</button>
										))}
									</div>
								</AccordionItem>
							))}
						</Accordion>
					)}
				</VStack>
			</nav>
		);
	},
);

NavTreePanel.displayName = "NavTreePanel";
