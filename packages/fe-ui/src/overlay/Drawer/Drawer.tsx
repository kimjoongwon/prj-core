"use client";

import {
	Drawer as HeroDrawer,
	type DrawerProps as HeroDrawerProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

const DrawerBase = (props: HeroDrawerProps) => {
	return <HeroDrawer {...props} />;
};

export const Drawer = Object.assign(
	observer(DrawerBase),
	HeroDrawer,
) as unknown as typeof HeroDrawer;

export type { HeroDrawerProps as DrawerProps };
