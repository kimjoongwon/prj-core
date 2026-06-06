"use client";

import { cva } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { translateNode, useT } from "../../i18n";
import { surfaceElevations } from "./Surface.elevation";
import type { ElevationLevel } from "./SurfaceElevation.type";

export type SurfacePadding = "none" | "sm" | "md" | "lg";
export const DEFAULT_SURFACE_PADDING: SurfacePadding = "md";

const DEFAULT_SURFACE_ELEVATION: ElevationLevel = "elevated";

export interface SurfaceProps {
	/** 표면 내부 콘텐츠 */
	children: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 엘리베이션 단계 */
	elevation?: ElevationLevel;
	/** 내부 패딩 */
	padding?: SurfacePadding;
}

const surfaceVariants = cva("w-full rounded-xl", {
	variants: {
		elevation: {
			flat: `${surfaceElevations.flat.background} ${surfaceElevations.flat.shadow}`.trim(),
			raised:
				`${surfaceElevations.raised.background} ${surfaceElevations.raised.shadow}`.trim(),
			elevated:
				`${surfaceElevations.elevated.background} ${surfaceElevations.elevated.shadow} ${surfaceElevations.elevated.border}`.trim(),
			floating:
				`${surfaceElevations.floating.background} ${surfaceElevations.floating.shadow}`.trim(),
			overlay:
				`${surfaceElevations.overlay.background} ${surfaceElevations.overlay.shadow}`.trim(),
		},
		padding: {
			none: "p-0",
			sm: "p-4",
			md: "p-6",
			lg: "p-8",
		},
	},
	defaultVariants: {
		elevation: DEFAULT_SURFACE_ELEVATION,
		padding: DEFAULT_SURFACE_PADDING,
	},
});

/**
 * Surface 컴포넌트
 * 콘텐츠가 올라갈 시각적 표면과 엘리베이션을 담당합니다.
 */
export const Surface = observer(function Surface({
	children,
	className,
	elevation = DEFAULT_SURFACE_ELEVATION,
	padding = DEFAULT_SURFACE_PADDING,
}: SurfaceProps) {
	const t = useT();

	return (
		<div className={surfaceVariants({ elevation, padding, className })}>
			{translateNode(children, t)}
		</div>
	);
});

Surface.displayName = "Surface";
