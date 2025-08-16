import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { Tool } from "@shared/utils";
import { MobxProps } from "../../../types";
import { Textarea as BaseTextarea, type TextareaProps as BaseTextareaProps } from "./Textarea";

export interface TextareaProps<T> extends MobxProps<T>, Omit<BaseTextareaProps, 'value' | 'onChange'> {}

export const Textarea = observer(<T extends object>(props: TextareaProps<T>) => {
	const { state, path, ...rest } = props;

	const initialValue = Tool.get(state, path, "");

	const { localState } = useFormField({ initialValue, state, path });

	const handleChange = action((value: string) => {
		localState.value = value;
	});

	return (
		<BaseTextarea
			{...rest}
			value={localState.value}
			onChange={handleChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseTextareaProps as PureTextareaProps };