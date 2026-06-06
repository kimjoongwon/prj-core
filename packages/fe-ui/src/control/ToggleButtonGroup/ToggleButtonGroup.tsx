"use client";

import { ToggleButtonGroup as HeroToggleButtonGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ToggleButtonGroupProps = ComponentProps<
	typeof HeroToggleButtonGroup
>;

const ToggleButtonGroupBase = (props: ToggleButtonGroupProps) => {
	return <HeroToggleButtonGroup {...props} />;
};

export const ToggleButtonGroup = Object.assign(
	observer(ToggleButtonGroupBase),
	HeroToggleButtonGroup,
) as unknown as typeof HeroToggleButtonGroup;
