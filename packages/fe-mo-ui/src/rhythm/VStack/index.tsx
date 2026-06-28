import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { joinClassNames } from "../class-name";

export interface VStackProps extends Omit<ViewProps, "children"> {
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	children?: ReactNode;
	fullWidth?: boolean;
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const vStackClassNames = tv({
	slots: {
		root: "flex-col gap-4",
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
	},
});

export const VStack = forwardRef<View, VStackProps>(
	(
		{
			alignItems,
			children,
			className,
			fullWidth = false,
			justifyContent,
			...rest
		},
		ref,
	) => {
		const classNames = vStackClassNames({
			alignItems,
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
VStack.displayName = "VStack";
