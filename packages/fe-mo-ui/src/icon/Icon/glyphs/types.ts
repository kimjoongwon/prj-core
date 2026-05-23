import type { SvgProps } from "react-native-svg";

export interface IconGlyphProps extends Omit<SvgProps, "color"> {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
