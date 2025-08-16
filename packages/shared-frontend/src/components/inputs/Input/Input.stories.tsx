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
		const [value, setValue] = useState("");
		return <Input {...args} value={value} onChange={setValue} />;
	},
};

export const WithInitialValue: Story = {
	args: {
		label: "Input with Initial Value",
	},
	render: (args) => {
		const [value, setValue] = useState("Hello, Storybook!");
		return <Input {...args} value={value} onChange={setValue} />;
	},
};

export const NumberType: Story = {
	args: {
		label: "Number Input",
		type: "number",
	},
	render: (args) => {
		const [value, setValue] = useState("123");
		return <Input {...args} value={value} onChange={setValue} />;
	},
};

export const WithError: Story = {
	args: {
		label: "Input with Error",
		isInvalid: true,
		errorMessage: "This field is required.",
	},
	render: (args) => {
		const [value, setValue] = useState("");
		return <Input {...args} value={value} onChange={setValue} />;
	},
};
