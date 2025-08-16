import {
	Checkbox as NextUICheckbox,
	CheckboxProps as NextUICheckboxProps,
} from "@heroui/react";
import React from "react";
import { Text } from "../../ui/Text/Text";

export interface CheckboxProps extends Omit<NextUICheckboxProps, 'onChange'> {
	onChange?: (checked: boolean) => void;
}

export const Checkbox = (props: CheckboxProps) => {
	const { onChange, size = "lg", ...rest } = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked);
	};

	return (
		<NextUICheckbox
			{...rest}
			onChange={handleChange}
			size={size}
		>
			<Text className="font-bold">{props.children}</Text>
		</NextUICheckbox>
	);
};
