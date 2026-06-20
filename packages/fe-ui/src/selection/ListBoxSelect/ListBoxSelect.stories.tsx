import type { Meta, StoryObj } from "@storybook/react";
import { ListBoxSelect } from "./ListBoxSelect";

const meta: Meta<typeof ListBoxSelect> = {
	title: "selection/ListBoxSelect",
	component: ListBoxSelect,
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
		defaultValue: "1",
	},
};

export const MultiSelect: Story = {
	args: {
		title: "Select multiple options",
		options,
		selectionMode: "multiple",
		defaultValue: ["1", "3"],
	},
};
