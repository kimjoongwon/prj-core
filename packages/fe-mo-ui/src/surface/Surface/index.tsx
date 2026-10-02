import {
	Surface as HeroSurface,
	surfaceClassNames,
	useSurface,
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

/**
 * feature/widget 내부의 국소 패널 표면을 제공합니다.
 * 색은 heroui-native surface 변형 토큰과 앱의 OKLCH 램프가 소유합니다.
 */
const SurfaceComponent = forwardRef<
	ComponentRef<typeof HeroSurface>,
	SurfaceProps
>(({ className, variant = DEFAULT_SURFACE_VARIANT, ...props }, ref) => (
	<HeroSurface {...props} className={className} ref={ref} variant={variant} />
));
SurfaceComponent.displayName = "Surface";
export const Surface = SurfaceComponent as typeof HeroSurface;
export { surfaceClassNames, useSurface };
