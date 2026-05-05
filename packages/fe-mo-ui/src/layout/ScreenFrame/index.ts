import {
	createElement,
	forwardRef,
	type ReactNode,
} from "react";
import {
	StyleSheet,
	View,
	type StyleProp,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ScreenFrameEdge = "top" | "right" | "bottom" | "left";

export interface ScreenFrameProps extends Omit<ViewProps, "children" | "style"> {
	backgroundColor?: string;
	children?: ReactNode;
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

export const ScreenFrame = forwardRef<View, ScreenFrameProps>(
	(
		{
			backgroundColor = "transparent",
			children,
			contentStyle,
			edges = DEFAULT_EDGES,
			style,
			...rest
		},
		ref,
	) => {
		const insets = useSafeAreaInsets();

		return createElement(
			View,
			{
				...rest,
				ref,
				style: [
					styles.frame,
					{
						backgroundColor,
						paddingBottom: hasEdge(edges, "bottom") ? insets.bottom : 0,
						paddingLeft: hasEdge(edges, "left") ? insets.left : 0,
						paddingRight: hasEdge(edges, "right") ? insets.right : 0,
						paddingTop: hasEdge(edges, "top") ? insets.top : 0,
					},
					style,
				],
			},
			createElement(View, { style: [styles.content, contentStyle] }, children),
		);
	},
);

ScreenFrame.displayName = "ScreenFrame";

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	frame: {
		flex: 1,
	},
});
