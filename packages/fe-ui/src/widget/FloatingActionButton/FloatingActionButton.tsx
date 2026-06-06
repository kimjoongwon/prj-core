"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Button } from "../../control/Button/Button";
import { Tooltip } from "@heroui/react";

export interface FloatingActionButtonProps {
	/** 클릭 핸들러 */
	onPress: () => void;
	/** 버튼 아이콘 */
	icon: ReactNode;
	/** 호버 시 보조 아이콘 (옵션) */
	hoverIcon?: ReactNode;
	/** 툴팁 텍스트 */
	tooltip?: string;
	/** 뱃지 카운트 (0이면 숨김) */
	badgeCount?: number;
	/** 펄스 애니메이션 활성화 */
	showPulse?: boolean;
	/** 키보드 단축키 힌트 (예: "⌘K") */
	shortcutHint?: string;
	/** 위치 (기본: bottom-right) */
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** 추가 클래스명 */
	className?: string;
}

const positionClasses = {
	"bottom-right": "bottom-5 right-5",
	"bottom-left": "bottom-5 left-5",
	"top-right": "top-5 right-5",
	"top-left": "top-5 left-5",
};

/**
 * FloatingActionButton 컴포넌트
 * 화면에 고정되어 주요 액션을 제공하는 플로팅 액션 버튼(FAB)입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <FloatingActionButton
 *   icon={<Plus className="w-6 h-6" />}
 *   onPress={handleClick}
 *   tooltip="새로 만들기"
 * />
 *
 * // 뱃지와 단축키 힌트
 * <FloatingActionButton
 *   icon={<MessageCircle className="w-6 h-6" />}
 *   badgeCount={5}
 *   shortcutHint="⌘K"
 *   position="bottom-left"
 *   onPress={openChat}
 * />
 * ```
 */
export const FloatingActionButton = observer(
	({
		onPress,
		icon,
		hoverIcon,
		tooltip,
		badgeCount = 0,
		showPulse = true,
		shortcutHint,
		position = "bottom-right",
		className,
	}: FloatingActionButtonProps) => {
		const button = (
			<Button
				onPress={onPress}
				className={`group relative size-14 min-w-0 rounded-full bg-gradient-to-br from-accent to-default p-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${className ?? ""}`}
			>
				{/* 아이콘 */}
				<div className="relative">
					<div className="text-white transition-transform group-hover:scale-110">
						{icon}
					</div>
					{hoverIcon && (
						<div className="absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100">
							{hoverIcon}
						</div>
					)}
				</div>

				{/* 뱃지 */}
				{badgeCount > 0 && (
					<span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
						{badgeCount > 9 ? "9+" : badgeCount}
					</span>
				)}

				{/* 펄스 애니메이션 */}
				{showPulse && (
					<span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20" />
				)}
			</Button>
		);

		return (
			<div className={`fixed z-40 ${positionClasses[position]}`}>
					{tooltip ? (
						<Tooltip>
							<Tooltip.Trigger>{button}</Tooltip.Trigger>
							<Tooltip.Content placement="left">{tooltip}</Tooltip.Content>
						</Tooltip>
					) : (
					button
				)}

				{/* 키보드 단축키 힌트 */}
				{shortcutHint && (
					<div className="mt-2 text-center">
						<span className="rounded bg-surface-secondary px-1.5 py-0.5 text-xs text-muted">
							{shortcutHint}
						</span>
					</div>
				)}
			</div>
		);
	},
);
