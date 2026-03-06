"use client";

import { Button } from "@heroui/react";
import { icons, type LucideIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ActionFabProps } from "./type";

function renderLucideIcon(
	iconName?: string,
	className?: string,
	size: number = 16,
) {
	if (!iconName) return null;

	const IconComponent = icons[iconName as keyof typeof icons] as
		| LucideIcon
		| undefined;

	if (!IconComponent) {
		console.warn(`Icon "${iconName}" not found in lucide-react`);
		return null;
	}

	return <IconComponent className={className} size={size} />;
}

/**
 * ActionFab - 모바일 Floating Action Button (v7.0 신규)
 *
 * 기획서 참조: 02-mobile.md
 * - 클릭 시 팬 형태로 3개 액션 확장
 * - 오늘 예약, 빠른 예약, 회원 검색
 *
 * @example
 * ```tsx
 * <ActionFab
 *   isOpen={isFABOpen}
 *   actions={[
 *     { id: 'todayReservation', label: '오늘 예약', icon: 'CalendarCheck', subject: 'quickAction:todayReservation', href: '/reservations/today' },
 *     { id: 'quickReservation', label: '빠른 예약', icon: 'CalendarPlus', subject: 'quickAction:quickReservation', modal: 'quickReservation' },
 *   ]}
 *   onToggle={() => setIsFABOpen(!isFABOpen)}
 *   onActionClick={(actionId) => handleActionClick(actionId)}
 * />
 * ```
 */
export const ActionFab = observer(function ActionFab({
	isOpen,
	actions,
	onToggle,
	onActionClick,
}: ActionFabProps) {
	const handleToggle = () => {
		onToggle();
	};

	const handleActionClick = (actionId: string) => {
		onActionClick(actionId);
	};

	return (
		<div className="fixed right-4 bottom-20 z-50 md:hidden">
			{/* FAB 액션 버튼들 (팬 형태로 확장) */}
			<div
				className={`absolute right-0 bottom-16 flex flex-col items-end gap-3 transition-all duration-300 ${
					isOpen
						? "pointer-events-auto translate-y-0 opacity-100"
						: "pointer-events-none translate-y-4 opacity-0"
				}`}
			>
				{actions.map((action, index) => (
					<div
						key={action.id}
						className="flex items-center gap-2"
						style={{
							transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
						}}
					>
						{/* 라벨 */}
						<span className="rounded-lg bg-content1 px-3 py-1.5 font-medium text-foreground text-sm shadow-md">
							{action.label}
						</span>

						{/* 액션 버튼 */}
						<Button
							isIconOnly
							color="primary"
							variant="shadow"
							size="md"
							className="h-12 w-12 rounded-full"
							onPress={() => handleActionClick(action.id)}
							aria-label={action.label}
						>
							{renderLucideIcon(action.icon, "text-primary-foreground", 20)}
						</Button>
					</div>
				))}
			</div>

			{/* 오버레이 (FAB 열렸을 때 배경 클릭으로 닫기) */}
			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 -z-10 cursor-default bg-transparent"
					onClick={handleToggle}
					onKeyDown={(e) => e.key === "Escape" && handleToggle()}
					aria-label="Close FAB menu"
				/>
			)}

			{/* 메인 FAB 버튼 */}
			<Button
				isIconOnly
				color="primary"
				variant="shadow"
				size="lg"
				className="h-14 w-14 rounded-full shadow-lg"
				onPress={handleToggle}
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
			>
				{renderLucideIcon(
					isOpen ? "X" : "Zap",
					`text-primary-foreground transition-transform duration-200 ${
						isOpen ? "rotate-90" : "rotate-0"
					}`,
					24,
				)}
			</Button>
		</div>
	);
});

ActionFab.displayName = "ActionFab";
