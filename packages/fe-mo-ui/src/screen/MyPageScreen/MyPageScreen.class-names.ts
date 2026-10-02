import { tv } from "tailwind-variants";

export const myPageScreenClassNames = tv({
	slots: {
		accountDescription: "text-sm font-medium leading-5 text-muted",
		accountName: "text-lg font-extrabold leading-7 text-foreground",
		accountTitleBlock: "min-w-0 flex-1",
		card: "rounded-xl border border-border bg-surface p-4",
		contentContainer: "px-4 pb-8 pt-5",
		dangerButtonText: "text-sm font-bold text-danger",
		screenFrame: "bg-background",
		sectionLabel: "px-1 text-xs font-bold uppercase leading-4 text-muted",
		spaceLabel: "text-xs font-bold uppercase leading-4 text-muted",
		spaceName: "text-base font-bold leading-6 text-foreground",
	},
});
