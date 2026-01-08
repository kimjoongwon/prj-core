import {
	Checkbox as NextUICheckbox,
	type CheckboxProps as NextUICheckboxProps,
} from "@heroui/react";
import type React from "react";

export interface CheckboxProps extends Omit<NextUICheckboxProps, "onChange"> {
	onChange?: (checked: boolean) => void;
}

export const Checkbox = (props: CheckboxProps) => {
	const { onChange, size = "lg", ...rest } = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked);
	};

	return (
		<NextUICheckbox {...rest} onChange={handleChange} size={size}>
			<span className="font-bold">{props.children}</span>
		</NextUICheckbox>
	);
};
