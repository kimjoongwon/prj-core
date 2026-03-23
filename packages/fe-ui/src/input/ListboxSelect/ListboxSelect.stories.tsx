import type { Meta, StoryObj } from "@storybook/react";
import { ListboxSelect } from "./ListboxSelect";

const meta: Meta<typeof ListboxSelect> = {
	title: "Inputs/ListboxSelect",
	component: ListboxSelect,
	args: {
		"aria-label": "샘플 리스트박스 선택",
	},
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
	{ text: "Option 1", value: "1" },
	{ text: "Option 2", value: "2" },
	{ text: "Option 3", value: "3" },
];

export const Default: Story = {
	args: {
		title: "Select an option",
		options,
		selectionMode: "single",
		defaultSelectedKeys: ["1"],
	},
};

export const MultiSelect: Story = {
	args: {
		title: "Select multiple options",
		options,
		selectionMode: "multiple",
		defaultSelectedKeys: ["1", "3"],
	},
};
