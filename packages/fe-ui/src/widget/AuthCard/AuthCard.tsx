"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface AuthCardProps {
	/** 카드 내부 콘텐츠 */
	children: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 상태별 카드 강조 색상 */
	variant?: "primary" | "danger";
}

/**
 * 인증 페이지용 카드 래퍼
 *
 * 인증 화면 내부 패널만 담당합니다.
 */
export const AuthCard = observer(
	({ children, className, variant = "primary" }: AuthCardProps) => {
		const toneClass =
			variant === "danger"
				? "border-danger/35 bg-white/92 text-slate-950 ring-1 ring-danger/10 shadow-[0_20px_60px_-32px_rgba(220,38,38,0.20)] dark:border-danger/40 dark:bg-slate-950/92 dark:text-slate-50 dark:ring-danger/15 dark:shadow-[0_24px_72px_-36px_rgba(248,113,113,0.22)]"
				: "border-slate-200/80 bg-white/92 text-slate-950 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950/92 dark:text-slate-50 dark:shadow-[0_24px_72px_-40px_rgba(0,0,0,0.72)]";

		return (
			<section
				className={`w-full rounded-[28px] border p-6 backdrop-blur-xl sm:p-8 ${toneClass} ${className ?? ""}`}
			>
				{children}
			</section>
		);
	},
);

AuthCard.displayName = "AuthCard";
