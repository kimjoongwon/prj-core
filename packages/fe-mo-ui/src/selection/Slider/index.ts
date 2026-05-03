import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Slider as HeroSlider, sliderClassNames, useSlider } from "heroui-native/slider";

type HeroSliderProps = ComponentPropsWithoutRef<typeof HeroSlider>;

export interface PureSliderProps extends Omit<HeroSliderProps, "children"> {
	children?: ReactNode;
}

function getSliderThumbValues(value?: number | number[], defaultValue?: number | number[]) {
	if (Array.isArray(value)) {
		return value;
	}

	if (Array.isArray(defaultValue)) {
		return defaultValue;
	}

	if (typeof value === "number") {
		return [value];
	}

	if (typeof defaultValue === "number") {
		return [defaultValue];
	}

	return [0];
}

const PureSliderComponent = forwardRef<ElementRef<typeof HeroSlider>, PureSliderProps>(
	({ children, defaultValue, value, ...rest }, ref) => {
		const thumbValues = getSliderThumbValues(value, defaultValue);

		const defaultChildren = [
			createElement(HeroSlider.Output, { key: "output" }),
			createElement(HeroSlider.Track, { key: "track" }, [
				createElement(HeroSlider.Fill, { key: "fill" }),
				...thumbValues.map((_, index) =>
					createElement(HeroSlider.Thumb, {
						index,
						key: index,
					}),
				),
			]),
		];

		return createElement(
			HeroSlider,
			{
				...rest,
				defaultValue,
				ref,
				value,
			},
			children ?? defaultChildren,
		);
	},
);

PureSliderComponent.displayName = "PureSlider";

export interface SliderProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSliderProps, "onChange" | "onChangeEnd" | "value"> {}

const SliderComponent = observer(<TState extends object>(props: SliderProps<TState>) => {
	const { defaultValue, minValue = 0, path, state, ...rest } = props;
	const fallback = defaultValue ?? minValue;
	const field = useFormField<TState, number | number[]>({
		path,
		state,
		value: (tools.get(state, path) ?? fallback) as number | number[],
	});

	return createElement(PureSliderComponent, {
		...rest,
		defaultValue,
		onChange: (nextValue: number | number[]) => {
			field.setValue(nextValue);
		},
		onChangeEnd: (nextValue: number | number[]) => {
			field.setValue(nextValue);
		},
		value: field.state.value,
	});
});

SliderComponent.displayName = "Slider";

export const Slider = Object.assign(SliderComponent, {
	Fill: HeroSlider.Fill,
	Output: HeroSlider.Output,
	Thumb: HeroSlider.Thumb,
	Track: HeroSlider.Track,
}) as typeof SliderComponent &
	Pick<typeof HeroSlider, "Fill" | "Output" | "Thumb" | "Track">;

export { sliderClassNames, useSlider };
