"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface AuthCardProps {
	/** 카드 내부 콘텐츠 */
	children: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 배경 오브 색상 변형 (기본: primary) */
	variant?: "primary" | "danger";
}

/**
 * 인증 페이지용 카드 래퍼
 *
 * 배경 블러 오브 + 중앙 정렬 카드 + 푸터를 포함합니다.
 */
export const AuthCard = observer(
	({ children, className, variant = "primary" }: AuthCardProps) => {
		const leftOrbColor =
			variant === "danger" ? "bg-danger/20" : "bg-primary/30";

		return (
			<div className="min-h-screen flex items-center justify-center relative">
				{/* 배경 블러 오브 */}
				<div
					className={`fixed bottom-0 left-0 w-[500px] h-[500px] ${leftOrbColor} rounded-full blur-3xl -translate-x-1/2 translate-y-1/2`}
				/>
				<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

				<div className="relative z-10 w-full max-w-md px-6">
					<div
						className={`bg-content1 p-8 rounded-2xl shadow-xl border border-divider ${className ?? ""}`}
					>
						{children}
					</div>

					{/* 푸터 */}
					<p className="text-center text-default-400 text-sm mt-6">
						Powered by OIDC Identity Provider
					</p>
				</div>
			</div>
		);
	},
);

AuthCard.displayName = "AuthCard";
