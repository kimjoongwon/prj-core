"use client";

import {
	cn,
	Surface as HeroSurface,
	type SurfaceProps as HeroSurfaceProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

export type SurfaceProps = HeroSurfaceProps;

type SurfaceVariant = NonNullable<SurfaceProps["variant"]>;

const DEFAULT_SURFACE_VARIANT: NonNullable<SurfaceProps["variant"]> =
	"secondary";

const SURFACE_VARIANT_CLASS_NAMES: Partial<Record<SurfaceVariant, string>> = {
	default:
		"border border-border bg-surface text-surface-foreground shadow-none",
	secondary:
		"border border-border bg-surface text-surface-foreground shadow-none",
	tertiary:
		"border border-border bg-surface-secondary text-surface-secondary-foreground shadow-none",
	transparent: "bg-transparent text-foreground shadow-none",
};

/**
 * feature/widget 내부의 국소 패널 표면을 제공합니다.
 * ScreenSurface/SectionSurface보다 작은 local panel 표면입니다.
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
			className={cn(
				"w-full rounded-xl",
				SURFACE_VARIANT_CLASS_NAMES[variant],
				className,
			)}
			variant={variant}
			{...props}
		>
			{translateNode(children, t)}
		</HeroSurface>
	);
});

Surface.displayName = "Surface";
