import { Tool } from "@shared/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import { Input as BaseInput, type InputProps as BaseInputProps } from "./Input";

export interface InputProps<T>
	extends MobxProps<T>,
		Omit<BaseInputProps, "value" | "onChange" | "onBlur"> {}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	const { path = "", state = {}, ...rest } = props;

	const initialValue = Tool.get(state, path) || "";

	const { localState } = useFormField({ initialValue, state, path });

	const handleChange = action((value: string | number) => {
		localState.value = value;
	});

	const handleBlur = action((value: string | number) => {
		localState.value = value;
	});

	return (
		<BaseInput
			{...rest}
			value={localState.value}
			onChange={handleChange}
			onBlur={handleBlur}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseInputProps as PureInputProps };
