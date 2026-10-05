import {
	Select as HeroSelect,
	selectClassNames,
	useSelect,
	useSelectAnimation,
	useSelectItem,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { Typography } from "../../data-display/Typography";

type HeroSelectProps = ComponentPropsWithoutRef<typeof HeroSelect>;
type HeroSelectCloseProps = ComponentPropsWithoutRef<typeof HeroSelect.Close>;
type HeroSelectItemDescriptionProps = ComponentPropsWithoutRef<
	typeof HeroSelect.ItemDescription
>;
type HeroSelectItemLabelProps = ComponentPropsWithoutRef<
	typeof HeroSelect.ItemLabel
>;
type HeroSelectListLabelProps = ComponentPropsWithoutRef<
	typeof HeroSelect.ListLabel
>;
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
const PureSelectComponent = forwardRef<
	ComponentRef<typeof HeroSelect>,
	PureSelectProps
>(
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
				| Array<
						| {
								label: string;
								value: string;
						  }
						| undefined
				  >
				| {
						label: string;
						value: string;
				  }
				| undefined,
		) => {
			if (Array.isArray(nextValue)) {
				onChange?.(nextValue[0]?.value ?? "");
				return;
			}
			onChange?.(nextValue?.value ?? "");
		};
		const contentChildren = [
			listLabel ? (
				<SelectListLabel key="list-label">{listLabel}</SelectListLabel>
			) : null,
			...options.map((option) => (
				<HeroSelect.Item
					disabled={option.isDisabled}
					key={option.value}
					label={option.label}
					value={option.value}
				>
					<SelectItemLabel key={`${option.value}-label`} />
					{option.description ? (
						<SelectItemDescription key={`${option.value}-description`}>
							{option.description}
						</SelectItemDescription>
					) : null}
					<HeroSelect.ItemIndicator key={`${option.value}-indicator`} />
				</HeroSelect.Item>
			)),
			closeProps ? <HeroSelect.Close key="close" {...closeProps} /> : null,
		].filter(Boolean) as ReactNode[];
		const defaultChildren = [
			<HeroSelect.Trigger key="trigger">
				<HeroSelect.Value key="value" placeholder={placeholder} />
				<HeroSelect.TriggerIndicator key="indicator" />
			</HeroSelect.Trigger>,
			<HeroSelect.Portal key="portal">
				{[
					<HeroSelect.Overlay key="overlay" />,
					<HeroSelect.Content key="content" presentation={presentation}>
						{contentChildren}
					</HeroSelect.Content>,
				]}
			</HeroSelect.Portal>,
		];
		return (
			<HeroSelect
				{...rest}
				onValueChange={handleValueChange}
				presentation={presentation}
				ref={ref}
				value={toHeroSelectValue(selectedOption)}
			>
				{children ?? defaultChildren}
			</HeroSelect>
		);
	},
);
PureSelectComponent.displayName = "PureSelect";
const SelectItemLabel = forwardRef<
	ComponentRef<typeof Typography>,
	HeroSelectItemLabelProps
>(({ className, ...props }, ref) => {
	const { label } = useSelectItem();

	return (
		<Typography
			{...props}
			ref={ref}
			accessibilityRole="text"
			className={className}
			type="body-sm"
			weight="semibold"
		>
			{label}
		</Typography>
	);
});
SelectItemLabel.displayName = "Select.ItemLabel";
const SelectItemDescription = forwardRef<
	ComponentRef<typeof Typography>,
	HeroSelectItemDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Typography
		{...props}
		ref={ref}
		accessibilityRole="summary"
		className={className}
		color="muted"
		type="body-sm"
	>
		{children}
	</Typography>
));
SelectItemDescription.displayName = "Select.ItemDescription";
const SelectListLabel = forwardRef<
	ComponentRef<typeof Typography>,
	HeroSelectListLabelProps
>(({ children, className, ...props }, ref) => (
	<Typography
		{...props}
		ref={ref}
		className={className}
		color="muted"
		type="body-xs"
	>
		{children}
	</Typography>
));
SelectListLabel.displayName = "Select.ListLabel";
export const PureSelect = Object.assign(PureSelectComponent, {
	Close: HeroSelect.Close,
	Content: HeroSelect.Content,
	Item: HeroSelect.Item,
	ItemDescription: SelectItemDescription,
	ItemIndicator: HeroSelect.ItemIndicator,
	ItemLabel: SelectItemLabel,
	ListLabel: SelectListLabel,
	Overlay: HeroSelect.Overlay,
	Portal: HeroSelect.Portal,
	Trigger: HeroSelect.Trigger,
	TriggerIndicator: HeroSelect.TriggerIndicator,
	Value: HeroSelect.Value,
}) as typeof PureSelectComponent &
	Pick<
		typeof HeroSelect,
		| "Close"
		| "Content"
		| "Item"
		| "ItemIndicator"
		| "Overlay"
		| "Portal"
		| "Trigger"
		| "TriggerIndicator"
		| "Value"
	> & {
		ItemDescription: typeof SelectItemDescription;
		ItemLabel: typeof SelectItemLabel;
		ListLabel: typeof SelectListLabel;
	};
export const Select = PureSelect;
export type SelectProps = PureSelectProps;
export { selectClassNames, useSelect, useSelectAnimation, useSelectItem };
