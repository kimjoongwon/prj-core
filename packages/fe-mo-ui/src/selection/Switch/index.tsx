import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import {
	Switch as HeroSwitch,
	switchClassNames,
	useSwitch,
} from "heroui-native";
import { observer } from "mobx-react-lite";
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
export interface SwitchProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSwitchProps, "onValueChange" | "value"> {}
const SwitchComponent = observer(
	<TState extends object>(props: SwitchProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, boolean>({
			path,
			state,
			value: (tools.get(state, path) ?? false) as boolean,
		});
		const isSelected = Boolean(field.state.value);
		return (
			<PureSwitchComponent
				{...rest}
				onValueChange={field.setValue}
				value={isSelected}
			/>
		);
	},
);
SwitchComponent.displayName = "Switch";
export const Switch = Object.assign(SwitchComponent, {
	EndContent: HeroSwitch.EndContent,
	StartContent: HeroSwitch.StartContent,
	Thumb: HeroSwitch.Thumb,
}) as typeof SwitchComponent &
	Pick<typeof HeroSwitch, "EndContent" | "StartContent" | "Thumb">;
export { switchClassNames, useSwitch };
