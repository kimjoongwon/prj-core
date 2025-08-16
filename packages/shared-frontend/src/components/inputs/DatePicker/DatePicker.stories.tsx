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
		placeholder: {
			description: "Placeholder text for the date picker",
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

// Helper component to wrap DatePicker with React state
const DatePickerWrapper = (args: any) => {
	const [value, setValue] = useState(args.initialDate || new Date().toISOString());

	return <DatePicker {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
	args: {
		label: "Select Date",
		placeholder: "Choose a date",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const WithInitialValue: Story = {
	args: {
		label: "Appointment Date",
		placeholder: "Choose a date",
		initialDate: "2024-12-25T10:00:00.000Z",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const Required: Story = {
	args: {
		label: "Birth Date",
		placeholder: "Enter your birth date",
		isRequired: true,
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const Disabled: Story = {
	args: {
		label: "Disabled Date",
		placeholder: "Cannot select date",
		isDisabled: true,
		initialDate: "2024-01-01T00:00:00.000Z",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const ReadOnly: Story = {
	args: {
		label: "Read Only Date",
		placeholder: "View only",
		isReadOnly: true,
		initialDate: "2024-06-15T00:00:00.000Z",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const Variants: Story = {
	args: {
		label: "Bordered Variant",
		placeholder: "Select date",
		variant: "bordered",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const Sizes: Story = {
	args: {
		label: "Large Size",
		placeholder: "Select date",
		size: "lg",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const Colors: Story = {
	args: {
		label: "Primary Color",
		placeholder: "Select date",
		color: "primary",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const CustomStyling: Story = {
	args: {
		label: "Event Date",
		placeholder: "When is your event?",
		variant: "bordered",
		size: "lg",
		color: "secondary",
		radius: "lg",
		className: "max-w-xs",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};

export const WithDescription: Story = {
	args: {
		label: "Meeting Date",
		placeholder: "Select meeting date",
		description: "Choose a date for the team meeting",
	},
	render: (args) => <DatePickerWrapper {...args} />,
};
