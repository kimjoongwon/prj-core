import type { Meta, StoryObj } from "@storybook/react";
import { DateTimeCell } from "./DateTimeCell";

const meta: Meta<typeof DateTimeCell> = {
	title: "Cell/DateTimeCell",
	component: DateTimeCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "Date string or Date object to display",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "2024-01-15T10:30:00",
	},
};

export const WithDateString: Story = {
	args: {
		value: "2024-01-15T14:25:30",
	},
};

export const WithDateObject: Story = {
	args: {
		value: new Date("2024-01-15T09:15:45"),
	},
};

export const WithISOString: Story = {
	args: {
		value: "2024-12-25T23:59:59Z",
	},
};

export const WithMorning: Story = {
	args: {
		value: "2024-01-15T06:30:00",
	},
};

export const WithEvening: Story = {
	args: {
		value: "2024-01-15T18:45:00",
	},
};

export const WithNull: Story = {
	args: {
		value: null,
	},
};

export const WithUndefined: Story = {
	args: {
		value: undefined,
	},
};
