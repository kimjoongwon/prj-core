import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { observer } from "mobx-react-lite";
import { Switch as HeroSwitch, switchClassNames, useSwitch } from "heroui-native/switch";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

type HeroSwitchProps = ComponentPropsWithoutRef<typeof HeroSwitch>;

export interface PureSwitchProps
	extends Omit<HeroSwitchProps, "isSelected" | "onSelectedChange"> {
	onValueChange?: (isSelected: boolean) => void;
	value?: boolean;
}

const PureSwitchComponent = forwardRef<ElementRef<typeof HeroSwitch>, PureSwitchProps>(
	({ onValueChange, value, ...rest }, ref) =>
		createElement(HeroSwitch, {
			...rest,
			isSelected: value,
			onSelectedChange: onValueChange,
			ref,
		}),
);

PureSwitchComponent.displayName = "PureSwitch";

export interface SwitchProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSwitchProps, "onValueChange" | "value"> {}

const SwitchComponent = observer(<TState extends object>(props: SwitchProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useMobxField({ fallback: false, path, state });

	return createElement(PureSwitchComponent, {
		...rest,
		onValueChange: field.setValue,
		value: Boolean(field.value),
	});
});

SwitchComponent.displayName = "Switch";

export const Switch = Object.assign(SwitchComponent, {
	EndContent: HeroSwitch.EndContent,
	StartContent: HeroSwitch.StartContent,
	Thumb: HeroSwitch.Thumb,
}) as typeof SwitchComponent &
	Pick<typeof HeroSwitch, "EndContent" | "StartContent" | "Thumb">;

export { switchClassNames, useSwitch };
