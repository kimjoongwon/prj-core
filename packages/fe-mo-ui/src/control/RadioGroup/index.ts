import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode,
} from "react";
import { observer } from "mobx-react-lite";
import {
	RadioGroup as HeroRadioGroup,
	radioGroupClassNames,
	useRadioGroup,
	useRadioGroupItem,
} from "heroui-native/radio-group";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroRadioGroupProps = ComponentPropsWithoutRef<typeof HeroRadioGroup>;

export interface RadioOption {
	description?: string;
	isDisabled?: boolean;
	text: ReactNode;
	value: string;
}

export interface PureRadioGroupProps
	extends Omit<HeroRadioGroupProps, "children"> {
	children?: ReactNode;
	options?: RadioOption[];
}

const PureRadioGroupComponent = forwardRef<
	ElementRef<typeof HeroRadioGroup>,
	PureRadioGroupProps
>(({ children, options = [], ...rest }, ref) =>
	createElement(
		HeroRadioGroup,
		{
			...rest,
			ref,
		},
		children ??
			options.map((option) =>
				createElement(
					HeroRadioGroup.Item,
					{
						isDisabled: option.isDisabled,
						key: option.value,
						value: option.value,
					},
					option.text,
				),
			),
	),
);

PureRadioGroupComponent.displayName = "PureRadioGroup";

export interface RadioGroupProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureRadioGroupProps, "onValueChange" | "value"> {}

const RadioGroupComponent = observer(
	<TState extends object>(props: RadioGroupProps<TState>) => {
		const { options = [], path, state, ...rest } = props;
		const fallback = options[0]?.value ?? "";
		const field = useMobxField({ fallback, path, state });

		return createElement(PureRadioGroupComponent, {
			...rest,
			onValueChange: field.setValue,
			options,
			value: field.value,
		});
	},
);

RadioGroupComponent.displayName = "RadioGroup";

export const RadioGroup = Object.assign(RadioGroupComponent, {
	Item: HeroRadioGroup.Item,
}) as typeof RadioGroupComponent & Pick<typeof HeroRadioGroup, "Item">;

export { radioGroupClassNames, useRadioGroup, useRadioGroupItem };
