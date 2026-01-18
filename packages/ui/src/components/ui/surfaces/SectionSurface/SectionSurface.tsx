"use client";

import { Button } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Surface, type SurfaceProps } from "../Surface/Surface";

export type SectionSurfaceProps = Omit<SurfaceProps, "as"> & {
	/** 섹션 제목 */
	title?: string;
	/** 섹션 부제목/설명 */
	subtitle?: string;
	/** 우측 액션 영역 */
	action?: ReactNode;
	/** 접기/펼치기 가능 여부 */
	collapsible?: boolean;
	/** 기본 펼침 상태 */
	defaultExpanded?: boolean;
};

/**
 * SectionSurface 컴포넌트
 * 섹션 단위로 콘텐츠를 그룹화하는 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <SectionSurface title="검색 조건" collapsible>
 *   <FilterForm />
 * </SectionSurface>
 *
 * <SectionSurface elevation="elevated" padding="none">
 *   <DataGrid ... />
 * </SectionSurface>
 * ```
 */
export const SectionSurface = observer((props: SectionSurfaceProps) => {
	const {
		children,
		title,
		subtitle,
		action,
		collapsible = false,
		defaultExpanded = true,
		elevation = "elevated",
		padding,
		className,
		...rest
	} = props;

	const state = useLocalObservable(() => ({
		isExpanded: defaultExpanded,
		toggle() {
			this.isExpanded = !this.isExpanded;
		},
	}));

	const hasHeader = title || action;

	return (
		<Surface
			elevation={elevation}
			padding="none"
			className={className}
			as="section"
			{...rest}
		>
			{hasHeader && (
				<div className="flex items-center justify-between border-b border-divider px-4 py-3">
					<div className="flex items-center gap-3">
						{collapsible && (
							<Button
								isIconOnly
								variant="light"
								size="sm"
								onPress={() => state.toggle()}
							>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${!state.isExpanded ? "-rotate-90" : ""}`}
								/>
							</Button>
						)}
						<div>
							{title && <h2 className="text-lg font-semibold">{title}</h2>}
							{subtitle && (
								<p className="text-sm text-default-500">{subtitle}</p>
							)}
						</div>
					</div>
					{action}
				</div>
			)}
			{state.isExpanded && (
				<div className={padding === "none" ? "" : "p-4"}>{children}</div>
			)}
		</Surface>
	);
});
