"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureSlider,
	type PureSliderProps,
	sliderClassNames,
	useSlider,
} from "./Slider";
import { useRegisterInputState } from "../input-state-inspection";

type BoundSliderProps<TState extends object> = MobxProps<TState> &
	(Omit<PureSliderProps, "onChange" | "onChangeEnd" | "value"> & {
		value?: never;
		onChange?: PureSliderProps["onChange"];
		onChangeEnd?: PureSliderProps["onChangeEnd"];
	});
type UnboundSliderProps = Omit<
	PureSliderProps,
	"onChange" | "onChangeEnd" | "value"
> & {
	state?: never;
	path?: never;
	value?: number | number[];
	defaultValue?: number | number[];
	onChange?: PureSliderProps["onChange"];
	onChangeEnd?: PureSliderProps["onChangeEnd"];
};
export type SliderProps<TState extends object = Record<string, unknown>> =
	| BoundSliderProps<TState>
	| UnboundSliderProps;
export function createSliderState(value: number | number[] = 0) {
	const state = {
		value,
		setValue(nextValue: number | number[]) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(state, {}, { autoBind: true, name: "SliderState" });
}
export type SliderState = ReturnType<typeof createSliderState>;

const Slider = observer(<TState extends object>(props: SliderProps<TState>) => {
	const {
		defaultValue,
		minValue = 0,
		onChange,
		onChangeEnd,
		path,
		state,
		value: controlledValue,
		...rest
	} = props;
	const fallback = defaultValue ?? minValue;
	const localState = useLocalObservable(() => createSliderState(fallback));
	const field = useFormField<TState, number | number[]>({
		path: (state && path ? path : "value") as Paths<TState, 4>,
		state: (state ?? localState) as TState,
		defaultValue: fallback,
	});
	const isBound = state !== undefined && path !== undefined;
	const isControlled = !isBound && controlledValue !== undefined;
	const value = isControlled ? controlledValue : field.state.value;
	useRegisterInputState(
		() => (isControlled ? controlledValue : field.state.value),
		isControlled ? controlledValue : field.state.value,
	);

	return (
		<PureSlider
			{...rest}
			onChange={(nextValue: number | number[]) => {
				if (!isControlled) field.setValue(nextValue);
				onChange?.(nextValue);
			}}
			onChangeEnd={(nextValue: number | number[]) => {
				if (!isControlled) field.setValue(nextValue);
				onChangeEnd?.(nextValue);
			}}
			value={value}
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
