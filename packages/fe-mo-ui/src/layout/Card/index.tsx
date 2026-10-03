import { cardClassNames, Card as HeroCard } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";

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
									// 저수준 layout 예외: heroui-native Card.Header slot에 끼워 넣는 제목 블록이라 raw gap을 유지합니다.
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
const CardTitle = forwardRef<ComponentRef<typeof Typography>, CardTitleProps>(
	({ children, className, ...props }, ref) => (
		<Typography
			{...props}
			ref={ref}
			className={className}
			type="h6"
			weight="semibold"
		>
			{children}
		</Typography>
	),
);
CardTitle.displayName = "Card.Title";
const CardDescription = forwardRef<
	ComponentRef<typeof Typography>,
	CardDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Typography {...props} ref={ref} className={className} color="muted" type="body-sm">
		{children}
	</Typography>
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
