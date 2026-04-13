import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	InputGroup as HeroInputGroup,
	inputGroupClassNames,
} from "heroui-native/input-group";

type HeroInputGroupProps = ComponentPropsWithoutRef<typeof HeroInputGroup>;

export type InputGroupProps = HeroInputGroupProps & {};

const InputGroupComponent = forwardRef<
	ElementRef<typeof HeroInputGroup>,
	InputGroupProps
>((props, ref) => createElement(HeroInputGroup, { ...props, ref }));

InputGroupComponent.displayName = "InputGroup";

export const InputGroup = Object.assign(
	InputGroupComponent,
	HeroInputGroup,
) as typeof HeroInputGroup;

export { inputGroupClassNames };
