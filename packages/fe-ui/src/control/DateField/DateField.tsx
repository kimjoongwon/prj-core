"use client";

import { DateField as HeroDateField } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type DateFieldProps = ComponentProps<typeof HeroDateField>;

const DateFieldBase = (props: DateFieldProps) => {
	return <HeroDateField {...props} />;
};

export const DateField = Object.assign(
	observer(DateFieldBase),
	HeroDateField,
) as unknown as typeof HeroDateField;
