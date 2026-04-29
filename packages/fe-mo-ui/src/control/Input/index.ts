import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode,
} from "react";
import { observer } from "mobx-react-lite";
import { Input as HeroInput, inputClassNames } from "heroui-native/input";
import { InputGroup } from "../InputGroup";
import {
	type FieldChromeProps,
	isRenderableFieldNode,
	renderTextFieldChrome,
	resolveFieldInvalid,
} from "../../internal/fieldChrome";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroInputProps = ComponentPropsWithoutRef<typeof HeroInput>;
type InputGroupPrefixProps = ComponentPropsWithoutRef<typeof InputGroup.Prefix>;
type InputGroupSuffixProps = ComponentPropsWithoutRef<typeof InputGroup.Suffix>;

export interface PureInputProps
	extends Omit<HeroInputProps, "onBlur" | "onChange" | "onChangeText" | "value"> {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	prefix?: ReactNode;
	prefixProps?: InputGroupPrefixProps;
	suffix?: ReactNode;
	suffixProps?: InputGroupSuffixProps;
	value?: string;
}

const PureInputComponent = forwardRef<ElementRef<typeof HeroInput>, PureInputProps>(
	(
		{ onBlur, onChange, prefix, prefixProps, suffix, suffixProps, value = "", ...rest },
		ref,
	) => {
		const inputProps = {
			...rest,
			onBlur: () => {
				onBlur?.(value);
			},
			onChangeText: onChange,
			ref,
			value,
		};

		if (isRenderableFieldNode(prefix) || isRenderableFieldNode(suffix)) {
			const children: ReactNode[] = [];

			if (isRenderableFieldNode(prefix)) {
				children.push(
					createElement(
						InputGroup.Prefix,
						{ ...prefixProps, key: "prefix" },
						prefix,
					),
				);
			}

			children.push(
				createElement(InputGroup.Input, {
					...inputProps,
					key: "input",
				}),
			);

			if (isRenderableFieldNode(suffix)) {
				children.push(
					createElement(
						InputGroup.Suffix,
						{ ...suffixProps, key: "suffix" },
						suffix,
					),
				);
			}

			return createElement(
				InputGroup,
				{
					isDisabled: rest.isDisabled,
				},
				children,
			);
		}

		return createElement(HeroInput, inputProps);
	},
);

PureInputComponent.displayName = "PureInput";

export interface InputProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		FieldChromeProps,
		Omit<PureInputProps, "onBlur" | "onChange" | "value"> {}

const InputComponent = observer(<TState extends object>(props: InputProps<TState>) => {
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

	const control = createElement(PureInputComponent, {
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

InputComponent.displayName = "Input";

export const Input = InputComponent;

export { inputClassNames };
