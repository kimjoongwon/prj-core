import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./Section";

const meta = {
	title: "UI/Section",
	component: Section,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A section container component that provides consistent layout structure with border, padding, and spacing for content areas.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "The content to display inside the section",
		},
	},
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Section content",
	},
	parameters: {
		docs: {
			description: {
				story: "Default section with border and padding.",
			},
		},
	},
};

export const WithText: Story = {
	render: () => (
		<Section>
			<h2 className="font-bold text-xl">Section Title</h2>
			<p className="text-gray-600">
				This is a section with some text content. The section provides
				consistent styling with border, padding, and spacing for organized
				layout.
			</p>
		</Section>
	),
	parameters: {
		docs: {
			description: {
				story: "Section with heading and paragraph content.",
			},
		},
	},
};

export const WithForm: Story = {
	render: () => (
		<Section>
			<h3 className="mb-4 font-semibold text-lg">Contact Information</h3>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="fullName"
						className="mb-1 block font-medium text-gray-700 text-sm"
					>
						Full Name
					</label>
					<input
						id="fullName"
						type="text"
						className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your name"
					/>
				</div>
				<div>
					<label
						htmlFor="email"
						className="mb-1 block font-medium text-gray-700 text-sm"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
						placeholder="Enter your email"
					/>
				</div>
				<button
					type="button"
					className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Submit
				</button>
			</div>
		</Section>
	),
	parameters: {
		docs: {
			description: {
				story: "Section containing a form with proper spacing and layout.",
			},
		},
	},
};

export const WithStats: Story = {
	render: () => (
		<Section>
			<h3 className="mb-4 font-semibold text-lg">Dashboard Statistics</h3>
			<div className="grid grid-cols-2 gap-4">
				<div className="rounded bg-blue-50 p-4 text-center">
					<div className="font-bold text-2xl text-blue-600">1,234</div>
					<div className="text-gray-600 text-sm">Total Users</div>
				</div>
				<div className="rounded bg-green-50 p-4 text-center">
					<div className="font-bold text-2xl text-green-600">567</div>
					<div className="text-gray-600 text-sm">Active Projects</div>
				</div>
				<div className="rounded bg-yellow-50 p-4 text-center">
					<div className="font-bold text-2xl text-yellow-600">89</div>
					<div className="text-gray-600 text-sm">Pending Tasks</div>
				</div>
				<div className="rounded bg-purple-50 p-4 text-center">
					<div className="font-bold text-2xl text-purple-600">12</div>
					<div className="text-gray-600 text-sm">Team Members</div>
				</div>
			</div>
		</Section>
	),
	parameters: {
		docs: {
			description: {
				story: "Section displaying statistics in a grid layout.",
			},
		},
	},
};

export const WithList: Story = {
	render: () => (
		<Section>
			<h3 className="mb-4 font-semibold text-lg">Recent Activities</h3>
			<div className="space-y-3">
				{[
					{
						action: "User registered",
						time: "2 minutes ago",
						status: "success",
					},
					{
						action: "New project created",
						time: "5 minutes ago",
						status: "info",
					},
					{
						action: "Task completed",
						time: "10 minutes ago",
						status: "success",
					},
					{
						action: "Error in deployment",
						time: "15 minutes ago",
						status: "error",
					},
				].map((item) => (
					<div
						key={item.action}
						className="flex items-center justify-between rounded bg-gray-50 p-3"
					>
						<div className="flex items-center space-x-3">
							<div
								className={`h-2 w-2 rounded-full ${
									item.status === "success"
										? "bg-green-500"
										: item.status === "error"
											? "bg-red-500"
											: "bg-blue-500"
								}`}
							/>
							<span className="text-sm">{item.action}</span>
						</div>
						<span className="text-gray-500 text-xs">{item.time}</span>
					</div>
				))}
			</div>
		</Section>
	),
	parameters: {
		docs: {
			description: {
				story: "Section with a list of activities or notifications.",
			},
		},
	},
};

export const NestedSections: Story = {
	render: () => (
		<div className="max-w-2xl space-y-4">
			<Section>
				<h2 className="mb-4 font-bold text-xl">Main Section</h2>
				<p className="mb-4 text-gray-600">
					This is the main section containing nested subsections.
				</p>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Section>
						<h4 className="mb-2 font-semibold">Subsection A</h4>
						<p className="text-gray-600 text-sm">
							Content for the first subsection with its own styling.
						</p>
					</Section>

					<Section>
						<h4 className="mb-2 font-semibold">Subsection B</h4>
						<p className="text-gray-600 text-sm">
							Content for the second subsection demonstrating layout
							flexibility.
						</p>
					</Section>
				</div>
			</Section>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Nested sections demonstrating hierarchical content organization.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		children: "Playground section content",
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different section configurations.",
			},
		},
	},
};
