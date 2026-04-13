import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Surface as HeroSurface, surfaceClassNames, useSurface } from "heroui-native/surface";

type HeroSurfaceProps = ComponentPropsWithoutRef<typeof HeroSurface>;

export type SurfaceProps = HeroSurfaceProps & {};

const SurfaceComponent = forwardRef<ElementRef<typeof HeroSurface>, SurfaceProps>(
	(props, ref) => createElement(HeroSurface, { ...props, ref }),
);

SurfaceComponent.displayName = "Surface";

export const Surface = Object.assign(
	SurfaceComponent,
	HeroSurface,
) as typeof HeroSurface;

export { surfaceClassNames, useSurface };
