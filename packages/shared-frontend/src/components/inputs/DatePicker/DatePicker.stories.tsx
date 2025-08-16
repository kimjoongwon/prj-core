import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
	title: "Inputs/DatePicker",
	component: DatePicker,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A date picker component built with HeroUI and React state management.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			description: "Selected date value",
			control: false,
		},
		onChange: {
			description: "Callback function when date changes",
			control: false,
		},
		label: {
			description: "Label for the date picker",
			control: "text",
		},
		isDisabled: {
			description: "Whether the date picker is disabled",
			control: "boolean",
		},
		isReadOnly: {
			description: "Whether the date picker is read-only",
			control: "boolean",
		},
		isRequired: {
			description: "Whether the date picker is required",
			control: "boolean",
		},
		variant: {
			description: "Visual variant of the date picker",
			control: "select",
			options: ["flat", "bordered", "faded", "underlined"],
		},
		size: {
			description: "Size of the date picker",
			control: "select",
			options: ["sm", "md", "lg"],
		},
		color: {
			description: "Color theme of the date picker",
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
		},
		radius: {
			description: "Border radius of the date picker",
			control: "select",
			options: ["none", "sm", "md", "lg", "full"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Select Date",
	},
};
