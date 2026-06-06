"use client";

import {
	Tooltip as HeroTooltip,
	type TooltipProps as HeroTooltipProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

const TooltipBase = (props: HeroTooltipProps) => {
	return <HeroTooltip {...props} />;
};

export const Tooltip = Object.assign(
	observer(TooltipBase),
	HeroTooltip,
) as unknown as typeof HeroTooltip;

export type { HeroTooltipProps as TooltipProps };
