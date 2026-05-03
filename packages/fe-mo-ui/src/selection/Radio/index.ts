import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Radio as HeroRadio, radioClassNames, useRadio } from "heroui-native/radio";

type HeroRadioProps = ComponentPropsWithoutRef<typeof HeroRadio>;

export type RadioProps = HeroRadioProps & {};

const RadioComponent = forwardRef<ElementRef<typeof HeroRadio>, RadioProps>(
	(props, ref) => createElement(HeroRadio, { ...props, ref }),
);

RadioComponent.displayName = "Radio";

export const Radio = Object.assign(RadioComponent, HeroRadio) as typeof HeroRadio;

export { radioClassNames, useRadio };
