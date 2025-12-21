import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	CalendarProps as BaseCalendarProps,
	Calendar as CalendarComponent,
} from "./Calendar";

export interface CalendarProps<T>
	extends MobxProps<T>,
		Omit<BaseCalendarProps, "value" | "onChange"> {}

export const Calendar = observer(
	<T extends object>(props: CalendarProps<T>) => {
		const { state, path, ...rest } = props;

		const value = tools.get(state, path) || [];
		const formField = useFormField({ value, state, path });

		const handleChange = (value: string[]) => {
			formField.setValue(value);
		};

		return (
			<CalendarComponent
				{...rest}
				value={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);
