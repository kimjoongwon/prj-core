import type { ReactNode } from "react";
import { G, Svg } from "react-native-svg";
import type { IconGlyphProps } from "./types";

interface BrandedSvgProps extends IconGlyphProps {
	children: ReactNode;
}

export const BrandedSvg = ({
	children,
	color = "currentColor",
	size = 24,
	strokeWidth = 2,
	...props
}: BrandedSvgProps) => (
	<Svg {...props} fill="none" height={size} viewBox="0 0 24 24" width={size}>
		<G
			stroke={color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
		>
			{children}
		</G>
	</Svg>
);
