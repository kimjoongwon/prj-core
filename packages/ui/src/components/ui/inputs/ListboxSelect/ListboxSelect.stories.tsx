import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ListboxSelect } from "./ListboxSelect";

const meta: Meta<typeof ListboxSelect> = {
	title: "Inputs/ListboxSelect",
	component: ListboxSelect,
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
	},
	render: (args) => {
		const [value, setValue] = useState("1");
		return <ListboxSelect {...args} value={value} onChange={setValue} />;
	},
};

export const MultiSelect: Story = {
	args: {
		title: "Select multiple options",
		options,
		selectionMode: "multiple",
	},
	render: (args) => {
		const [value, setValue] = useState(["1", "3"]);
		return <ListboxSelect {...args} value={value} onChange={setValue} />;
	},
};
