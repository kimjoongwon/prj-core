"use client";

import { Accordion as HeroAccordion } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

const AccordionComponent = observer(
	(props: ComponentProps<typeof HeroAccordion>) => {
		return <HeroAccordion {...props} />;
	},
);

AccordionComponent.displayName = "Accordion";

export const Accordion = Object.assign(AccordionComponent, {
	Root: HeroAccordion.Root,
	Item: HeroAccordion.Item,
	Heading: HeroAccordion.Heading,
	Trigger: HeroAccordion.Trigger,
	Panel: HeroAccordion.Panel,
	Indicator: HeroAccordion.Indicator,
	Body: HeroAccordion.Body,
}) as unknown as typeof HeroAccordion;
