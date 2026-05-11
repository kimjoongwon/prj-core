import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { Card as HeroCard, cardClassNames } from "heroui-native/card";
type HeroCardProps = ComponentPropsWithoutRef<typeof HeroCard>;
export type CardProps = HeroCardProps & {};
const CardComponent = forwardRef<ComponentRef<typeof HeroCard>, CardProps>(
  (props, ref) => <HeroCard {...props} ref={ref} />,
);
CardComponent.displayName = "Card";
export const Card = Object.assign(CardComponent, HeroCard) as typeof HeroCard;
export { cardClassNames };
