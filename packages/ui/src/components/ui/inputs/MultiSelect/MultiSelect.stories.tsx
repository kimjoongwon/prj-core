import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "./MultiSelect";

const meta: Meta<typeof MultiSelect> = {
	title: "Inputs/MultiSelect",
	component: MultiSelect,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
	{ name: "Option 1", value: "1" },
	{ name: "Option 2", value: "2" },
	{ name: "Option 3", value: "3" },
];

const Template: Story["render"] = (args) => {
	return <MultiSelect {...args} />;
};

export const Default: Story = {
	args: {
		label: "Select options",
		placeholder: "Choose multiple options",
		options,
	},
	render: Template,
};

export const WithInitialValues: Story = {
	args: {
		label: "Select options",
		options,
	},
	render: Template,
};
