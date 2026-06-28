import {
	cn,
	Surface as HeroSurface,
	surfaceClassNames,
	useSurface,
	type SurfaceVariant,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";

type HeroSurfaceProps = ComponentPropsWithoutRef<typeof HeroSurface>;
export type SurfaceProps = HeroSurfaceProps & {};
const DEFAULT_SURFACE_VARIANT: NonNullable<SurfaceProps["variant"]> =
	"secondary";
const SURFACE_VARIANT_CLASS_NAMES: Partial<Record<SurfaceVariant, string>> = {
	default:
		"border border-border bg-white text-foreground shadow-surface dark:border-white/10 dark:bg-neutral-700 dark:text-foreground dark:shadow-none",
	secondary:
		"border border-border bg-white text-foreground shadow-surface dark:border-white/10 dark:bg-neutral-700/95 dark:text-foreground dark:shadow-none",
	tertiary:
		"border border-border bg-neutral-50 text-foreground shadow-none dark:border-white/10 dark:bg-neutral-600/90 dark:text-foreground",
	transparent: "bg-transparent text-foreground shadow-none",
};

/**
 * feature/widget 내부의 국소 패널 표면을 제공합니다.
 * 모바일에서도 웹 Surface와 같은 밝은 기본 팔레트를 유지합니다.
 */
const SurfaceComponent = forwardRef<
	ComponentRef<typeof HeroSurface>,
	SurfaceProps
>(
	(
		{
			className,
			variant = DEFAULT_SURFACE_VARIANT,
			...props
		},
		ref,
	) => (
		<HeroSurface
			{...props}
			className={cn(SURFACE_VARIANT_CLASS_NAMES[variant], className)}
			ref={ref}
			variant={variant}
		/>
	),
);
SurfaceComponent.displayName = "Surface";
export const Surface = SurfaceComponent as typeof HeroSurface;
export { surfaceClassNames, useSurface };
