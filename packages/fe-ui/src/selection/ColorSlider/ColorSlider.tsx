"use client";

import { ColorSlider as HeroColorSlider } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorSliderProps = ComponentProps<typeof HeroColorSlider>;

const ColorSliderBase = (props: ColorSliderProps) => {
	return <HeroColorSlider {...props} />;
};

export const ColorSlider = Object.assign(
	observer(ColorSliderBase),
	HeroColorSlider,
) as unknown as typeof HeroColorSlider;
