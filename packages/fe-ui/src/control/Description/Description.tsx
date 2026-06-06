"use client";

import { Description as HeroDescription } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type DescriptionProps = ComponentProps<typeof HeroDescription>;

const DescriptionBase = (props: DescriptionProps) => {
	return <HeroDescription {...props} />;
};

export const Description = Object.assign(
	observer(DescriptionBase),
	HeroDescription,
) as unknown as typeof HeroDescription;
