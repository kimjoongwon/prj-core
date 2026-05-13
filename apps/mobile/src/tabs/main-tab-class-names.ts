import { tv } from "tailwind-variants";

export const mainTabClassNames = tv({
	slots: {
		buttonContent: "flex-row items-center justify-center gap-2",
		contentContainer: "px-4 pb-8 pt-4",
		dangerButtonText: "text-sm font-semibold text-danger",
		profileCard:
			"gap-4 rounded-lg border border-border bg-surface p-4",
		root: "flex-1 bg-background",
		screenFrame: "bg-background",
		sectionDescription: "text-[13px] leading-5 text-muted",
		sectionTitle: "text-xl font-extrabold leading-7 text-foreground",
		sessionLabel: "text-[13px] font-medium leading-5 text-muted",
		sessionLabelRow: "flex-row items-center gap-1.5",
		sessionRow:
			"flex-row items-center justify-between rounded-lg border border-border bg-surface-secondary px-3 py-2",
		sessionValue: "text-[13px] font-extrabold leading-5 text-success",
		tabContent: "gap-4",
	},
});
