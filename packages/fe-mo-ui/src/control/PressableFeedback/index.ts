import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	PressableFeedback as HeroPressableFeedback,
	pressableFeedbackClassNames,
} from "heroui-native/pressable-feedback";

type HeroPressableFeedbackProps = ComponentPropsWithoutRef<
	typeof HeroPressableFeedback
>;

export type PressableFeedbackProps = HeroPressableFeedbackProps & {};

const PressableFeedbackComponent = forwardRef<
	ElementRef<typeof HeroPressableFeedback>,
	PressableFeedbackProps
>((props, ref) => createElement(HeroPressableFeedback, { ...props, ref }));

PressableFeedbackComponent.displayName = "PressableFeedback";

export const PressableFeedback = Object.assign(
	PressableFeedbackComponent,
	HeroPressableFeedback,
) as typeof HeroPressableFeedback;

export { pressableFeedbackClassNames };
