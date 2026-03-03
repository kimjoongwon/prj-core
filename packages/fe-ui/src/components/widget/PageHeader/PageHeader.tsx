import type { ReactNode } from "react";

export interface PageHeaderProps {
	/** 페이지 제목 (h1) */
	title: ReactNode;
	/** 페이지 설명 */
	description?: ReactNode;
	/** 우측 액션 영역 */
	actions?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * PageHeader 컴포넌트
 * 페이지 상단 제목/설명/액션 영역의 반복 마크업을 표준화합니다.
 */
export function PageHeader({
	title,
	description,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={`flex items-start justify-between gap-4${className ? ` ${className}` : ""}`}
		>
			<div>
				<h1>{title}</h1>
				{description && <p>{description}</p>}
			</div>
			{actions && <div>{actions}</div>}
		</div>
	);
}
