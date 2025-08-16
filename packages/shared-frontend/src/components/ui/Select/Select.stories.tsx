import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta = {
	title: "UI/Select",
	component: Select,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A select dropdown component based on NextUI Select with MobX integration for form state management.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		options: {
			description: "Array of options to display in the select dropdown",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text when no option is selected",
		},
		label: {
			control: "text",
			description: "Label text for the select component",
		},
		isDisabled: {
			control: "boolean",
			description: "Whether the select is disabled",
		},
		isRequired: {
			control: "boolean",
			description: "Whether the select is required",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Size of the select component",
		},
		variant: {
			control: "select",
			options: ["flat", "bordered", "faded", "underlined"],
			description: "Visual variant of the select",
		},
		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "Color theme of the select",
		},
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
	{ key: "1", value: "kr", text: "Korea" },
	{ key: "2", value: "us", text: "United States" },
	{ key: "3", value: "jp", text: "Japan" },
	{ key: "4", value: "cn", text: "China" },
	{ key: "5", value: "uk", text: "United Kingdom" },
];

export const Default: Story = {
	args: {
		options: countryOptions,
		placeholder: "Select a country",
		label: "Country",
	},
	parameters: {
		docs: {
			description: {
				story: "Default select with country options.",
			},
		},
	},
};
