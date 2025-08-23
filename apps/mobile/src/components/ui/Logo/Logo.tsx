import React from "react";
import { Text } from "@/components/ui/Text";
import type { TextProps } from "@/components/ui/Text/Text";

export type LogoSize = "sm" | "md" | "lg";

export interface LogoProps extends Omit<TextProps, "variant" | "children"> {
	size?: LogoSize;
}

const sizeVariants: Record<LogoSize, TextProps["variant"]> = {
	sm: "h6",
	md: "h3",
	lg: "h1",
};

export const Logo: React.FC<LogoProps> = ({
	size = "md",
	color = "primary",
	...props
}) => {
	return (
		<Text variant={sizeVariants[size]} color={color} {...props}>
			플레이트
		</Text>
	);
};

export default Logo;
