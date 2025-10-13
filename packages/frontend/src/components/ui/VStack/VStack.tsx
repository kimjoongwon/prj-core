import type { ReactNode } from "react";

export type VStackProps = {
	children?: ReactNode;
	className?: string;
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	fullWidth?: boolean;
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
};

import { cva } from "class-variance-authority";

const vStackVariants = cva("flex flex-col", {
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
			0: "gap-0",
			1: "gap-1",
			2: "gap-2",
			3: "gap-3",
			4: "gap-4",
			5: "gap-5",
			6: "gap-6",
			8: "gap-8",
			10: "gap-10",
			12: "gap-12",
			16: "gap-16",
			20: "gap-20",
			24: "gap-24",
		},
	},
	defaultVariants: {
		fullWidth: false,
		gap: 4,
	},
});

export const VStack = (props: VStackProps) => {
	const { children, className, alignItems, justifyContent, fullWidth, gap } =
		props;

	return (
		<div
			className={vStackVariants({
				alignItems,
				justifyContent,
				fullWidth,
				gap,
				className,
			})}
		>
			{children}
		</div>
	);
};
