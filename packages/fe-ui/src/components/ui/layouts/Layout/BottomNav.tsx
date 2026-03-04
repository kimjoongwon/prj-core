"use client";

import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import type { BottomNavProps } from "./types";

/**
 * BottomNav - 모바일 하단 탭바 (v7.0 신규)
 *
 * 기획서 참조: 02-mobile.md
 * - 5개 고정 탭: 대시보드, 예약, 회원, 알림, 더보기
 * - 하위 메뉴가 있는 탭은 SubMenuList 표시
 *
 * @example
 * ```tsx
 * <BottomNav
 *   items={[
 *     { id: 'dashboard', label: '대시보드', icon: 'LayoutDashboard', hasSubMenu: false },
 *     { id: 'reservations', label: '예약', icon: 'CalendarCheck', hasSubMenu: true },
 *   ]}
 *   activeTabId="dashboard"
 *   onTabClick={(tabId) => handleTabClick(tabId)}
 * />
 * ```
 */
export const BottomNav = observer(function BottomNav({
	items,
	activeTabId,
	onTabClick,
}: BottomNavProps) {
	const handleTabClick = (tabId: string) => {
		onTabClick(tabId);
	};

	return (
		<nav className="fixed inset-x-0 bottom-0 z-40 border-divider border-t bg-content1 md:hidden">
			<div className="flex h-16 items-stretch justify-around">
				{items.map((item) => {
					const isActive = activeTabId === item.id;

					return (
						<button
							key={item.id}
							type="button"
							className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
								isActive
									? "text-primary"
									: "text-default-500 hover:text-default-700"
							}`}
							onClick={() => handleTabClick(item.id)}
							aria-current={isActive ? "page" : undefined}
						>
							<span className="flex h-6 w-6 items-center justify-center">
								{renderLucideIcon(
									item.icon,
									isActive ? "text-primary" : "text-default-500",
									24,
								)}
							</span>
							<span
								className={`text-xs ${isActive ? "font-medium" : "font-normal"}`}
							>
								{item.label}
							</span>
						</button>
					);
				})}
			</div>

			{/* iOS 홈 인디케이터 영역 safe area */}
			<div className="h-safe-area-inset-bottom bg-content1" />
		</nav>
	);
});

BottomNav.displayName = "BottomNav";
