import type { DateRangePickerProps as HeroUiDateRangePickerProps } from "@heroui/react";
import { DateRangePicker as HeroUiDateRangePicker } from "@heroui/react";
import { type DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import type { MobxProps } from "../../../types";

export interface DateRangePickerProps<T extends object>
	extends HeroUiDateRangePickerProps,
		MobxProps<T> {}

export const DateRangePicker = observer(
	<T extends object>(props: DateRangePickerProps<T>) => {
		const { state, path = "", ...rest } = props;

		const [startPath, endPath] = useMemo(
			() => (path as string)?.split(","),
			[path],
		);

		const startDateTime = get(state, startPath) || new Date().toISOString();
		const endDateTime = get(state, endPath) || new Date().toISOString();

		const localState = useLocalObservable<{
			startDateTime: DateValue;
			endDateTime: DateValue;
		}>(() => ({
			startDateTime: parseAbsoluteToLocal(startDateTime),
			endDateTime: parseAbsoluteToLocal(endDateTime),
		}));

		useEffect(() => {
			const disposer = reaction(
				() => JSON.stringify(localState),
				() => {
					if (startPath && endPath) {
						set(state, startPath, localState.startDateTime.toString());
						set(state, endPath, localState.endDateTime.toString());
					}
				},
			);

			return disposer;
		}, [localState, startPath, endPath, state]);

		const handleDateChange: HeroUiDateRangePickerProps["onChange"] = (
			value,
		) => {
			if (value) {
				localState.startDateTime = value.start;
				localState.endDateTime = value.end;
			}
		};

		return (
			<HeroUiDateRangePicker
				{...rest}
				hideTimeZone
				onChange={handleDateChange}
				defaultValue={{
					start: localState.startDateTime,
					end: localState.endDateTime,
				}}
			/>
		);
	},
);
