import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { Input as InputComponent, InputProps as BaseInputProps } from "./Input";
import { Tool } from "@shared/utils";

export interface InputProps<T>
	extends MobxProps<T>,
		Omit<BaseInputProps, "value" | "onChangeText"> {}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	const { state, path, ...rest } = props;

	const initialValue = Tool.get(state, path) || "";

	const { localState } = useFormField({
		initialValue,
		state,
		path,
	});

	const handleChange = action((value: string) => {
		localState.value = value;
	});

	return (
		<InputComponent
			{...rest}
			value={localState.value}
			onChangeText={handleChange}
		/>
	);
});

Input.displayName = "MobxInput";

// Re-export the pure component and types for direct use
export { Input as default } from "./Input";
export type {
	InputColor,
	InputProps as PureInputProps,
	InputSize,
	InputVariant,
	LabelPlacement,
} from "./Input";
