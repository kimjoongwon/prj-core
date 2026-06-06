"use client";

import { ColorSwatch as HeroColorSwatch } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorSwatchProps = ComponentProps<typeof HeroColorSwatch>;

const ColorSwatchBase = (props: ColorSwatchProps) => {
	return <HeroColorSwatch {...props} />;
};

export const ColorSwatch = Object.assign(
	observer(ColorSwatchBase),
	HeroColorSwatch,
) as unknown as typeof HeroColorSwatch;
