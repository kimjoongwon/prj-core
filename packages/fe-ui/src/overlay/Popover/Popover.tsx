"use client";

import {
	Popover as HeroPopover,
	type PopoverProps as HeroPopoverProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

const PopoverBase = (props: HeroPopoverProps) => {
	return <HeroPopover {...props} />;
};

export const Popover = Object.assign(
	observer(PopoverBase),
	HeroPopover,
) as unknown as typeof HeroPopover;

export type { HeroPopoverProps as PopoverProps };
