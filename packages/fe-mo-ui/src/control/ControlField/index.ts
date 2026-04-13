import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	ControlField as HeroControlField,
	controlFieldClassNames,
	useControlField,
} from "heroui-native/control-field";

type HeroControlFieldProps = ComponentPropsWithoutRef<typeof HeroControlField>;

export type ControlFieldProps = HeroControlFieldProps & {};

const ControlFieldComponent = forwardRef<
	ElementRef<typeof HeroControlField>,
	ControlFieldProps
>((props, ref) => createElement(HeroControlField, { ...props, ref }));

ControlFieldComponent.displayName = "ControlField";

export const ControlField = Object.assign(
	ControlFieldComponent,
	HeroControlField,
) as typeof HeroControlField;

export { controlFieldClassNames, useControlField };
