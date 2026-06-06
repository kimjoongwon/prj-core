"use client";

import { ColorPicker as HeroColorPicker } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorPickerProps = ComponentProps<typeof HeroColorPicker>;

const ColorPickerBase = (props: ColorPickerProps) => {
	return <HeroColorPicker {...props} />;
};

export const ColorPicker = Object.assign(
	observer(ColorPickerBase),
	HeroColorPicker,
) as unknown as typeof HeroColorPicker;
