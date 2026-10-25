"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { RadioGroup as PureRadioGroup } from "./RadioGroup";
import type { RadioGroupProps as PureRadioGroupProps } from "./RadioGroup.props";

export type RadioGroupProps<T extends object = object> =
	| (MobxProps<T> & Omit<PureRadioGroupProps, "value" | "onValueChange">)
	| PureRadioGroupProps;

const BoundRadioGroup = observer(<T extends object>(props: MobxProps<T> & Omit<PureRadioGroupProps, "value" | "onValueChange">) => {
	const { state, path, options, ...rest } = props;

	const formField = useFormField<T, string | number>({ defaultValue: "", state, path });

	const handleValueChange = (value: string) => {
		const option = options?.find((candidate) => String(candidate.value) === value);
		formField.setValue(option?.value ?? value);
	};

	return (
		<PureRadioGroup
			{...rest}
			options={options}
			value={formField.state.value == null ? "" : String(formField.state.value)}
			onValueChange={handleValueChange}
		/>
	);
});

const RadioGroup = <T extends object>(props: RadioGroupProps<T>) =>
	"state" in props && "path" in props ? <BoundRadioGroup {...props} /> : <PureRadioGroup {...props} />;

export type { RadioGroupState } from "./RadioGroup";
export { createRadioGroupState } from "./RadioGroup";
export type { RadioOption } from "./RadioGroup.props";
export { RadioGroup };
