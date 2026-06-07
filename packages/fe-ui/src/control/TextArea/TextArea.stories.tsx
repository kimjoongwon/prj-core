import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
	title: "control/TextArea",
	component: TextArea,
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
		return <TextArea {...args} value={value} onChange={setValue} />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Description",
	},
	render: (args) => {
		const [value, setValue] = useState("This is a default description.");
		return <TextArea {...args} value={value} onChange={setValue} />;
	},
};
