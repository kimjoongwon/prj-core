import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	Textarea as BaseTextarea,
	type TextareaProps as BaseTextareaProps,
} from "./Textarea";

export interface TextareaProps<T>
	extends MobxProps<T>,
		Omit<BaseTextareaProps, "value" | "onChange"> {}

export const Textarea = observer(
	<T extends object>(props: TextareaProps<T>) => {
		const { state, path, ...rest } = props;

		const initialValue = tools.get(state, path, "");

		const formField = useFormField({ value: initialValue, state, path });

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<BaseTextarea
				{...rest}
				value={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseTextareaProps as PureTextareaProps };
