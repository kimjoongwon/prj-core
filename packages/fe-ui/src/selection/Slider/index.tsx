"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	Slider as BaseSlider,
	type SliderProps as BaseSliderProps,
} from "./Slider";

type SliderValue = BaseSliderProps["value"];

export interface SliderProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<BaseSliderProps, "onChange" | "value"> {}

type SliderComponent = <TState extends object = Record<string, unknown>>(
	props: SliderProps<TState>,
) => ReactElement | null;

export const Slider = Object.assign(
	observer(<TState extends object>(props: SliderProps<TState>) => {
		const { path, state, ...rest } = props;
		const fallback = rest.defaultValue ?? rest.minValue ?? 0;
		const field = useFormField<TState, SliderValue>({
			path,
			state,
			value: (tools.get(state, path) ?? fallback) as SliderValue,
		});

		return (
			<BaseSlider
				{...rest}
				onChange={field.setValue as BaseSliderProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseSlider,
) as SliderComponent & typeof BaseSlider;

export type { BaseSliderProps as PureSliderProps };
