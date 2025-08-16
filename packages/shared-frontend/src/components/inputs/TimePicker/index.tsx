import dayjs from "dayjs";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	TimePicker as BaseTimePicker,
	type TimePickerProps as BaseTimePickerProps,
} from "./TimePicker";

export interface TimePickerProps<T>
	extends MobxProps<T>,
		Omit<BaseTimePickerProps, "value" | "onChange"> {}

export const TimePicker = observer(
	<T extends object>(props: TimePickerProps<T>) => {
		const { path = "", state = {} } = props;

		const initialValue = get(state, path) || dayjs().format("HH:mm");

		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = action((value: string) => {
			localState.value = value;
		});

		return <BaseTimePicker value={localState.value} onChange={handleChange} />;
	},
);

// Re-export types for backwards compatibility
export type { BaseTimePickerProps as PureTimePickerProps };
