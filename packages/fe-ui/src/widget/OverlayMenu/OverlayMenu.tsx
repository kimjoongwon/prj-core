"use client";

import { Check, ChevronRight, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { Button } from "../../design-system/primitives";
import type { OverlayMenuProps } from "../../display/layout/type";

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
			<div className="flex h-14 items-center justify-between border-divider border-b bg-content1 px-4">
				<h2 className="font-semibold text-foreground text-lg">{title}</h2>
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={handleClose}
					aria-label="Close sub menu"
				>
					<X className="text-default-500" size={20} />
				</Button>
			</div>

			<div className="h-full overflow-y-auto bg-content2 pb-4">
				<ul className="divide-y divide-divider">
					{items.map((item) => {
						const isSelected = selectedItemId === item.id;

						return (
							<li key={item.id}>
								<button
									type="button"
									className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
										isSelected
											? "bg-primary/10 text-primary"
											: "bg-content1 text-foreground hover:bg-content3"
									}`}
									onClick={() => handleItemClick(item.id)}
								>
									{item.icon && (
										<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
											<AppIcon
												name={item.icon}
												className={
													isSelected ? "text-primary" : "text-default-500"
												}
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
											<Check className="text-primary" size={20} />
										</span>
									)}

									{!isSelected && (
										<span className="flex-shrink-0">
											<ChevronRight className="text-default-400" size={20} />
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
