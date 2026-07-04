import {
	Switch as HeroSwitch,
	switchClassNames,
	useSwitch,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { View } from "react-native";
import { getTextContent, Text } from "../../data-display/Text";

type HeroSwitchProps = ComponentPropsWithoutRef<typeof HeroSwitch>;

export interface PureSwitchProps
	extends Omit<HeroSwitchProps, "isSelected" | "onSelectedChange"> {
	onValueChange?: (isSelected: boolean) => void;
	value?: boolean;
}

const PureSwitchComponent = forwardRef<
	ComponentRef<typeof HeroSwitch>,
	PureSwitchProps
>(({ children, onValueChange, value, ...rest }, ref) => {
	const label =
		typeof children === "function" ? null : getTextContent(children);
	const control = (
		<HeroSwitch
			{...(rest as HeroSwitchProps)}
			isSelected={value}
			onSelectedChange={onValueChange}
			ref={ref}
		>
			{label === null ? children : undefined}
		</HeroSwitch>
	);

	if (label === null) {
		return control;
	}

	return (
		<View className="w-full flex-row items-center justify-between gap-3">
			<Text className="flex-1" variant="label">
				{label}
			</Text>
			{control}
		</View>
	);
});
PureSwitchComponent.displayName = "PureSwitch";

export const PureSwitch = Object.assign(PureSwitchComponent, {
	EndContent: HeroSwitch.EndContent,
	StartContent: HeroSwitch.StartContent,
	Thumb: HeroSwitch.Thumb,
}) as typeof PureSwitchComponent &
	Pick<typeof HeroSwitch, "EndContent" | "StartContent" | "Thumb">;
export const Switch = PureSwitch;
export type SwitchProps = PureSwitchProps;
export { switchClassNames, useSwitch };
