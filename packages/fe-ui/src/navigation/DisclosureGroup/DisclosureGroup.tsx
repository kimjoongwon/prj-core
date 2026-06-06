"use client";

import { DisclosureGroup as HeroDisclosureGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

const DisclosureGroupComponent = observer(
	(props: ComponentProps<typeof HeroDisclosureGroup>) => {
		return <HeroDisclosureGroup {...props} />;
	},
);

DisclosureGroupComponent.displayName = "DisclosureGroup";

export const DisclosureGroup = Object.assign(DisclosureGroupComponent, {
	Root: HeroDisclosureGroup.Root,
}) as unknown as typeof HeroDisclosureGroup;
