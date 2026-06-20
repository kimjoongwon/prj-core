import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	ColorPicker as BaseColorPicker,
	type ColorPickerProps as BaseColorPickerProps,
} from "./ColorPicker";

type ColorPickerValue = BaseColorPickerProps["value"];

export interface ColorPickerProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<BaseColorPickerProps, "onChange" | "value"> {}

type ColorPickerComponent = <
	TState extends object = Record<string, unknown>,
>(
	props: ColorPickerProps<TState>,
) => ReactElement | null;

export const ColorPicker = Object.assign(
	observer(<TState extends object>(props: ColorPickerProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, ColorPickerValue>({
			path,
			state,
			value: (tools.get(state, path) ?? rest.defaultValue) as ColorPickerValue,
		});

		return (
			<BaseColorPicker
				{...rest}
				onChange={field.setValue as BaseColorPickerProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseColorPicker,
) as ColorPickerComponent & typeof BaseColorPicker;

export type { BaseColorPickerProps as PureColorPickerProps };
