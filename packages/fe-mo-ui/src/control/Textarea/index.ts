import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { observer } from "mobx-react-lite";
import {
	TextArea as HeroTextArea,
	textAreaClassNames,
} from "heroui-native/text-area";
import {
	type FieldChromeProps,
	renderTextFieldChrome,
	resolveFieldInvalid,
} from "../../internal/fieldChrome";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroTextAreaProps = ComponentPropsWithoutRef<typeof HeroTextArea>;

export interface PureTextareaProps
	extends Omit<
		HeroTextAreaProps,
		"onBlur" | "onChange" | "onChangeText" | "value"
	> {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}

const PureTextareaComponent = forwardRef<
	ElementRef<typeof HeroTextArea>,
	PureTextareaProps
>(({ onBlur, onChange, value = "", ...rest }, ref) =>
	createElement(HeroTextArea, {
		...rest,
		onBlur: () => {
			onBlur?.(value);
		},
		onChangeText: onChange,
		ref,
		value,
	}),
);

PureTextareaComponent.displayName = "PureTextarea";

export interface TextareaProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		FieldChromeProps,
		Omit<PureTextareaProps, "onBlur" | "onChange" | "value"> {}

const TextareaComponent = observer(<TState extends object>(props: TextareaProps<TState>) => {
	const {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
		path,
		state,
		...rest
	} = props;
	const field = useMobxField({ fallback: "", path, state });
	const fieldChrome = {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
	};
	const resolvedInvalid = resolveFieldInvalid(fieldChrome);

	const control = createElement(PureTextareaComponent, {
		...rest,
		isDisabled,
		isInvalid: resolvedInvalid,
		onBlur: field.setValue,
		onChange: field.setValue,
		value: field.value,
	});

	return renderTextFieldChrome(
		{
			...fieldChrome,
			isInvalid: resolvedInvalid,
		},
		control,
	);
});

TextareaComponent.displayName = "Textarea";

export const Textarea = TextareaComponent;
export const TextArea = Textarea;

export { textAreaClassNames };
