"use client";

import { Fieldset as HeroFieldset } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type FieldsetProps = ComponentProps<typeof HeroFieldset>;

const FieldsetBase = (props: FieldsetProps) => {
	return <HeroFieldset {...props} />;
};

export const Fieldset = Object.assign(
	observer(FieldsetBase),
	HeroFieldset,
) as unknown as typeof HeroFieldset;
