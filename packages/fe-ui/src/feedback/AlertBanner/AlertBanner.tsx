"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

export type AlertBannerType = "danger" | "warning" | "success" | "info";

export interface AlertBannerProps {
	/** 배너 타입 */
	type: AlertBannerType;
	/** 제목 (굵은 텍스트) */
	title?: string;
	/** 메시지 내용 */
	message: ReactNode;
	/** 추가 액션 영역 */
	actions?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

/** 타입별 스타일 매핑 */
const STYLES: Record<
	AlertBannerType,
	{ bg: string; border: string; text: string; iconPath: string }
> = {
	danger: {
		bg: "bg-danger/20",
		border: "border-danger/50",
		text: "text-danger",
		iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
	},
	warning: {
		bg: "bg-warning/20",
		border: "border-warning/50",
		text: "text-warning",
		iconPath:
			"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
	},
	success: {
		bg: "bg-success/20",
		border: "border-success/50",
		text: "text-success",
		iconPath: "M5 13l4 4L19 7",
	},
	info: {
		bg: "bg-accent/20",
		border: "border-accent/50",
		text: "text-accent",
		iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
	},
};

/**
 * 알림 배너 컴포넌트
 *
 * 에러, 경고, 성공, 정보 메시지를 배너 형태로 표시합니다.
 */
export const AlertBanner = observer(
	({ type, title, message, actions, className }: AlertBannerProps) => {
		const t = useT();
		const style = STYLES[type];

		return (
			<div
				className={`${style.bg} border ${style.border} ${style.text} p-4 rounded-lg mb-6 ${className ?? ""}`}
			>
				{title ? (
					<>
						<div className="flex items-center gap-2 font-semibold mb-1">
							<svg
								className="w-5 h-5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={style.iconPath}
								/>
							</svg>
							{t(title)}
						</div>
						<p className="text-sm">{translateNode(message, t)}</p>
					</>
				) : (
					<div className="flex items-center gap-2 text-sm">
						<svg
							className="w-5 h-5 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={style.iconPath}
							/>
						</svg>
						{translateNode(message, t)}
					</div>
				)}
				{actions && <div className="mt-2">{actions}</div>}
			</div>
		);
	},
);

AlertBanner.displayName = "AlertBanner";
