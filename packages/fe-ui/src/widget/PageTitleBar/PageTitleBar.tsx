import type { ReactNode } from "react";
import { Text } from "../../display/data-display/Text/Text";

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
export function PageTitleBar({
	title,
	description,
	actions,
	level = 1,
	className,
}: PageTitleBarProps) {
	const headingTag = level === 2 ? "h2" : "h1";
	const headingVariant = level === 2 ? "h4" : "h2";
	const descriptionVariant = level === 2 ? "subtitle2" : "subtitle1";

	return (
		<div
			className={`flex items-start justify-between gap-4${className ? ` ${className}` : ""}`}
		>
			<div className="min-w-0 flex-1">
				<Text
					as={headingTag}
					className={level === 2 ? "font-semibold" : undefined}
					variant={headingVariant}
				>
					{title}
				</Text>
				{description && (
					<Text as="p" className="mt-1" variant={descriptionVariant}>
						{description}
					</Text>
				)}
			</div>
			{actions && <div className="shrink-0">{actions}</div>}
		</div>
	);
}
