import { tv } from "tailwind-variants";

export const quickActionListClassNames = tv({
	slots: {
		description: "text-[13px] font-medium leading-5 text-muted",
		empty:
			"min-h-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-6",
		emptyText: "text-center text-sm font-semibold leading-5 text-muted",
		iconFrame: "size-9 items-center justify-center rounded-lg bg-accent-soft",
		item: "min-h-14",
		label: "text-sm font-bold leading-5 text-foreground",
		list: "rounded-xl border border-border bg-surface",
		suffix: "opacity-80",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				description: "text-muted/70",
				iconFrame: "bg-surface-secondary",
				item: "opacity-60",
				label: "text-muted",
				suffix: "opacity-40",
			},
		},
	},
});
