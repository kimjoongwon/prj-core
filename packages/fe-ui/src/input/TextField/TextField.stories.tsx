import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
	title: "input/TextField",
	component: TextField,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: "w-80",
		description: "We'll never share this with anyone else.",
		label: "Email",
		placeholder: "Enter your email",
		type: "email",
	},
	render: (args) => {
		const [value, setValue] = useState("");

		return <TextField {...args} value={value} onValueChange={setValue} />;
	},
};

export const WithPrefixAndSuffix: Story = {
	args: {
		className: "w-80",
		endContent: "USD",
		label: "Price",
		placeholder: "0",
		startContent: "$",
		type: "number",
		variant: "secondary",
	},
	render: (args) => {
		const [value, setValue] = useState("");

		return <TextField {...args} value={value} onValueChange={setValue} />;
	},
};

export const Invalid: Story = {
	args: {
		className: "w-80",
		errorMessage: "Please enter a valid email address.",
		isInvalid: true,
		label: "Email",
		placeholder: "name@example.com",
		type: "email",
		value: "wrong-email",
	},
};
