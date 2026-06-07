"use client";

import { Toolbar as HeroToolbar } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ToolbarProps = ComponentProps<typeof HeroToolbar>;

const ToolbarBase = (props: ToolbarProps) => {
	return <HeroToolbar {...props} />;
};

export const Toolbar = Object.assign(
	observer(ToolbarBase),
	HeroToolbar,
) as unknown as typeof HeroToolbar;
