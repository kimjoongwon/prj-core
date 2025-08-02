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
		state: {
			description: "MobX state object for form integration",
		},
		path: {
			control: "text",
			description: "Path in the state object to bind the value",
		},
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countryOptions = [
	{ key: "1", value: "kr", label: "Korea" },
	{ key: "2", value: "us", label: "United States" },
	{ key: "3", value: "jp", label: "Japan" },
	{ key: "4", value: "cn", label: "China" },
	{ key: "5", value: "uk", label: "United Kingdom" },
];

const roleOptions = [
	{ key: "1", value: "admin", label: "Admin" },
	{ key: "2", value: "editor", label: "Editor" },
	{ key: "3", value: "viewer", label: "Viewer" },
	{ key: "4", value: "guest", label: "Guest" },
];

const categoryOptions = [
	{ key: "1", value: "tech", label: "Technology" },
	{ key: "2", value: "design", label: "Design" },
	{ key: "3", value: "marketing", label: "Marketing" },
	{ key: "4", value: "sales", label: "Sales" },
	{ key: "5", value: "finance", label: "Finance" },
	{ key: "6", value: "operations", label: "Operations" },
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

export const WithLabel: Story = {
	args: {
		options: roleOptions,
		placeholder: "Choose your role",
		label: "User Role",
		isRequired: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Select with label and required indicator.",
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		options: countryOptions,
		placeholder: "Select a country",
		label: "Country",
		isDisabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Disabled select component.",
			},
		},
	},
};

export const Sizes: Story = {
	args: {
		options: categoryOptions,
		state: {},
		path: "selectedValue",
	},
	render: (args) => (
		<div className="flex flex-col gap-4 w-80">
			<Select
				{...args}
				placeholder="Small size"
				label="Small"
				size="sm"
				state={{
					selectedValue: "",
				}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Medium size"
				label="Medium"
				size="md"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Large size"
				label="Large"
				size="lg"
				state={{}}
				path="selectedValue"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different sizes of the select component.",
			},
		},
	},
};

export const Variants: Story = {
	args: {
		options: roleOptions,
		state: {},
		path: "selectedValue",
	},
	render: (args) => (
		<div className="flex flex-col gap-4 w-80">
			<Select
				{...args}
				placeholder="Flat variant"
				label="Flat"
				variant="flat"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Bordered variant"
				label="Bordered"
				variant="bordered"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Faded variant"
				label="Faded"
				variant="faded"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Underlined variant"
				label="Underlined"
				variant="underlined"
				state={{}}
				path="selectedValue"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different visual variants of the select component.",
			},
		},
	},
};

export const Colors: Story = {
	args: {
		options: categoryOptions,
		state: {},
		path: "selectedValue",
	},
	render: (args) => (
		<div className="flex flex-col gap-4 w-80">
			<Select
				{...args}
				placeholder="Default color"
				label="Default"
				color="default"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Primary color"
				label="Primary"
				color="primary"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Secondary color"
				label="Secondary"
				color="secondary"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Success color"
				label="Success"
				color="success"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Warning color"
				label="Warning"
				color="warning"
				state={{}}
				path="selectedValue"
			/>
			<Select
				{...args}
				placeholder="Danger color"
				label="Danger"
				color="danger"
				state={{}}
				path="selectedValue"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different color themes of the select component.",
			},
		},
	},
};

export const FormExample: Story = {
	args: {
		options: countryOptions,
		state: {},
		path: "selectedValue",
	},
	render: (args) => (
		<div className="max-w-md p-6 bg-white border rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-4">User Information</h3>
			<div className="flex flex-col gap-4">
				<Select
					options={countryOptions}
					placeholder="Select country"
					label="Country"
					isRequired
					state={{}}
					path="country"
				/>
				<Select
					options={roleOptions}
					placeholder="Select role"
					label="Role"
					isRequired
					state={{}}
					path="role"
				/>
				<Select
					options={categoryOptions}
					placeholder="Select department"
					label="Department"
					state={{}}
					path="department"
				/>
				<button
					type="button"
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				>
					Submit
				</button>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Select components used in a form layout.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		options: countryOptions,
		placeholder: "Select an option",
		label: "Label",
		size: "md",
		variant: "bordered",
		color: "default",
		isRequired: false,
		isDisabled: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different select configurations.",
			},
		},
	},
};
