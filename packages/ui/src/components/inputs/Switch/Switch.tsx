import {
	Switch as NextUISwitch,
	SwitchProps as NextUISwitchProps,
} from "@heroui/react";

export interface SwitchProps
	extends Omit<NextUISwitchProps, "onValueChange" | "value"> {
	value?: boolean;
	onValueChange?: (isSelected: boolean) => void;
}

export const Switch = (props: SwitchProps) => {
	const { onValueChange, value, ...rest } = props;

	return (
		<NextUISwitch {...rest} onValueChange={onValueChange} isSelected={value} />
	);
};
