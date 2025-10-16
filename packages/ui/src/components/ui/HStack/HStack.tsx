import type { ReactNode } from "react";

export interface HStackProps {
	children?: ReactNode;
	className?: string;
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	fullWidth?: boolean;
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
}

import { cva } from "class-variance-authority";

const hStackVariants = cva("flex", {
	variants: {
		alignItems: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justifyContent: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		fullWidth: {
			true: "w-full",
			false: "",
		},
		gap: {
			0: "gap-[0px]",
			1: "gap-[1px]",
			2: "gap-[2px]",
			3: "gap-[3px]",
			4: "gap-[4px]",
			5: "gap-[5px]",
			6: "gap-[6px]",
			8: "gap-[8px]",
			10: "gap-[10px]",
			12: "gap-[12px]",
			16: "gap-[16px]",
			20: "gap-[20px]",
			24: "gap-[24px]",
		},
	},
	defaultVariants: {
		fullWidth: false,
		gap: 4,
	},
});

export const HStack = (props: HStackProps) => {
	const {
		children,
		className,
		alignItems,
		justifyContent,
		fullWidth,
		gap,
		...rest
	} = props;

	return (
		<div
			className={hStackVariants({
				alignItems,
				justifyContent,
				fullWidth,
				gap,
				className,
			})}
			{...rest}
		>
			{children}
		</div>
	);
};
