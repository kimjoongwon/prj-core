import type { Meta, StoryObj } from "@storybook/react";
import { Spacer } from "./Spacer";

const meta = {
	title: "UI/Spacer",
	component: Spacer,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A utility component that creates empty space with configurable size. Useful for adding consistent spacing between elements.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "number", min: 1, max: 200 },
			description: "Size of the spacer in pixels",
			defaultValue: 4,
		},
		direction: {
			control: "select",
			options: ["vertical", "horizontal"],
			description: "Direction of the spacer",
			defaultValue: "vertical",
		},
		className: {
			control: "text",
			description: "Additional CSS classes to apply",
		},
	},
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		size: 16,
	},
	render: (args) => (
		<div className="border-2 border-gray-300 border-dashed">
			<div className="bg-blue-200 p-2">Content Above</div>
			<Spacer {...args} />
			<div className="bg-green-200 p-2">Content Below</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Default vertical spacer creating space between elements.",
			},
		},
	},
};

export const VerticalSizes: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border border-gray-300 p-2">
				<div className="bg-blue-200 p-1 text-center">Small (8px)</div>
				<Spacer size={8} />
				<div className="bg-green-200 p-1 text-center">Content</div>
			</div>

			<div className="border border-gray-300 p-2">
				<div className="bg-blue-200 p-1 text-center">Medium (16px)</div>
				<Spacer size={16} />
				<div className="bg-green-200 p-1 text-center">Content</div>
			</div>

			<div className="border border-gray-300 p-2">
				<div className="bg-blue-200 p-1 text-center">Large (32px)</div>
				<Spacer size={32} />
				<div className="bg-green-200 p-1 text-center">Content</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Different vertical spacer sizes demonstrating spacing variations.",
			},
		},
	},
};

export const HorizontalSpacer: Story = {
	args: {
		size: 24,
		direction: "horizontal",
	},
	render: (args) => (
		<div className="flex items-center border-2 border-gray-300 border-dashed p-4">
			<div className="bg-blue-200 p-2">Left Content</div>
			<Spacer {...args} />
			<div className="bg-green-200 p-2">Right Content</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Horizontal spacer creating space between side-by-side elements.",
			},
		},
	},
};

export const HorizontalSizes: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="flex items-center border border-gray-300 p-2">
				<div className="bg-blue-200 p-1">Small</div>
				<Spacer size={8} direction="horizontal" />
				<div className="bg-green-200 p-1">8px</div>
			</div>

			<div className="flex items-center border border-gray-300 p-2">
				<div className="bg-blue-200 p-1">Medium</div>
				<Spacer size={16} direction="horizontal" />
				<div className="bg-green-200 p-1">16px</div>
			</div>

			<div className="flex items-center border border-gray-300 p-2">
				<div className="bg-blue-200 p-1">Large</div>
				<Spacer size={32} direction="horizontal" />
				<div className="bg-green-200 p-1">32px</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different horizontal spacer sizes for side-by-side layouts.",
			},
		},
	},
};

export const InFormLayout: Story = {
	render: () => (
		<div className="mx-auto max-w-sm rounded-lg border bg-white p-6 shadow">
			<h3 className="font-semibold text-lg">Registration Form</h3>

			<Spacer size={16} />

			<input
				type="text"
				placeholder="First Name"
				className="w-full rounded border p-2"
			/>

			<Spacer size={12} />

			<input
				type="text"
				placeholder="Last Name"
				className="w-full rounded border p-2"
			/>

			<Spacer size={12} />

			<input
				type="email"
				placeholder="Email"
				className="w-full rounded border p-2"
			/>

			<Spacer size={24} />

			<button
				type="button"
				className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				Sign Up
			</button>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Using spacers in form layouts for consistent spacing between form elements.",
			},
		},
	},
};

export const WithCustomClass: Story = {
	args: {
		size: 20,
		className: "bg-red-100 border-2 border-red-300",
	},
	render: (args) => (
		<div className="border-2 border-gray-300 border-dashed">
			<div className="bg-blue-200 p-2">Content Above</div>
			<Spacer {...args} />
			<div className="bg-green-200 p-2">Content Below</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Spacer with custom styling to visualize the space (normally spacers are invisible).",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		size: 16,
		direction: "vertical",
	},
	render: (args) => (
		<div className="border-2 border-gray-300 border-dashed p-4">
			<div className="bg-blue-200 p-2 text-center">First Element</div>
			<Spacer {...args} />
			<div className="bg-green-200 p-2 text-center">Second Element</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different spacer configurations.",
			},
		},
	},
};
