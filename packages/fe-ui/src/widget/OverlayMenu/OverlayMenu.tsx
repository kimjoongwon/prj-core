"use client";

import { Check, ChevronRight, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { AppIcon } from "../../design-system/icon/AppIcon";
import type { OverlayMenuProps } from "./type";

export const OverlayMenu = observer(function OverlayMenu({
	title,
	items,
	selectedItemId,
	onItemClick,
	onClose,
}: OverlayMenuProps) {
	const handleItemClick = (itemId: string) => {
		onItemClick(itemId);
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<div className="fixed inset-x-0 top-14 bottom-16 z-30 bg-background md:hidden">
			<div className="flex h-14 items-center justify-between border-border border-b bg-surface px-4">
				<h2 className="font-semibold text-foreground text-lg">{title}</h2>
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={handleClose}
					aria-label="Close sub menu"
				>
					<X className="text-muted" size={20} />
				</Button>
			</div>

			<div className="h-full overflow-y-auto bg-surface-secondary pb-4">
				<ul className="divide-y divide-border">
					{items.map((item) => {
						const isSelected = selectedItemId === item.id;

						return (
							<li key={item.id}>
								<button
									type="button"
									className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
										isSelected
											? "bg-accent/10 text-accent"
											: "bg-surface text-foreground hover:bg-surface-tertiary"
									}`}
									onClick={() => handleItemClick(item.id)}
								>
									{item.icon && (
										<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
											<AppIcon
												name={item.icon}
												className={isSelected ? "text-accent" : "text-muted"}
												size={20}
											/>
										</span>
									)}

									<span
										className={`flex-1 text-base ${isSelected ? "font-medium" : ""}`}
									>
										{item.label}
									</span>

									{isSelected && (
										<span className="flex-shrink-0">
											<Check className="text-accent" size={20} />
										</span>
									)}

									{!isSelected && (
										<span className="flex-shrink-0">
											<ChevronRight className="text-muted" size={20} />
										</span>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
});

OverlayMenu.displayName = "OverlayMenu";
