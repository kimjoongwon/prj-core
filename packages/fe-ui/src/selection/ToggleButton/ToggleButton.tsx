"use client";

import { ToggleButton as HeroToggleButton } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ToggleButtonProps = ComponentProps<typeof HeroToggleButton>;

const ToggleButtonBase = (props: ToggleButtonProps) => {
	return <HeroToggleButton {...props} />;
};

export const ToggleButton = Object.assign(
	observer(ToggleButtonBase),
	HeroToggleButton,
) as unknown as typeof HeroToggleButton;
