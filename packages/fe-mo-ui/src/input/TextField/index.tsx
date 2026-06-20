import {
	descriptionClassNames,
	Description as HeroDescription,
} from "heroui-native/description";
import {
	fieldErrorClassNames,
	FieldError as HeroFieldError,
} from "heroui-native/field-error";
import {
	InputGroup as HeroInputGroup,
	inputGroupClassNames,
} from "heroui-native/input-group";
import { Label as HeroLabel, labelClassNames } from "heroui-native/label";
import {
	TextField as HeroTextField,
	textFieldClassNames,
	useTextField,
} from "heroui-native/text-field";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { Input } from "../Input";
import { Textarea } from "../Textarea";

type HeroTextFieldProps = ComponentPropsWithoutRef<typeof HeroTextField>;

export type TextFieldProps = HeroTextFieldProps & {};

const TextFieldComponent = forwardRef<
	ComponentRef<typeof HeroTextField>,
	TextFieldProps
>((props, ref) => <HeroTextField {...props} ref={ref} />);
TextFieldComponent.displayName = "TextField";

export const TextField = Object.assign(TextFieldComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroInputGroup,
	Input,
	InputGroup: HeroInputGroup,
	Label: HeroLabel,
	Textarea,
}) as typeof TextFieldComponent & {
	Description: typeof HeroDescription;
	Error: typeof HeroFieldError;
	FieldError: typeof HeroFieldError;
	Group: typeof HeroInputGroup;
	Input: typeof Input;
	InputGroup: typeof HeroInputGroup;
	Label: typeof HeroLabel;
	Textarea: typeof Textarea;
};

export {
	descriptionClassNames,
	fieldErrorClassNames,
	inputGroupClassNames,
	labelClassNames,
	textFieldClassNames,
	useTextField,
};
