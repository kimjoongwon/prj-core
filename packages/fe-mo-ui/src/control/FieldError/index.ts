import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	FieldError as HeroFieldError,
	fieldErrorClassNames,
} from "heroui-native/field-error";

type HeroFieldErrorProps = ComponentPropsWithoutRef<typeof HeroFieldError>;

export type FieldErrorProps = HeroFieldErrorProps & {};

const FieldErrorComponent = forwardRef<
	ElementRef<typeof HeroFieldError>,
	FieldErrorProps
>((props, ref) => createElement(HeroFieldError, { ...props, ref }));

FieldErrorComponent.displayName = "FieldError";

export const FieldError = Object.assign(
	FieldErrorComponent,
	HeroFieldError,
) as typeof HeroFieldError;

export { fieldErrorClassNames };
