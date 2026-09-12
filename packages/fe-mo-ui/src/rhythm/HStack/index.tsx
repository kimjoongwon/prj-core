import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { joinClassNames } from "../class-name";
import { stackGapRootClasses, type StackGap } from "../stack-gap";

export interface HStackProps extends Omit<ViewProps, "children"> {
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	children?: ReactNode;
	/** 가로 간격. 시맨틱 값은 DESIGN.md의 Rhythm Primitives 표를 따름 (기본: inline=8px) */
	gap?: StackGap;
	fullWidth?: boolean;
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const hStackClassNames = tv({
	slots: {
		root: "flex-row",
	},
	variants: {
		alignItems: {
			baseline: {
				root: "items-baseline",
			},
			center: {
				root: "items-center",
			},
			end: {
				root: "items-end",
			},
			start: {
				root: "items-start",
			},
			stretch: {
				root: "items-stretch",
			},
		},
		fullWidth: {
			false: {},
			true: {
				root: "w-full",
			},
		},
		justifyContent: {
			around: {
				root: "justify-around",
			},
			between: {
				root: "justify-between",
			},
			center: {
				root: "justify-center",
			},
			end: {
				root: "justify-end",
			},
			evenly: {
				root: "justify-evenly",
			},
			start: {
				root: "justify-start",
			},
		},
		gap: stackGapRootClasses,
	},
	defaultVariants: {
		gap: "inline",
	},
});

export const HStack = forwardRef<View, HStackProps>(
	(
		{
			alignItems,
			children,
			className,
			gap,
			fullWidth = false,
			justifyContent,
			...rest
		},
		ref,
	) => {
		const classNames = hStackClassNames({
			alignItems,
			gap,
			fullWidth,
			justifyContent,
		});

		return (
			<View
				{...rest}
				className={joinClassNames(classNames.root(), className)}
				ref={ref}
			>
				{children}
			</View>
		);
	},
);
HStack.displayName = "HStack";
