import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { tv } from "tailwind-variants";

export type ResponsiveFrameSize = "fo" | "mo" | "pc";
export type ResponsiveFrameWidth = NonNullable<ViewStyle["width"]>;

export interface ResponsiveFrameProps extends Omit<ViewProps, "children"> {
	children?: ReactNode;
	size?: ResponsiveFrameSize;
	width?: ResponsiveFrameWidth;
}

export const RESPONSIVE_FRAME_WIDTHS = {
	fo: 1200,
	mo: 375,
	pc: 1200,
} as const satisfies Record<ResponsiveFrameSize, ResponsiveFrameWidth>;

const responsiveFrameClassNames = tv({
	slots: {
		frame: "min-w-0 shrink-0",
	},
});

function getResponsiveFrameWidth(
	size: ResponsiveFrameSize,
	width?: ResponsiveFrameWidth,
) {
	return width ?? RESPONSIVE_FRAME_WIDTHS[size];
}

/**
 * ResponsiveFrame 컴포넌트
 * 자식 반응형 컴포넌트가 판정할 부모 너비를 고정하는 layout wrapper입니다.
 */
export const ResponsiveFrame = forwardRef<View, ResponsiveFrameProps>(
	({ children, className, size = "fo", style, width, ...props }, ref) => {
		const frameWidth = getResponsiveFrameWidth(size, width);

		return (
			<View
				{...props}
				className={responsiveFrameClassNames().frame({ className })}
				ref={ref}
				style={[
					style,
					{
						width: frameWidth,
					},
				]}
			>
				{children}
			</View>
		);
	},
);

ResponsiveFrame.displayName = "ResponsiveFrame";
