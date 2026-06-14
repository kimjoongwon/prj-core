"use client";

import {
	cn,
	Surface as HeroSurface,
	type SurfaceProps as HeroSurfaceProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

export type SurfaceProps = HeroSurfaceProps;

const DEFAULT_SURFACE_VARIANT: NonNullable<SurfaceProps["variant"]> =
	"tertiary";

/**
 * feature/widget 내부의 국소 패널 표면을 제공합니다.
 * page-level 표면은 route가 `ScreenSurface`, screen이 `SectionSurface`로 나누어 구성합니다.
 */
export const Surface = observer(function Surface({
	children,
	variant = DEFAULT_SURFACE_VARIANT,
	className,
	...props
}: SurfaceProps) {
	const t = useT();

	return (
		<HeroSurface
			className={cn("w-full rounded-xl", className)}
			variant={variant}
			{...props}
		>
			{translateNode(children, t)}
		</HeroSurface>
	);
});

Surface.displayName = "Surface";
