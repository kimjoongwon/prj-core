import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { Tool } from "@shared/utils";
import { MobxProps } from "../../../types";
import {
	TimeInput as TimeInputComponent,
	TimeInputProps as BaseTimeInputProps,
} from "./TimeInput";

export interface TimeInputProps<T>
	extends MobxProps<T>,
		Omit<BaseTimeInputProps<T>, "value" | "onChange"> {}

export const TimeInput = observer(
	<T extends object>(props: TimeInputProps<T>) => {
		const { state = {}, path = "", ...rest } = props;

		const initialValue = Tool.get(state, path) || "";
		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = action((value: string) => {
			localState.value = value;
		});

		return (
			<TimeInputComponent
				{...rest}
				value={localState.value}
				onChange={handleChange}
			/>
		);
	},
);
