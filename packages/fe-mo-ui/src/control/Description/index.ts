import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Description as HeroDescription,
	descriptionClassNames,
} from "heroui-native/description";

type HeroDescriptionProps = ComponentPropsWithoutRef<typeof HeroDescription>;

export type DescriptionProps = HeroDescriptionProps & {};

const DescriptionComponent = forwardRef<
	ElementRef<typeof HeroDescription>,
	DescriptionProps
>((props, ref) => createElement(HeroDescription, { ...props, ref }));

DescriptionComponent.displayName = "Description";

export const Description = Object.assign(
	DescriptionComponent,
	HeroDescription,
) as typeof HeroDescription;

export { descriptionClassNames };
