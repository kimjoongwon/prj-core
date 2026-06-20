import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	ColorSwatchPicker as BaseColorSwatchPicker,
	type ColorSwatchPickerProps as BaseColorSwatchPickerProps,
} from "./ColorSwatchPicker";

type ColorSwatchPickerValue = BaseColorSwatchPickerProps["value"];

export interface ColorSwatchPickerProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<BaseColorSwatchPickerProps, "onChange" | "value"> {}

type ColorSwatchPickerComponent = <
	TState extends object = Record<string, unknown>,
>(
	props: ColorSwatchPickerProps<TState>,
) => ReactElement | null;

export const ColorSwatchPicker = Object.assign(
	observer(<TState extends object>(props: ColorSwatchPickerProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, ColorSwatchPickerValue>({
			path,
			state,
			value: (tools.get(state, path) ??
				rest.defaultValue) as ColorSwatchPickerValue,
		});

		return (
			<BaseColorSwatchPicker
				{...rest}
				onChange={field.setValue as BaseColorSwatchPickerProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseColorSwatchPicker,
) as ColorSwatchPickerComponent & typeof BaseColorSwatchPicker;

export type { BaseColorSwatchPickerProps as PureColorSwatchPickerProps };
