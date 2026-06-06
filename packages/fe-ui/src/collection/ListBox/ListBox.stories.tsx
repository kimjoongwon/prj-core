import type { Meta, StoryObj } from "@storybook/react";
import { ListBox } from "./ListBox";

const meta: Meta<typeof ListBox> = {
	title: "Collections/ListBox",
	component: ListBox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleOptions = [
	{ text: "옵션 1", value: "1" },
	{ text: "옵션 2", value: "2" },
	{ text: "옵션 3", value: "3" },
	{ text: "옵션 4", value: "4" },
];

export const Default: Story = {
	args: {
		title: "단일 선택",
		options: sampleOptions,
		selectionMode: "single",
		defaultValue: "2",
	},
};

export const Multi: Story = {
	args: {
		title: "다중 선택",
		options: sampleOptions,
		selectionMode: "multiple",
		defaultValue: ["1", "3"],
	},
};

export const Disabled: Story = {
	args: {
		title: "비활성 항목 포함",
		options: [
			{ text: "옵션 1", value: "1" },
			{ text: "옵션 2", value: "2", isDisabled: true },
			{ text: "옵션 3", value: "3" },
		],
		selectionMode: "single",
		defaultValue: "1",
	},
};
