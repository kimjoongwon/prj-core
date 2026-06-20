import { forwardRef, type ReactNode } from "react";
import {
	type StyleProp,
	View,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
export type ScreenFrameEdge = "top" | "right" | "bottom" | "left";
export interface ScreenFrameProps
	extends Omit<ViewProps, "children" | "style"> {
	backgroundColor?: string;
	bottom?: ReactNode;
	bottomClassName?: string;
	bottomStyle?: StyleProp<ViewStyle>;
	children?: ReactNode;
	contentClassName?: string;
	contentStyle?: StyleProp<ViewStyle>;
	edges?: readonly ScreenFrameEdge[];
	style?: StyleProp<ViewStyle>;
}
const DEFAULT_EDGES: readonly ScreenFrameEdge[] = [
	"top",
	"right",
	"bottom",
	"left",
];
const hasEdge = (edges: readonly ScreenFrameEdge[], edge: ScreenFrameEdge) =>
	edges.includes(edge);
const screenFrameClassNames = tv({
	slots: {
		bottom: "shrink-0",
		content: "flex-1",
		frame: "flex-1",
	},
});
export const ScreenFrame = forwardRef<View, ScreenFrameProps>(
	(
		{
			backgroundColor,
			bottom,
			bottomClassName,
			bottomStyle,
			children,
			className,
			contentClassName,
			contentStyle,
			edges = DEFAULT_EDGES,
			style,
			...rest
		},
		ref,
	) => {
		const insets = useSafeAreaInsets();
		return (
			<View
				{...rest}
				className={screenFrameClassNames().frame({
					className,
				})}
				ref={ref}
				style={[
					{
						...(backgroundColor
							? {
									backgroundColor,
								}
							: {}),
						paddingBottom: hasEdge(edges, "bottom") ? insets.bottom : 0,
						paddingLeft: hasEdge(edges, "left") ? insets.left : 0,
						paddingRight: hasEdge(edges, "right") ? insets.right : 0,
						paddingTop: hasEdge(edges, "top") ? insets.top : 0,
					},
					style,
				]}
			>
				<View
					className={screenFrameClassNames().content({
						className: contentClassName,
					})}
					style={contentStyle}
				>
					{children}
				</View>
				{bottom ? (
					<View
						className={screenFrameClassNames().bottom({
							className: bottomClassName,
						})}
						style={bottomStyle}
					>
						{bottom}
					</View>
				) : null}
			</View>
		);
	},
);
ScreenFrame.displayName = "ScreenFrame";
