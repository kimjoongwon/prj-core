import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import { Input as BaseInput, type InputProps as BaseInputProps } from "./Input";

export interface InputProps<T>
	extends MobxProps<T>,
		Omit<BaseInputProps, "value" | "onChange" | "onBlur"> {}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	const { path, state, ...rest } = props;

	const initialValue = tools.get(state, path) || "";

	const formField = useFormField({ value: initialValue, state, path });

	const handleChange = (value: string | number) => {
		formField.setValue(value);
	};

	const handleBlur = (value: string | number) => {
		formField.setValue(value);
	};

	return (
		<BaseInput
			{...rest}
			value={formField.state.value}
			onChange={handleChange}
			onBlur={handleBlur}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseInputProps as PureInputProps };
