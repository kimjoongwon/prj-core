"use client";

import { Label as HeroLabel } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type LabelProps = ComponentProps<typeof HeroLabel>;

const LabelBase = (props: LabelProps) => {
	return <HeroLabel {...props} />;
};

export const Label = Object.assign(
	observer(LabelBase),
	HeroLabel,
) as unknown as typeof HeroLabel;
