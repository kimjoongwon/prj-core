import type { Meta, StoryObj } from "@storybook/react";
import { ProgramPickerModal } from "./ProgramPickerModal";

const options = [
	{ id: "program-yoga", name: "모닝 요가", subtitle: "초급 / 60분" },
	{ id: "program-pilates", name: "리포머 필라테스", subtitle: "중급 / 50분" },
];

const meta = {
	title: "feature/ProgramPickerModal",
	component: ProgramPickerModal,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		isOpen: true,
		onClose: () => undefined,
		title: "프로그램 선택",
		searchLabel: "검색",
		searchPlaceholder: "프로그램명",
		searchValue: "",
		onSearchValueChange: () => undefined,
		options,
		selectedId: "program-yoga",
		onSelect: () => undefined,
	},
} satisfies Meta<typeof ProgramPickerModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = {
	args: { options: [], searchValue: "없는 프로그램" },
};
