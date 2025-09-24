import type { Meta, StoryObj } from "@storybook/react";
import { VStack } from "./VStack";

const meta = {
	title: "UI/VStack",
	component: VStack,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A vertical stack component that arranges children in a column with customizable alignment, spacing, and layout options.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
			description: "Horizontal alignment of items",
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
			description: "Vertical distribution of items",
		},
		gap: {
			control: "select",
			options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
			description: "Gap between items in pixels (Tailwind spacing units)",
			defaultValue: 4,
		},
		fullWidth: {
			control: "boolean",
			description: "Whether the stack should take full width",
			defaultValue: false,
		},
		className: {
			control: "text",
			description: "Additional CSS classes to apply",
		},
	},
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleItem = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={`rounded border bg-blue-200 p-2 ${className}`}>
		{children}
	</div>
);

export const Default: Story = {
	args: {
		children: (
			<>
				<SampleItem>Item 1</SampleItem>
				<SampleItem>Item 2</SampleItem>
				<SampleItem>Item 3</SampleItem>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Default vertical stack with standard gap and alignment.",
			},
		},
	},
};

export const AlignItems: Story = {
	args: {},
	render: () => (
		<div className="w-full max-w-md space-y-4">
			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Start</h4>
				<VStack
					alignItems="start"
					className="w-full border border-gray-300 p-2"
				>
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Center</h4>
				<VStack
					alignItems="center"
					className="w-full border border-gray-300 p-2"
				>
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align End</h4>
				<VStack alignItems="end" className="w-full border border-gray-300 p-2">
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Stretch</h4>
				<VStack
					alignItems="stretch"
					className="w-full border border-gray-300 p-2"
				>
					<SampleItem>Short</SampleItem>
					<SampleItem>Medium</SampleItem>
					<SampleItem>Long Content</SampleItem>
				</VStack>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different horizontal alignment options for items.",
			},
		},
	},
};

export const JustifyContent: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Start</h4>
				<VStack
					justifyContent="start"
					className="h-40 border border-gray-300 p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Center</h4>
				<VStack
					justifyContent="center"
					className="h-40 border border-gray-300 p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify End</h4>
				<VStack
					justifyContent="end"
					className="h-40 border border-gray-300 p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Between</h4>
				<VStack
					justifyContent="between"
					className="h-40 border border-gray-300 p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different vertical distribution options for items.",
			},
		},
	},
};

export const GapSizes: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-semibold text-sm">No Gap (0px)</h4>
				<VStack gap={0} className="border border-gray-300 p-2">
					<SampleItem>Item 1</SampleItem>
					<SampleItem>Item 2</SampleItem>
					<SampleItem>Item 3</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Small Gap (8px)</h4>
				<VStack gap={2} className="border border-gray-300 p-2">
					<SampleItem>Item 1</SampleItem>
					<SampleItem>Item 2</SampleItem>
					<SampleItem>Item 3</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Medium Gap (16px)</h4>
				<VStack gap={4} className="border border-gray-300 p-2">
					<SampleItem>Item 1</SampleItem>
					<SampleItem>Item 2</SampleItem>
					<SampleItem>Item 3</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Large Gap (32px)</h4>
				<VStack gap={8} className="border border-gray-300 p-2">
					<SampleItem>Item 1</SampleItem>
					<SampleItem>Item 2</SampleItem>
					<SampleItem>Item 3</SampleItem>
				</VStack>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Different gap sizes between items in pixels (using Tailwind spacing units).",
			},
		},
	},
};

export const FormLayoutExample: Story = {
	args: {},
	render: () => (
		<VStack
			gap={4}
			alignItems="stretch"
			className="mx-auto max-w-sm rounded-lg border bg-white p-6 shadow"
		>
			<h3 className="text-center font-semibold text-lg">Contact Form</h3>

			<VStack gap={2} alignItems="stretch">
				<label
					htmlFor="contact-name"
					className="font-medium text-gray-700 text-sm"
				>
					Name
				</label>
				<input
					id="contact-name"
					type="text"
					placeholder="Enter your name"
					className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</VStack>

			<VStack gap={2} alignItems="stretch">
				<label
					htmlFor="contact-email"
					className="font-medium text-gray-700 text-sm"
				>
					Email
				</label>
				<input
					id="contact-email"
					type="email"
					placeholder="Enter your email"
					className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</VStack>

			<VStack gap={2} alignItems="stretch">
				<label
					htmlFor="contact-message"
					className="font-medium text-gray-700 text-sm"
				>
					Message
				</label>
				<textarea
					id="contact-message"
					placeholder="Enter your message"
					rows={4}
					className="w-full resize-none rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</VStack>

			<button
				type="button"
				className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Send Message
			</button>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Example form layout using VStack for organized vertical structure.",
			},
		},
	},
};

export const CardExample: Story = {
	args: {},
	render: () => (
		<VStack
			gap={4}
			className="max-w-sm overflow-hidden rounded-lg border bg-white shadow"
		>
			<div className="h-32 w-full bg-gradient-to-r from-blue-400 to-purple-500"></div>

			<VStack gap={3} className="px-6 pb-6">
				<VStack gap={1} alignItems="center">
					<h3 className="font-bold text-gray-900 text-xl">Product Title</h3>
					<p className="font-bold text-2xl text-blue-600">$99.99</p>
				</VStack>

				<p className="text-center text-gray-600">
					This is a sample product description that demonstrates how VStack can
					be used for card layouts.
				</p>

				<VStack gap={2} alignItems="stretch">
					<button
						type="button"
						className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					>
						Add to Cart
					</button>
					<button
						type="button"
						className="w-full rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
					>
						Add to Wishlist
					</button>
				</VStack>
			</VStack>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Example product card layout using VStack for vertical organization.",
			},
		},
	},
};

export const NavigationSidebarExample: Story = {
	args: {},
	render: () => (
		<VStack
			gap={2}
			alignItems="stretch"
			className="h-64 w-48 border-r bg-gray-50 p-4"
		>
			<h4 className="mb-2 font-semibold text-gray-900">Navigation</h4>

			<a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">
				Dashboard
			</a>
			<a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">
				Projects
			</a>
			<a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">
				Team
			</a>
			<a href="#" className="rounded px-3 py-2 text-gray-700 hover:bg-blue-100">
				Settings
			</a>

			<div className="mt-auto border-t pt-4">
				<a
					href="#"
					className="rounded px-3 py-2 text-gray-700 hover:bg-red-100"
				>
					Logout
				</a>
			</div>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story: "Example sidebar navigation using VStack for menu organization.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		children: (
			<>
				<SampleItem>Item 1</SampleItem>
				<SampleItem>Item 2</SampleItem>
				<SampleItem>Item 3</SampleItem>
			</>
		),
		gap: 4,
		alignItems: "stretch",
		justifyContent: "start",
		fullWidth: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different VStack configurations.",
			},
		},
	},
};
