import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import * as TimeInputPrimitive from "./TimeInput";

export interface TimeInputProps<T>
	extends MobxProps<T>,
		Omit<TimeInputPrimitive.TimeInputProps<T>, "value" | "onChange"> {}

export const TimeInput = observer(
	<T extends object>(props: TimeInputProps<T>) => {
		const { state, path, ...rest } = props;

		const value = (tools.get(state, path) as string | null) || "";
		const formField = useFormField({ value, state, path });

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<TimeInputPrimitive.TimeInput
				{...rest}
				value={formField.state.value as any}
				onChange={handleChange}
			/>
		);
	},
);
