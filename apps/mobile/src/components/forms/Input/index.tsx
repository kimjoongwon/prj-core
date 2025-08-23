import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { InputProps as BaseInputProps, Input as InputComponent } from "./Input";

export interface InputProps<T>
	extends MobxProps<T>,
		Omit<BaseInputProps, "value" | "onChangeText"> {}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	const { state, path, ...rest } = props;

	const initialValue = get(state, path) || "";

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

export type {
	InputColor,
	InputProps as PureInputProps,
	InputSize,
	InputVariant,
	LabelPlacement,
} from "./Input";
// Re-export the pure component and types for direct use
export { Input as default } from "./Input";
