import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { View } from "react-native";
import { Card as HeroCard, cardClassNames } from "heroui-native";
import { Text } from "../../data-display/Text";
type HeroCardProps = ComponentPropsWithoutRef<typeof HeroCard>;
type HeroCardTitleProps = ComponentPropsWithoutRef<typeof HeroCard.Title>;
type HeroCardDescriptionProps = ComponentPropsWithoutRef<
  typeof HeroCard.Description
>;
export interface CardProps extends HeroCardProps {
  actions?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  title?: ReactNode;
}
export type CardTitleProps = HeroCardTitleProps & {};
export type CardDescriptionProps = HeroCardDescriptionProps & {};
const CardComponent = forwardRef<ComponentRef<typeof HeroCard>, CardProps>(
  (
    { actions, children, description, footer, header, title, ...props },
    ref,
  ) => {
    const hasHeader = header || title || description || actions;
    const hasScaffold = hasHeader || footer;

    return (
      <HeroCard {...props} ref={ref}>
        {hasScaffold ? (
          <>
            {hasHeader && (
              <HeroCard.Header>
                {header ?? (
                  <View className="flex-1 gap-1">
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && (
                      <CardDescription>{description}</CardDescription>
                    )}
                  </View>
                )}
                {actions}
              </HeroCard.Header>
            )}
            {children && <HeroCard.Body>{children}</HeroCard.Body>}
            {footer && <HeroCard.Footer>{footer}</HeroCard.Footer>}
          </>
        ) : (
          children
        )}
      </HeroCard>
    );
  },
);
CardComponent.displayName = "Card";
const CardTitle = forwardRef<ComponentRef<typeof Text>, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <Text
      {...props}
      ref={ref}
      className={className}
      variant="title"
      weight="semibold"
    >
      {children}
    </Text>
  ),
);
CardTitle.displayName = "Card.Title";
const CardDescription = forwardRef<
  ComponentRef<typeof Text>,
  CardDescriptionProps
>(({ children, className, ...props }, ref) => (
  <Text {...props} ref={ref} className={className} tone="muted" variant="body">
    {children}
  </Text>
));
CardDescription.displayName = "Card.Description";
export const Card = Object.assign(CardComponent, {
  Body: HeroCard.Body,
  Description: CardDescription,
  Footer: HeroCard.Footer,
  Header: HeroCard.Header,
  Title: CardTitle,
}) as typeof CardComponent &
  Pick<typeof HeroCard, "Body" | "Footer" | "Header"> & {
    Description: typeof CardDescription;
    Title: typeof CardTitle;
  };
export { cardClassNames };
