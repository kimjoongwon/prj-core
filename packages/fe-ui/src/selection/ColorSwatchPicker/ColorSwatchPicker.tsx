"use client";

import { ColorSwatchPicker as HeroColorSwatchPicker } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorSwatchPickerProps = ComponentProps<
	typeof HeroColorSwatchPicker
>;

const ColorSwatchPickerBase = (props: ColorSwatchPickerProps) => {
	return <HeroColorSwatchPicker {...props} />;
};

export const ColorSwatchPicker = Object.assign(
	observer(ColorSwatchPickerBase),
	HeroColorSwatchPicker,
) as unknown as typeof HeroColorSwatchPicker;
