import {
	Card as HeroCard,
	type CardProps as HeroCardProps,
} from "@heroui/react";

type LegacyCardVariant =
	| HeroCardProps["variant"]
	| "flat"
	| "bordered"
	| "shadow"
	| "faded"
	| "solid";

const mapCardVariant = (
	variant?: LegacyCardVariant,
): HeroCardProps["variant"] | undefined => {
	if (variant === "bordered" || variant === "faded") {
		return "secondary";
	}
	if (variant === "shadow" || variant === "solid" || variant === "flat") {
		return "tertiary";
	}

	return variant;
};

export interface CardProps extends Omit<HeroCardProps, "variant"> {
	variant?: LegacyCardVariant;
}

const CardInternal = ({ variant, ...props }: CardProps) => {
	return <HeroCard {...props} variant={mapCardVariant(variant)} />;
};

export const Card = Object.assign(CardInternal, HeroCard);
