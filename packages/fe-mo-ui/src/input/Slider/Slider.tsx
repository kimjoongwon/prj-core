import {
	Slider as HeroSlider,
	sliderClassNames,
	useSlider,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroSliderProps = ComponentPropsWithoutRef<typeof HeroSlider>;

export interface PureSliderProps extends Omit<HeroSliderProps, "children"> {
	children?: ReactNode;
}

function getSliderThumbValues(
	value?: number | number[],
	defaultValue?: number | number[],
) {
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

const PureSliderComponent = forwardRef<
	ComponentRef<typeof HeroSlider>,
	PureSliderProps
>(({ children, defaultValue, value, ...rest }, ref) => {
	const thumbValues = getSliderThumbValues(value, defaultValue);
	const defaultChildren = [
		<HeroSlider.Output key="output" />,
		<HeroSlider.Track key="track">
			<HeroSlider.Fill key="fill" />
			{thumbValues.map((_, index) => {
				// Slider thumbs are positional controls, so their thumb index is their identity.
				const thumbKey = `slider-thumb-${index}`;
				return <HeroSlider.Thumb index={index} key={thumbKey} />;
			})}
		</HeroSlider.Track>,
	];

	return (
		<HeroSlider {...rest} defaultValue={defaultValue} ref={ref} value={value}>
			{children ?? defaultChildren}
		</HeroSlider>
	);
});
PureSliderComponent.displayName = "PureSlider";

export const PureSlider = Object.assign(PureSliderComponent, {
	Fill: HeroSlider.Fill,
	Output: HeroSlider.Output,
	Thumb: HeroSlider.Thumb,
	Track: HeroSlider.Track,
}) as typeof PureSliderComponent &
	Pick<typeof HeroSlider, "Fill" | "Output" | "Thumb" | "Track">;
export const Slider = PureSlider;
export type SliderProps = PureSliderProps;
export { sliderClassNames, useSlider };
