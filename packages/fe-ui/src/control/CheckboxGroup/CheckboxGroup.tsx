"use client";

import { CheckboxGroup as HeroCheckboxGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type CheckboxGroupProps = ComponentProps<typeof HeroCheckboxGroup>;

const CheckboxGroupBase = (props: CheckboxGroupProps) => {
	return <HeroCheckboxGroup {...props} />;
};

export const CheckboxGroup = Object.assign(
	observer(CheckboxGroupBase),
	HeroCheckboxGroup,
) as unknown as typeof HeroCheckboxGroup;
