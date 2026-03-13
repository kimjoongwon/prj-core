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
		const renderIcon = () => {
			if (logoUri) {
				return (
					<img
						src={logoUri}
						alt={logoAlt ?? title}
						className="w-16 h-16 rounded-2xl mx-auto mb-4"
					/>
				);
			}

			if (icon) {
				return <div className="mx-auto mb-4">{icon}</div>;
			}

			if (iconPath) {
				return (
					<div
						className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
					>
						<svg
							className="w-8 h-8 text-white"
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

		return (
			<div className="text-center mb-8">
				{renderIcon()}
				<h1 className={`text-2xl font-bold ${titleClassName ?? ""}`}>
					{title}
				</h1>
				{subtitle && <p className="text-default-500 mt-2">{subtitle}</p>}
			</div>
		);
	},
);

AuthCardHeader.displayName = "AuthCardHeader";
