"use client";

import { Disclosure as HeroDisclosure } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

const DisclosureComponent = observer(
	(props: ComponentProps<typeof HeroDisclosure>) => {
		return <HeroDisclosure {...props} />;
	},
);

DisclosureComponent.displayName = "Disclosure";

export const Disclosure = Object.assign(DisclosureComponent, {
	Root: HeroDisclosure.Root,
	Heading: HeroDisclosure.Heading,
	Trigger: HeroDisclosure.Trigger,
	Content: HeroDisclosure.Content,
	Body: HeroDisclosure.Body,
	Indicator: HeroDisclosure.Indicator,
}) as unknown as typeof HeroDisclosure;
