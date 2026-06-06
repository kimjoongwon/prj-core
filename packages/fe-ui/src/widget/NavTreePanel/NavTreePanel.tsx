"use client";

import type { NavItem } from "@cocrepo/store";
import { ChevronRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { Accordion, cn } from "@heroui/react";
import { useT } from "../../i18n";
import { VStack } from "../../rhythm/VStack/VStack";

type NavTreeItem = NavItem & {};

export interface NavTreePanelProps {
	items: NavTreeItem[];
	expandedKeys: Set<string>;
	onToggle: (id: string) => void;
	onSelectTreeItem: (id: string) => void;
	onSelectSubItem: (id: string) => void;
	width?: number;
	className?: string;
}

export const NavTreePanel = observer(
	({
		items,
		expandedKeys,
		onToggle,
		onSelectTreeItem,
		onSelectSubItem,
		width = 240,
		className,
		}: NavTreePanelProps) => {
			const t = useT();
			const parentItems = items.filter((item) => item.hasChildren);
			const standaloneItems = items.filter((item) => !item.hasChildren);

		return (
			<nav
				className={cn(
					"flex h-full flex-col border-r border-border bg-surface",
					className,
				)}
				style={{ width: `${width}px` }}
			>
				<VStack className="flex-1 overflow-y-auto p-3" gap={1}>
					{standaloneItems.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => onSelectTreeItem(item.id)}
							className={cn(
								"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								item.active
									? "bg-accent/10 text-accent"
									: "text-foreground/70 hover:bg-default hover:text-foreground",
							)}
						>
							{item.icon && (
								<AppIcon name={item.icon} className="h-5 w-5" size={20} />
							)}
							<span>{t(item.label)}</span>
						</button>
					))}

						{parentItems.length > 0 && (
							<Accordion className="px-0">
								{parentItems.map((item) => {
									const isExpanded = expandedKeys.has(item.id);

									return (
										<Accordion.Item
											key={item.id}
											id={item.id}
											isExpanded={isExpanded}
											onExpandedChange={() => onToggle(item.id)}
										>
											<Accordion.Heading>
												<Accordion.Trigger
													className={cn(
														"flex w-full flex-row-reverse items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-default",
														item.active ? "text-accent" : "text-foreground/70",
													)}
												>
													<ChevronRight
														className={cn(
															"h-4 w-4 text-foreground/40 transition-transform duration-200",
															isExpanded && "rotate-90",
														)}
													/>
													<span className="flex items-center gap-3">
														{item.icon && (
															<AppIcon
																name={item.icon}
																className="h-5 w-5"
																size={20}
															/>
														)}
														<span>{t(item.label)}</span>
													</span>
												</Accordion.Trigger>
											</Accordion.Heading>
											<Accordion.Panel className="pt-1 pb-0">
												<div className="ml-3 flex flex-col gap-1">
													{item.children.map((child) => (
														<button
															key={child.id}
															type="button"
															onClick={() => onSelectSubItem(child.id)}
															className={cn(
																"flex items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
																child.active
																	? "bg-accent/10 font-medium text-accent"
																	: "text-foreground/60 hover:bg-default hover:text-foreground",
															)}
														>
															{t(child.label)}
														</button>
													))}
												</div>
											</Accordion.Panel>
										</Accordion.Item>
									);
								})}
							</Accordion>
						)}
				</VStack>
			</nav>
		);
	},
);

NavTreePanel.displayName = "NavTreePanel";
