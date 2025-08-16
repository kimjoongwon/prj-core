import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
	title: "Inputs/RadioGroup",
	component: RadioGroup,
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
		label: "Select an option",
		options,
	},
	render: (args) => {
		const [value, setValue] = useState("");
		return <RadioGroup {...args} value={value} onChange={setValue} />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Select an option",
		options,
	},
	render: (args) => {
		const [value, setValue] = useState("2");
		return <RadioGroup {...args} value={value} onChange={setValue} />;
	},
};
