"use client";

import { useLayout } from "@cocrepo/hook";
import type { NavItem } from "@cocrepo/store";
import { Check, ChevronRight, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { Button } from "../../input/Button/Button";

interface MobileOverlayMenuProps {
	title: string;
	items: NavItem[];
	selectedItemId: string | null;
	onItemClick: (itemId: string) => void;
	onClose: () => void;
}

const MobileOverlayMenu = observer(function MobileOverlayMenu({
	title,
	items,
	selectedItemId,
	onItemClick,
	onClose,
}: MobileOverlayMenuProps) {
	return (
		<div className="fixed inset-x-0 top-14 bottom-16 z-30 bg-background md:hidden">
			<div className="flex h-14 items-center justify-between border-border border-b bg-surface px-4">
				<h2 className="font-semibold text-foreground text-lg">{title}</h2>
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={onClose}
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
									onClick={() => onItemClick(item.id)}
								>
									{item.icon ? (
										<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
											<AppIcon
												name={item.icon}
												className={isSelected ? "text-accent" : "text-muted"}
												size={20}
											/>
										</span>
									) : null}
									<span
										className={`flex-1 text-base ${isSelected ? "font-medium" : ""}`}
									>
										{item.label}
									</span>
									<span className="flex-shrink-0">
										{isSelected ? (
											<Check className="text-accent" size={20} />
										) : (
											<ChevronRight className="text-muted" size={20} />
										)}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
});

/**
 * mobile submenu overlay를 store 상태에 연결해 렌더링합니다.
 */
export const MobileMenu = observer(function MobileMenu() {
	const layoutProps = useLayout();

	if (!layoutProps.isSubMenuOpen) {
		return null;
	}

	return (
		<MobileOverlayMenu
			title={layoutProps.subMenuTitle}
			items={layoutProps.subMenuItems}
			selectedItemId={layoutProps.selectedSubNavItem?.id ?? null}
			onItemClick={layoutProps.onSubNavItemClick}
			onClose={layoutProps.onSubMenuClose}
		/>
	);
});
