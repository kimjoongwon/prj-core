"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { RadioGroup as PureRadioGroup } from "./RadioGroup";
import type { RadioGroupProps as PureRadioGroupProps } from "./RadioGroup.props";

export type RadioGroupProps<T extends object = object> =
	| (MobxProps<T> & Omit<PureRadioGroupProps, "value" | "onValueChange">)
	| PureRadioGroupProps;

const RadioGroup = observer(<T extends object>(props: RadioGroupProps<T>) => {
	if (!("state" in props && "path" in props))
		return <PureRadioGroup {...props} />;
	const { state, path, options, ...rest } = props;

	const formField = useFormField<T, string>({ defaultValue: "", state, path });

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

export type { RadioGroupState } from "./RadioGroup";
export { createRadioGroupState } from "./RadioGroup";
export type { RadioOption } from "./RadioGroup.props";
export { RadioGroup };
