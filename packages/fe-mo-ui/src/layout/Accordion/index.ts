import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Accordion as HeroAccordion,
	AccordionLayoutTransition,
	accordionClassNames,
	useAccordion,
	useAccordionItem,
} from "heroui-native/accordion";

type HeroAccordionProps = ComponentPropsWithoutRef<typeof HeroAccordion>;

export type AccordionProps = HeroAccordionProps & {};

const AccordionComponent = forwardRef<
	ElementRef<typeof HeroAccordion>,
	AccordionProps
>((props, ref) => createElement(HeroAccordion, { ...props, ref }));

AccordionComponent.displayName = "Accordion";

export const Accordion = Object.assign(
	AccordionComponent,
	HeroAccordion,
) as typeof HeroAccordion;

export {
	AccordionLayoutTransition,
	accordionClassNames,
	useAccordion,
	useAccordionItem,
};
