"use client";

import { Separator as HeroSeparator } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type SeparatorProps = ComponentProps<typeof HeroSeparator>;

const SeparatorRoot = observer((props: SeparatorProps) => {
	return <HeroSeparator.Root {...props} />;
});

const SeparatorComponent = observer((props: SeparatorProps) => {
	return <HeroSeparator {...props} />;
});

export const Separator = Object.assign(SeparatorComponent, {
	Root: SeparatorRoot,
}) as unknown as typeof SeparatorComponent & {
	Root: typeof SeparatorRoot;
};

Separator.displayName = "Separator";
Separator.Root.displayName = "Separator.Root";
