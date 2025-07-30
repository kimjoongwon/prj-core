import { DateRangePicker as HeroUiDateRangePicker } from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { DateRangePickerProps } from "@shared/types";
import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export const DateRangePicker = observer(
	<T extends object>(props: DateRangePickerProps<T>) => {
		const { state, path = "", ...rest } = props;

		const startDateTime =
			get(state, (path as string)?.split(",")?.[0]) || new Date().toISOString();
		const endDateTime =
			get(state, (path as string)?.split(",")?.[1]) || new Date().toISOString();

		const localState = useLocalObservable(() => ({
			startDateTime: parseAbsoluteToLocal(startDateTime),
			endDateTime: parseAbsoluteToLocal(endDateTime),
		}));

		useEffect(() => {
			const disposer = reaction(
				() => JSON.stringify(localState),
				() => {
					set(
						state,
						(path as string)?.split(",")?.[0],
						localState.startDateTime.toAbsoluteString(),
					);
					set(
						state,
						(path as string)?.split(",")?.[1],
						localState.endDateTime.toAbsoluteString(),
					);
				},
			);

			return disposer;
		}, [localState, path, state]);

		return (
			<HeroUiDateRangePicker
				hideTimeZone
				{...rest}
				onChange={(value) => {
					if (value) {
						localState.startDateTime = value.start;
						localState.endDateTime = value.end;
					}
				}}
				defaultValue={{
					// @ts-ignore
					start: localState.startDateTime,
					// @ts-ignore
					end: localState.endDateTime,
				}}
			/>
		);
	},
);
