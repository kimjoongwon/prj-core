"use client";

import { NumberField as HeroNumberField } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type NumberFieldProps = ComponentProps<typeof HeroNumberField>;

const NumberFieldBase = (props: NumberFieldProps) => {
	return <HeroNumberField {...props} />;
};

export const NumberField = Object.assign(
	observer(NumberFieldBase),
	HeroNumberField,
) as unknown as typeof HeroNumberField;
