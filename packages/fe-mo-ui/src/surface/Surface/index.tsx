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
const SurfaceComponent = forwardRef<
	ComponentRef<typeof HeroSurface>,
	SurfaceProps
>((props, ref) => <HeroSurface {...props} ref={ref} />);
SurfaceComponent.displayName = "Surface";
export const Surface = Object.assign(
	SurfaceComponent,
	HeroSurface,
) as typeof HeroSurface;
export { surfaceClassNames, useSurface };
