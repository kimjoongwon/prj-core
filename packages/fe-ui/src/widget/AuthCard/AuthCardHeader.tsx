"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface AuthCardHeaderProps {
	/** SVG path 또는 커스텀 아이콘 ReactNode */
	icon?: ReactNode;
	/** 아이콘 영역 SVG path (간편 사용) */
	iconPath?: string;
	/** 아이콘 그라데이션 색상 (기본: from-primary to-secondary) */
	iconGradient?: string;
	/** 제목 */
	title: string;
	/** 제목 색상 클래스 (예: text-danger) */
	titleClassName?: string;
	/** 부제목 */
	subtitle?: string;
	/** 로고 URI (아이콘 대신 이미지 사용) */
	logoUri?: string;
	/** 로고/아이콘의 alt 텍스트 */
	logoAlt?: string;
}

/**
 * 인증 카드 헤더
 *
 * 아이콘(또는 로고) + 제목 + 부제목으로 구성된 인증 페이지 상단 영역입니다.
 */
export const AuthCardHeader = observer(
	({
		icon,
		iconPath,
		iconGradient = "from-primary to-secondary",
		title,
		titleClassName,
		subtitle,
		logoUri,
		logoAlt,
	}: AuthCardHeaderProps) => {
		const renderVisual = () => {
			if (logoUri) {
				return (
					<img
						src={logoUri}
						alt={logoAlt ?? title}
						className="h-12 w-12 rounded-2xl border border-default-200 object-cover shadow-sm"
					/>
				);
			}

			if (icon) {
				return (
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-default-200 bg-default-50 shadow-sm">
						{icon}
					</div>
				);
			}

			if (iconPath) {
				return (
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradient} shadow-sm`}
					>
						<svg
							className="h-6 w-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={iconPath}
							/>
						</svg>
					</div>
				);
			}

			return null;
		};

		const visual = renderVisual();

		return (
			<div className="mb-8 flex items-start gap-4">
				{visual && <div className="shrink-0">{visual}</div>}
				<div className="min-w-0">
					<h1
						className={`text-2xl font-semibold tracking-tight text-foreground ${titleClassName ?? ""}`}
					>
						{title}
					</h1>
					{subtitle && (
						<p className="mt-2 text-sm leading-6 text-default-500">
							{subtitle}
						</p>
					)}
				</div>
			</div>
		);
	},
);

AuthCardHeader.displayName = "AuthCardHeader";
