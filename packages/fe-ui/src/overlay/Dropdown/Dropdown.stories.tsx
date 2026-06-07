import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
	title: "overlay/Dropdown",
	component: Dropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		trigger: "Open Dropdown",
		dropdownItems: [
			{ key: "item1", label: "Item 1" },
			{ key: "item2", label: "Item 2" },
		],
		onAction: (key) => alert(`${key} clicked`),
	},
};
