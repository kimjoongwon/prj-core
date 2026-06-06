import { Chip as HeroChip } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type LegacyColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";

type LegacyChipVariant =
	| ComponentProps<typeof HeroChip>["variant"]
	| "flat"
	| "light"
	| "bordered"
	| "solid"
	| "dot"
	| "faded"
	| "shadow";

const mapAccentColor = (color?: LegacyColor) => {
	if (color === "primary" || color === "secondary") return "accent";
	return color;
};

const mapChipVariant = (
	variant?: LegacyChipVariant,
): ComponentProps<typeof HeroChip>["variant"] => {
	if (variant === "flat" || variant === "light") return "soft";
	if (variant === "faded") return "soft";
	if (variant === "bordered" || variant === "dot") return "tertiary";
	if (variant === "solid" || variant === "shadow") return "primary";
	return variant;
};

export interface ChipProps
	extends Omit<
		ComponentProps<typeof HeroChip>,
		"children" | "color" | "variant"
	> {
	children?: ReactNode;
	color?: LegacyColor;
	variant?: LegacyChipVariant;
	startContent?: ReactNode;
	endContent?: ReactNode;
	isDisabled?: boolean;
	title?: string;
	onClose?: () => void;
}

/**
 * Chip 컴포넌트
 * HeroUI Chip의 래퍼 컴포넌트입니다.
 */
export function Chip(props: ChipProps) {
	const {
		children,
		color,
		endContent,
		isDisabled: _isDisabled,
		onClose: _onClose,
		startContent,
		variant,
		...rest
	} = props;

	return (
		<HeroChip
			{...rest}
			color={mapAccentColor(color)}
			variant={mapChipVariant(variant)}
		>
			{startContent}
			{children}
			{endContent}
		</HeroChip>
	);
}
