import { type ThemeColor, useThemeColor } from "heroui-native";
import type { ColorValue } from "react-native";
import { type IconGlyphProps, mobileIcons } from "./glyphs";

export { mobileIcons };

export type MobileIconName = keyof typeof mobileIcons;
export type IconSize = "xs" | "sm" | "md" | "lg";
export type IconTone =
	| "accent"
	| "accentForeground"
	| "danger"
	| "foreground"
	| "muted"
	| "success"
	| "warning";

export interface IconProps
	extends Omit<
		IconGlyphProps,
		"color" | "height" | "size" | "strokeWidth" | "width"
	> {
	color?: ColorValue;
	name: MobileIconName;
	size?: IconSize | number;
	strokeWidth?: number;
	tone?: IconTone;
}

const ICON_SIZE_VALUES: Record<IconSize, number> = {
	lg: 22,
	md: 18,
	sm: 16,
	xs: 14,
};

const ICON_TONE_COLORS: Record<IconTone, ThemeColor> = {
	accent: "accent",
	accentForeground: "accent-foreground",
	danger: "danger",
	foreground: "foreground",
	muted: "muted",
	success: "success",
	warning: "warning",
};

const resolveIconSize = (size: IconSize | number) =>
	typeof size === "number" ? size : ICON_SIZE_VALUES[size];

export const Icon = ({
	color,
	name,
	size = "sm",
	strokeWidth = 1.75,
	tone = "foreground",
	...props
}: IconProps) => {
	const IconGlyph = mobileIcons[name];
	const toneColor = useThemeColor(ICON_TONE_COLORS[tone]);
	return (
		<IconGlyph
			{...props}
			color={color ?? toneColor}
			size={resolveIconSize(size)}
			strokeWidth={strokeWidth}
		/>
	);
};

Icon.displayName = "Icon";
