"use client";

import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import type { OverlayMenuProps } from "./types";

/**
 * OverlayMenu - 모바일 서브메뉴 리스트 (v7.0 신규)
 *
 * 기획서 참조: 02-mobile.md
 * - 전체 화면 모달 형태
 * - Header 아래 ~ BottomTab 위 영역 사용
 * - 2depth 메뉴 목록 표시
 *
 * @example
 * ```tsx
 * <OverlayMenu
 *   title="예약"
 *   items={subMenuItems}
 *   selectedItemId="reservations-today"
 *   onItemClick={(itemId) => handleItemClick(itemId)}
 *   onClose={() => setIsSubMenuOpen(false)}
 * />
 * ```
 */
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
			{/* 헤더 */}
			<div className="flex h-14 items-center justify-between border-divider border-b bg-content1 px-4">
				<h2 className="font-semibold text-foreground text-lg">{title}</h2>
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={handleClose}
					aria-label="Close sub menu"
				>
					{renderLucideIcon("X", "text-default-500", 20)}
				</Button>
			</div>

			{/* 메뉴 리스트 */}
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
									{/* 아이콘 (있는 경우) */}
									{item.icon && (
										<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
											{renderLucideIcon(
												item.icon,
												isSelected ? "text-primary" : "text-default-500",
												20,
											)}
										</span>
									)}

									{/* 라벨 */}
									<span
										className={`flex-1 text-base ${isSelected ? "font-medium" : ""}`}
									>
										{item.label}
									</span>

									{/* 선택 표시 */}
									{isSelected && (
										<span className="flex-shrink-0">
											{renderLucideIcon("Check", "text-primary", 20)}
										</span>
									)}

									{/* 화살표 */}
									{!isSelected && (
										<span className="flex-shrink-0">
											{renderLucideIcon("ChevronRight", "text-default-400", 20)}
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
