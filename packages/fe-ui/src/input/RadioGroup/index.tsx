"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { RadioGroup as PureRadioGroup } from "./RadioGroup";
import type { RadioGroupProps as PureRadioGroupProps } from "./RadioGroup.props";

export interface RadioGroupProps<T>
	extends MobxProps<T>,
		Omit<PureRadioGroupProps, "value" | "onValueChange"> {}

const RadioGroup = observer(<T extends object>(props: RadioGroupProps<T>) => {
	const { state, path, options, ...rest } = props;

	const rawValue = tools.get(state, path);
	const value =
		options?.find((option) => String(option.value) === String(rawValue)) !==
		undefined
			? String(rawValue)
			: "";

	const formField = useFormField<T, string>({ value, state, path });

	const handleValueChange = (value: string) => {
		formField.setValue(value);
	};

	return (
		<PureRadioGroup
			{...rest}
			options={options}
			value={formField.state.value}
			onValueChange={handleValueChange}
		/>
	);
});

export { RadioGroup };
export type { RadioOption } from "./RadioGroup.props";
