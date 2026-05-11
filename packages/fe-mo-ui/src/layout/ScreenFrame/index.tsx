import { forwardRef, type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { tv } from "tailwind-variants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export type ScreenFrameEdge = "top" | "right" | "bottom" | "left";
export interface ScreenFrameProps extends Omit<
  ViewProps,
  "children" | "style"
> {
  backgroundColor?: string;
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
    content: "flex-1",
    frame: "flex-1",
  },
});
export const ScreenFrame = forwardRef<View, ScreenFrameProps>(
  (
    {
      backgroundColor,
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
      </View>
    );
  },
);
ScreenFrame.displayName = "ScreenFrame";
