import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Label as HeroLabel, labelClassNames, useLabel } from "heroui-native/label";

type HeroLabelProps = ComponentPropsWithoutRef<typeof HeroLabel>;

export type LabelProps = HeroLabelProps & {};

const LabelComponent = forwardRef<ElementRef<typeof HeroLabel>, LabelProps>(
	(props, ref) => createElement(HeroLabel, { ...props, ref }),
);

LabelComponent.displayName = "Label";

export const Label = Object.assign(LabelComponent, HeroLabel) as typeof HeroLabel;

export { labelClassNames, useLabel };
