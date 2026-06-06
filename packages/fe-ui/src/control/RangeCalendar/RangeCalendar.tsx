"use client";

import { RangeCalendar as HeroRangeCalendar } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type RangeCalendarProps = ComponentProps<typeof HeroRangeCalendar>;

const RangeCalendarBase = (props: RangeCalendarProps) => {
	return <HeroRangeCalendar {...props} />;
};

export const RangeCalendar = Object.assign(
	observer(RangeCalendarBase),
	HeroRangeCalendar,
) as unknown as typeof HeroRangeCalendar;
