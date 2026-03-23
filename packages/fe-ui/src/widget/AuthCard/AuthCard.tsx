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
				? "border-danger/30 bg-danger/5 shadow-[0_20px_60px_-32px_rgba(220,38,38,0.28)]"
				: "border-default-200/80 bg-content1 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.24)]";

		return (
			<section
				className={`w-full rounded-[28px] border p-6 backdrop-blur-sm sm:p-8 ${toneClass} ${className ?? ""}`}
			>
				{children}
			</section>
		);
	},
);

AuthCard.displayName = "AuthCard";
