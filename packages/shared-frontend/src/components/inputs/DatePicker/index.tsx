import { parseAbsoluteToLocal } from "@internationalized/date";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { Tool } from "@shared/utils";
import { MobxProps } from "../../../types";
import {
	DatePicker as DatePickerComponent,
	DatePickerProps as BaseDatePickerProps,
} from "./DatePicker";
import { action } from "mobx";

export interface DatePickerProps<T>
	extends MobxProps<T>,
		Omit<BaseDatePickerProps<T>, "value" | "onChange"> {}

export const DatePicker = observer(
	<T extends object>(props: DatePickerProps<T>) => {
		const { state = {}, path = "", ...rest } = props;

		const defaultValue = (Tool.get(state, path) ||
			new Date().toISOString()) as string;

		const defaultParsedValue = parseAbsoluteToLocal(defaultValue);

		const { localState } = useFormField({
			initialValue: defaultParsedValue,
			state,
			path,
		});

		const handleDateChange = action((value: string) => {
			const parsedValue = parseAbsoluteToLocal(value);
			localState.value = parsedValue;
		});

		return (
			<DatePickerComponent
				{...rest}
				value={localState.value}
				onChange={handleDateChange}
			/>
		);
	},
);
