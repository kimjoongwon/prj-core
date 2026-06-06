"use client";

import { ColorArea as HeroColorArea } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorAreaProps = ComponentProps<typeof HeroColorArea>;

const ColorAreaBase = (props: ColorAreaProps) => {
	return <HeroColorArea {...props} />;
};

export const ColorArea = Object.assign(
	observer(ColorAreaBase),
	HeroColorArea,
) as unknown as typeof HeroColorArea;
