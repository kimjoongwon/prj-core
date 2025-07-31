import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
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

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ value: args.state?.value || "" }));
	return <RadioGroup {...args} state={state} path="value" />;
};

export const Default: Story = {
	args: {
		label: "Select an option",
		options,
		state: { value: "" },
	},
	render: Template,
};

export const WithInitialValue: Story = {
	args: {
		label: "Select an option",
		options,
		state: { value: "2" },
	},
	render: Template,
};
