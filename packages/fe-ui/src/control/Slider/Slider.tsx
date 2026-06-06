"use client";

import { Slider as HeroSlider } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type SliderProps = ComponentProps<typeof HeroSlider>;

const SliderBase = (props: SliderProps) => {
	return <HeroSlider {...props} />;
};

export const Slider = Object.assign(
	observer(SliderBase),
	HeroSlider,
) as unknown as typeof HeroSlider;
