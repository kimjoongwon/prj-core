import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	Calendar as CalendarComponent,
	CalendarProps as BaseCalendarProps,
} from "./Calendar";

export interface CalendarProps<T>
	extends MobxProps<T>,
		Omit<BaseCalendarProps, "value" | "onChange"> {}

export const Calendar = observer(
	<T extends object>(props: CalendarProps<T>) => {
		const { state = {}, path = "", ...rest } = props;

		const initialValue = get(state, path) || [];
		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = action((value: string[]) => {
			localState.value = value;
		});

		return (
			<CalendarComponent
				{...rest}
				value={localState.value}
				onChange={handleChange}
			/>
		);
	},
);
