import { tv } from "tailwind-variants";

export const mainTabClassNames = tv({
	slots: {
		contentContainer: "px-5 pb-9 pt-5",
		profileCard:
			"gap-4 rounded-[18px] border border-border bg-surface p-[18px] shadow-surface",
		root: "flex-1 bg-background",
		screenFrame: "bg-background",
		sectionDescription: "text-sm leading-[21px] text-muted",
		sectionTitle: "text-[22px] font-extrabold text-foreground",
		sessionLabel: "text-sm text-muted",
		sessionRow:
			"flex-row items-center justify-between rounded-xl bg-surface-secondary p-[14px]",
		sessionValue: "text-sm font-bold text-success",
		tabContent: "gap-[18px]",
	},
});
