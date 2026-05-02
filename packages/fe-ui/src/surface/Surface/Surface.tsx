"use client";

import { cva } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	elevation as elevationTokens,
	type ElevationLevel,
} from "../../design-system/theme/tokens";
import { translateNode, useT } from "../../i18n";

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
			flat: `${elevationTokens.flat.background} ${elevationTokens.flat.shadow}`.trim(),
			raised:
				`${elevationTokens.raised.background} ${elevationTokens.raised.shadow}`.trim(),
			elevated:
				`${elevationTokens.elevated.background} ${elevationTokens.elevated.shadow} ${elevationTokens.elevated.border}`.trim(),
			floating:
				`${elevationTokens.floating.background} ${elevationTokens.floating.shadow}`.trim(),
			overlay:
				`${elevationTokens.overlay.background} ${elevationTokens.overlay.shadow}`.trim(),
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
