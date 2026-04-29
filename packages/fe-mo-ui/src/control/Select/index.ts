import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode,
} from "react";
import { observer } from "mobx-react-lite";
import {
	Select as HeroSelect,
	selectClassNames,
	useSelect,
	useSelectAnimation,
	useSelectItem,
} from "heroui-native/select";
import {
	type FieldChromeProps,
	renderTextFieldChrome,
	resolveFieldInvalid,
} from "../../internal/fieldChrome";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroSelectProps = ComponentPropsWithoutRef<typeof HeroSelect>;
type HeroSelectCloseProps = ComponentPropsWithoutRef<typeof HeroSelect.Close>;

export interface SelectOption {
	description?: ReactNode;
	isDisabled?: boolean;
	label: string;
	value: string;
}

export interface PureSelectProps
	extends Omit<HeroSelectProps, "children" | "onValueChange" | "value"> {
	children?: ReactNode;
	closeProps?: HeroSelectCloseProps;
	listLabel?: ReactNode;
	onChange?: (value: string) => void;
	options?: SelectOption[];
	placeholder?: string;
	value?: string;
}

function toHeroSelectValue(option?: SelectOption) {
	if (!option) {
		return undefined;
	}

	return {
		label: option.label,
		value: option.value,
	};
}

const PureSelectComponent = forwardRef<ElementRef<typeof HeroSelect>, PureSelectProps>(
	(
		{
			children,
			closeProps,
			listLabel,
			onChange,
			options = [],
			placeholder = "Select an option",
			presentation = "popover",
			value,
			...rest
		},
		ref,
	) => {
		const selectedOption = options.find((option) => option.value === value);

		const handleValueChange: NonNullable<HeroSelectProps["onValueChange"]> = (
			nextValue:
				| Array<{ label: string; value: string } | undefined>
				| { label: string; value: string }
				| undefined,
		) => {
			if (Array.isArray(nextValue)) {
				onChange?.(nextValue[0]?.value ?? "");
				return;
			}

			onChange?.(nextValue?.value ?? "");
		};

		const contentChildren = [
			listLabel
				? createElement(HeroSelect.ListLabel, { key: "list-label" }, listLabel)
				: null,
			...options.map((option) =>
				createElement(
						HeroSelect.Item,
						{
							disabled: option.isDisabled,
							key: option.value,
							label: option.label,
							value: option.value,
						},
					[
						createElement(
							HeroSelect.ItemLabel,
							{ key: `${option.value}-label` },
							option.label,
						),
						option.description
							? createElement(
									HeroSelect.ItemDescription,
									{ key: `${option.value}-description` },
									option.description,
								)
							: null,
						createElement(HeroSelect.ItemIndicator, {
							key: `${option.value}-indicator`,
						}),
					],
				),
			),
			closeProps ? createElement(HeroSelect.Close, { key: "close", ...closeProps }) : null,
		].filter(Boolean) as ReactNode[];

		const defaultChildren = [
			createElement(HeroSelect.Trigger, { key: "trigger" }, [
				createElement(HeroSelect.Value, {
					key: "value",
					placeholder,
				}),
				createElement(HeroSelect.TriggerIndicator, { key: "indicator" }),
			]),
			createElement(HeroSelect.Portal, {
				children: [
					createElement(HeroSelect.Overlay, { key: "overlay" }),
					createElement(
						HeroSelect.Content,
						{
							key: "content",
							presentation,
						},
						contentChildren,
					),
				],
				key: "portal",
			}),
		];

		return createElement(
			HeroSelect,
			{
				...rest,
				onValueChange: handleValueChange,
				presentation,
				ref,
				value: toHeroSelectValue(selectedOption),
			},
			children ?? defaultChildren,
		);
	},
);

PureSelectComponent.displayName = "PureSelect";

export interface SelectProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		FieldChromeProps,
		Omit<PureSelectProps, "onChange" | "value"> {}

const SelectComponent = observer(<TState extends object>(props: SelectProps<TState>) => {
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
		options = [],
		path,
		state,
		...rest
	} = props;
	const fallback = options[0]?.value ?? "";
	const field = useMobxField({ fallback, path, state });
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

	const control = createElement(PureSelectComponent, {
		...rest,
		isDisabled,
		onChange: field.setValue,
		options,
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

SelectComponent.displayName = "Select";

export const Select = Object.assign(SelectComponent, {
	Close: HeroSelect.Close,
	Content: HeroSelect.Content,
	Item: HeroSelect.Item,
	ItemDescription: HeroSelect.ItemDescription,
	ItemIndicator: HeroSelect.ItemIndicator,
	ItemLabel: HeroSelect.ItemLabel,
	ListLabel: HeroSelect.ListLabel,
	Overlay: HeroSelect.Overlay,
	Portal: HeroSelect.Portal,
	Trigger: HeroSelect.Trigger,
	TriggerIndicator: HeroSelect.TriggerIndicator,
	Value: HeroSelect.Value,
}) as typeof SelectComponent &
	Pick<
		typeof HeroSelect,
		| "Close"
		| "Content"
		| "Item"
		| "ItemDescription"
		| "ItemIndicator"
		| "ItemLabel"
		| "ListLabel"
		| "Overlay"
		| "Portal"
		| "Trigger"
		| "TriggerIndicator"
		| "Value"
	>;

export { selectClassNames, useSelect, useSelectAnimation, useSelectItem };
