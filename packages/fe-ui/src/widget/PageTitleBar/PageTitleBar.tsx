"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { translateNode, useT } from "../../i18n";

export interface PageTitleBarProps {
	/** 제목 */
	title: ReactNode;
	/** 설명 */
	description?: ReactNode;
	/** 우측 액션 영역 */
	actions?: ReactNode;
	/** 제목 레벨 (기본: 1) */
	level?: 1 | 2;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * PageTitleBar 컴포넌트
 * 페이지/섹션 상단 제목/설명/액션 영역의 반복 마크업을 표준화합니다.
 */
export const PageTitleBar = observer(function PageTitleBar({
	title,
	description,
	actions,
	level = 1,
	className,
}: PageTitleBarProps) {
	const t = useT();

	return (
		<div
			className={`flex items-start justify-between gap-4${className ? ` ${className}` : ""}`}
		>
			<div className="min-w-0 flex-1">
				<Typography.Heading
					className={level === 2 ? "font-semibold" : undefined}
					level={level === 2 ? 2 : 1}
				>
					{translateNode(title, t)}
				</Typography.Heading>
				{description && (
					<Typography.Paragraph
						className="mt-1"
						color="muted"
						size={level === 2 ? "sm" : "base"}
					>
						{translateNode(description, t)}
					</Typography.Paragraph>
				)}
			</div>
			{actions && <div className="shrink-0">{actions}</div>}
		</div>
	);
});
