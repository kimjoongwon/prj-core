"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureSlider,
	type PureSliderProps,
	sliderClassNames,
	useSlider,
} from "./Slider";

export interface SliderProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSliderProps, "onChange" | "onChangeEnd" | "value"> {}

const Slider = observer(<TState extends object>(props: SliderProps<TState>) => {
	const { defaultValue, minValue = 0, path, state, ...rest } = props;
	const fallback = defaultValue ?? minValue;
	const field = useFormField<TState, number | number[]>({
		path,
		state,
		value: (tools.get(state, path) ?? fallback) as number | number[],
	});

	return (
		<PureSlider
			{...rest}
			defaultValue={defaultValue}
			onChange={(nextValue: number | number[]) => {
				field.setValue(nextValue);
			}}
			onChangeEnd={(nextValue: number | number[]) => {
				field.setValue(nextValue);
			}}
			value={field.state.value}
		/>
	);
});
Slider.displayName = "Slider";

const SliderWithStatics = Object.assign(Slider, {
	Fill: PureSlider.Fill,
	Output: PureSlider.Output,
	Thumb: PureSlider.Thumb,
	Track: PureSlider.Track,
}) as typeof Slider &
	Pick<typeof PureSlider, "Fill" | "Output" | "Thumb" | "Track">;
export { SliderWithStatics as Slider };
export { sliderClassNames, useSlider };
export type { PureSliderProps };
