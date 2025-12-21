import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	TimeInputProps as BaseTimeInputProps,
	TimeInput as TimeInputComponent,
} from "./TimeInput";

export interface TimeInputProps<T>
	extends MobxProps<T>,
		Omit<BaseTimeInputProps<T>, "value" | "onChange"> {}

export const TimeInput = observer(
	<T extends object>(props: TimeInputProps<T>) => {
		const { state, path, ...rest } = props;

		const value = tools.get(state, path) || "";
		const formField = useFormField({ value, state, path });

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<TimeInputComponent
				{...rest}
				value={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);
