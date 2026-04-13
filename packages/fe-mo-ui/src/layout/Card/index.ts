import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Card as HeroCard, cardClassNames } from "heroui-native/card";

type HeroCardProps = ComponentPropsWithoutRef<typeof HeroCard>;

export type CardProps = HeroCardProps & {};

const CardComponent = forwardRef<ElementRef<typeof HeroCard>, CardProps>(
	(props, ref) => createElement(HeroCard, { ...props, ref }),
);

CardComponent.displayName = "Card";

export const Card = Object.assign(CardComponent, HeroCard) as typeof HeroCard;

export { cardClassNames };
