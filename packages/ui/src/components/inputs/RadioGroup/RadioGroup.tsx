import {
	RadioGroup as NextUIRadioGroup,
	RadioGroupProps as NextUIRadioGroupProps,
	Radio,
} from "@heroui/react";

export interface RadioOption {
	text: string;
	value: any;
}

export interface RadioGroupProps
	extends Omit<NextUIRadioGroupProps, "onValueChange" | "value"> {
	options?: RadioOption[];
	value?: string;
	onValueChange?: (value: string) => void;
}

export const RadioGroup = (props: RadioGroupProps) => {
	const {
		options = [
			{
				text: "test",
				value: "test",
			},
			{
				text: "test2",
				value: "test2",
			},
		],
		value,
		onValueChange,
		...rest
	} = props;

	return (
		<NextUIRadioGroup {...rest} value={value} onValueChange={onValueChange}>
			{options.map((option) => (
				<Radio key={option.value} value={option.value}>
					{option.text}
				</Radio>
			))}
		</NextUIRadioGroup>
	);
};
