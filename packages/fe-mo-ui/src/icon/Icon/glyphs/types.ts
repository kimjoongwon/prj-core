import type { ColorValue } from "react-native";
import type { SvgProps } from "react-native-svg";

export interface IconGlyphProps extends Omit<SvgProps, "color"> {
	color?: ColorValue;
	size?: number;
	strokeWidth?: number;
}
