import {
	Badge as HeroBadge,
	type BadgeProps as HeroBadgeProps,
} from "@heroui/react";

type LegacyBadgeColor = HeroBadgeProps["color"] | "primary" | "secondary";

type LegacyBadgeVariant =
	| HeroBadgeProps["variant"]
	| "flat"
	| "light"
	| "bordered"
	| "solid"
	| "faded"
	| "dot"
	| "shadow";

const mapBadgeColor = (color?: LegacyBadgeColor): HeroBadgeProps["color"] => {
	if (color === "primary" || color === "secondary") {
		return "accent";
	}

	return color;
};

const mapBadgeVariant = (
	variant?: LegacyBadgeVariant,
): HeroBadgeProps["variant"] | undefined => {
	if (variant === "light" || variant === "faded") {
		return "soft";
	}
	if (variant === "bordered" || variant === "dot" || variant === "flat") {
		return "secondary";
	}
	if (variant === "solid" || variant === "shadow") {
		return "primary";
	}

	return variant;
};

export interface BadgeProps extends Omit<HeroBadgeProps, "color" | "variant"> {
	color?: LegacyBadgeColor;
	variant?: LegacyBadgeVariant;
}

const BadgeInternal = ({ color, variant, ...props }: BadgeProps) => {
	return (
		<HeroBadge
			{...props}
			color={mapBadgeColor(color)}
			variant={mapBadgeVariant(variant)}
		/>
	);
};

export const Badge = Object.assign(BadgeInternal, HeroBadge);
