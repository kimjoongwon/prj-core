"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	ColorSlider as BaseColorSlider,
	type ColorSliderProps as BaseColorSliderProps,
} from "./ColorSlider";

type ColorSliderValue = BaseColorSliderProps["value"];

export interface ColorSliderProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<BaseColorSliderProps, "onChange" | "value"> {}

type ColorSliderComponent = <TState extends object = Record<string, unknown>>(
	props: ColorSliderProps<TState>,
) => ReactElement | null;

export const ColorSlider = Object.assign(
	observer(<TState extends object>(props: ColorSliderProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, ColorSliderValue>({
			path,
			state,
			value: (tools.get(state, path) ?? rest.defaultValue) as ColorSliderValue,
		});

		return (
			<BaseColorSlider
				{...({
					...rest,
					onChange: field.setValue as BaseColorSliderProps["onChange"],
					value: field.state.value,
				} as BaseColorSliderProps)}
			/>
		);
	}),
	BaseColorSlider,
) as ColorSliderComponent & typeof BaseColorSlider;

export type { BaseColorSliderProps as PureColorSliderProps };
