"use client";

import { Toolbar as HeroToolbar } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ToolbarProps = ComponentProps<typeof HeroToolbar.Root>;

const ToolbarRoot = observer((props: ToolbarProps) => {
	return <HeroToolbar.Root {...props} />;
});

const ToolbarComponent = observer((props: ToolbarProps) => {
	return <HeroToolbar {...props} />;
});

export const Toolbar = Object.assign(ToolbarComponent, {
	Root: ToolbarRoot,
}) as unknown as typeof ToolbarComponent & {
	Root: typeof ToolbarRoot;
};

Toolbar.displayName = "Toolbar";
Toolbar.Root.displayName = "Toolbar.Root";
