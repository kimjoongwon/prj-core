"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	ColorArea as BaseColorArea,
	type ColorAreaProps as BaseColorAreaProps,
} from "./ColorArea";

type ColorAreaValue = BaseColorAreaProps["value"];

export interface ColorAreaProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<BaseColorAreaProps, "onChange" | "value"> {}

type ColorAreaComponent = <TState extends object = Record<string, unknown>>(
	props: ColorAreaProps<TState>,
) => ReactElement | null;

export const ColorArea = Object.assign(
	observer(<TState extends object>(props: ColorAreaProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, ColorAreaValue>({
			path,
			state,
			value: (tools.get(state, path) ?? rest.defaultValue) as ColorAreaValue,
		});

		return (
			<BaseColorArea
				{...rest}
				onChange={field.setValue as BaseColorAreaProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseColorArea,
) as ColorAreaComponent & typeof BaseColorArea;

export type { BaseColorAreaProps as PureColorAreaProps };
