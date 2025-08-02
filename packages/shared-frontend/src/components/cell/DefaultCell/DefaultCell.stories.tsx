import type { Meta, StoryObj } from "@storybook/react";
import { DefaultCell } from "./DefaultCell";

const meta: Meta<typeof DefaultCell> = {
	title: "Cell/DefaultCell",
	component: DefaultCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "Text or number value to display",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "Default text",
	},
};

export const WithString: Story = {
	args: {
		value: "Sample text content",
	},
};

export const WithNumber: Story = {
	args: {
		value: 42,
	},
};

export const WithZero: Story = {
	args: {
		value: 0,
	},
};

export const WithEmptyString: Story = {
	args: {
		value: "",
	},
};

export const WithLongText: Story = {
	args: {
		value:
			"This is a very long text content that might wrap to multiple lines depending on the container width",
	},
};
