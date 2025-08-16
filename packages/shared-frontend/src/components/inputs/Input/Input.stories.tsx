import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
	title: "Inputs/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Default Input",
		placeholder: "Enter text...",
	},
	render: (args) => {
		const [value, setValue] = useState<string>("");

		return <Input {...args} value={value} onValueChange={setValue} />;
	},
};
