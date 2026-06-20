"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	RangeCalendar as BaseRangeCalendar,
	type RangeCalendarProps as BaseRangeCalendarProps,
} from "./RangeCalendar";

type RangeCalendarValue = BaseRangeCalendarProps["value"];

export interface RangeCalendarProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<BaseRangeCalendarProps, "onChange" | "value"> {}

type RangeCalendarComponent = <
	TState extends object = Record<string, unknown>,
>(
	props: RangeCalendarProps<TState>,
) => ReactElement | null;

export const RangeCalendar = Object.assign(
	observer(<TState extends object>(props: RangeCalendarProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, RangeCalendarValue>({
			path,
			state,
			value: (tools.get(state, path) ??
				rest.defaultValue) as RangeCalendarValue,
		});

		return (
			<BaseRangeCalendar
				{...rest}
				onChange={field.setValue as BaseRangeCalendarProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseRangeCalendar,
) as RangeCalendarComponent & typeof BaseRangeCalendar;

export type { BaseRangeCalendarProps as PureRangeCalendarProps };
