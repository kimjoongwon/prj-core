import {
	RadioGroup as HeroRadioGroup,
	radioGroupClassNames,
	useRadioGroup,
	useRadioGroupItem,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { getTextContent, Text } from "../../data-display/Text";
import { PureRadio } from "../Radio/Radio";

type HeroRadioGroupProps = ComponentPropsWithoutRef<typeof HeroRadioGroup>;
type HeroRadioGroupItemProps = ComponentPropsWithoutRef<
	typeof HeroRadioGroup.Item
>;

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
	ComponentRef<typeof HeroRadioGroup>,
	PureRadioGroupProps
>(({ children, options = [], ...rest }, ref) => (
	<HeroRadioGroup {...rest} ref={ref}>
		{children ??
			options.map((option: RadioOption) => {
				const label = getTextContent(option.text);

				return (
					<RadioGroupItem
						isDisabled={option.isDisabled}
						key={option.value}
						value={option.value}
					>
						{label === null ? (
							option.text
						) : (
							<>
								<Text variant="label">{label}</Text>
								<PureRadio />
							</>
						)}
					</RadioGroupItem>
				);
			})}
	</HeroRadioGroup>
));
PureRadioGroupComponent.displayName = "PureRadioGroup";

const RadioGroupItem = forwardRef<
	ComponentRef<typeof HeroRadioGroup.Item>,
	HeroRadioGroupItemProps
>(({ children, ...props }, ref) => {
	const label =
		typeof children === "function" ? null : getTextContent(children);

	return (
		<HeroRadioGroup.Item {...props} ref={ref}>
			{label === null ? (
				children
			) : (
				<>
					<Text variant="label">{label}</Text>
					<PureRadio />
				</>
			)}
		</HeroRadioGroup.Item>
	);
});
RadioGroupItem.displayName = "RadioGroup.Item";

export const PureRadioGroup = Object.assign(PureRadioGroupComponent, {
	Item: RadioGroupItem,
}) as typeof PureRadioGroupComponent & {
	Item: typeof RadioGroupItem;
};
export const RadioGroup = PureRadioGroup;
export type RadioGroupProps = PureRadioGroupProps;
export { radioGroupClassNames, useRadioGroup, useRadioGroupItem };
