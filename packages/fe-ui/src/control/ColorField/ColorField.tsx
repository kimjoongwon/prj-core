"use client";

import { ColorField as HeroColorField } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ColorFieldProps = ComponentProps<typeof HeroColorField>;

const ColorFieldBase = (props: ColorFieldProps) => {
	return <HeroColorField {...props} />;
};

export const ColorField = Object.assign(
	observer(ColorFieldBase),
	HeroColorField,
) as unknown as typeof HeroColorField;
