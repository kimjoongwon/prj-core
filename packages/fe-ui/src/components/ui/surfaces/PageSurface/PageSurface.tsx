"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Surface, type SurfaceProps } from "../Surface/Surface";

export type PageSurfaceProps = Omit<SurfaceProps, "elevation"> & {
	/** 페이지 제목 */
	title?: string;
	/** 페이지 설명 */
	description?: string;
	/** 우측 상단 액션 영역 (버튼 등) */
	actions?: ReactNode;
};

/**
 * PageSurface 컴포넌트
 * 페이지 전체 콘텐츠를 감싸는 래퍼 컴포넌트입니다.
 * elevation은 "raised"로 고정됩니다.
 *
 * @example
 * ```tsx
 * <PageSurface
 *   title="회원 목록"
 *   description="시스템에 등록된 회원을 관리합니다."
 *   actions={<Button>회원 등록</Button>}
 * >
 *   <DataGrid ... />
 * </PageSurface>
 * ```
 */
export const PageSurface = observer((props: PageSurfaceProps) => {
	const { children, title, description, actions, className, padding, ...rest } =
		props;

	const hasHeader = title || actions;

	return (
		<Surface
			elevation="raised"
			padding="none"
			className={className}
			as="section"
			{...rest}
		>
			{hasHeader && (
				<div className="flex items-center justify-between border-b border-divider px-6 py-4">
					<div>
						{title && <h1 className="text-2xl font-bold">{title}</h1>}
						{description && (
							<p className="mt-1 text-sm text-default-500">{description}</p>
						)}
					</div>
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			)}
			<div className={padding === "none" ? "" : "p-6"}>{children}</div>
		</Surface>
	);
});
