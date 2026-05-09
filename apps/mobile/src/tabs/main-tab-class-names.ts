import { tv } from "tailwind-variants";

export const mainTabClassNames = tv({
	slots: {
		contentContainer: "px-5 pb-9 pt-5",
		profileCard:
			"gap-4 rounded-[18px] border border-[#353126] bg-[#181712] p-[18px]",
		root: "flex-1 bg-[#0c0f0b]",
		screenFrame: "bg-[#0c0f0b]",
		sectionDescription: "text-sm leading-[21px] text-stone-400",
		sectionTitle: "text-[22px] font-extrabold text-[#fffaf0]",
		sessionLabel: "text-sm text-stone-400",
		sessionRow:
			"flex-row items-center justify-between rounded-xl bg-[#111310] p-[14px]",
		sessionValue: "text-sm font-bold text-green-300",
		tabContent: "gap-[18px]",
	},
});
