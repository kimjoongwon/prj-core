import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
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

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ value: args.state?.value || '' }));
	return <Input {...args} state={state} path="value" />;
};

export const Default: Story = {
	args: {
		label: "Default Input",
		placeholder: "Enter text...",
		state: { value: "" },
	},
	render: Template,
};

export const WithInitialValue: Story = {
	args: {
		label: "Input with Initial Value",
		state: { value: "Hello, Storybook!" },
	},
	render: Template,
};

export const NumberType: Story = {
	args: {
		label: "Number Input",
		type: "number",
		state: { value: 123 },
	},
	render: Template,
};

export const WithError: Story = {
	args: {
		label: "Input with Error",
		isInvalid: true,
		errorMessage: "This field is required.",
		state: { value: "" },
	},
	render: Template,
};
