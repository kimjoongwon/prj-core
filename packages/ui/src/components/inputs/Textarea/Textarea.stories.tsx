import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
	title: "Inputs/Textarea",
	component: Textarea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Description",
		placeholder: "Enter a description...",
	},
	render: (args) => {
		const [value, setValue] = useState("");
		return <Textarea {...args} value={value} onChange={setValue} />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Description",
	},
	render: (args) => {
		const [value, setValue] = useState("This is a default description.");
		return <Textarea {...args} value={value} onChange={setValue} />;
	},
};
