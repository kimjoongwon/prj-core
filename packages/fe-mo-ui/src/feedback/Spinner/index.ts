import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Spinner as HeroSpinner, spinnerClassNames } from "heroui-native/spinner";

type HeroSpinnerProps = ComponentPropsWithoutRef<typeof HeroSpinner>;

export type SpinnerProps = HeroSpinnerProps & {};

const SpinnerComponent = forwardRef<ElementRef<typeof HeroSpinner>, SpinnerProps>(
	(props, ref) => createElement(HeroSpinner, { ...props, ref }),
);

SpinnerComponent.displayName = "Spinner";

export const Spinner = Object.assign(
	SpinnerComponent,
	HeroSpinner,
) as typeof HeroSpinner;

export { spinnerClassNames };
