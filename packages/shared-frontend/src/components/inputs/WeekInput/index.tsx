import { useFormField } from "@shared/hooks";
import type { MobxProps } from "@shared/types";
import { tools } from "@shared/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
	WeekInput as BaseWeekInput,
	type WeekInputProps as BaseWeekInputProps,
	RecurringDayOfTheWeek,
} from "./WeekInput";

export interface WeekInputProps<T = any>
	extends MobxProps<T>,
		Omit<BaseWeekInputProps, "value" | "onChange"> {}

export const WeekInput = observer(
	<T extends object>(props: WeekInputProps<T>) => {
		const { state, path, ...rest } = props;

		const initialValue = tools.get(state, path);
		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = action((value: RecurringDayOfTheWeek) => {
			localState.value = value;
		});

		return (
			<BaseWeekInput
				{...rest}
				value={localState.value}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseWeekInputProps as PureWeekInputProps };
