import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Skeleton } from "./Skeleton";

const meta = {
	title: "UI/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A skeleton loading component that displays placeholder content while data is being loaded. Based on NextUI Skeleton component.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		isLoaded: {
			control: "boolean",
			description: "Whether the content is loaded",
			defaultValue: false,
		},
		children: {
			control: "text",
			description: "The content to display when loaded",
		},
		className: {
			control: "text",
			description: "Additional CSS classes to apply",
		},
	},
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isLoaded: false,
		children: "Content loaded!",
		className: "w-48 h-12 rounded-lg",
	},
	parameters: {
		docs: {
			description: {
				story: "Default skeleton loading state.",
			},
		},
	},
};

export const Loaded: Story = {
	args: {
		isLoaded: true,
		children: "This content has finished loading!",
		className: "w-48 h-12 rounded-lg",
	},
	parameters: {
		docs: {
			description: {
				story: "Skeleton with content loaded.",
			},
		},
	},
};

export const TextSkeletons: Story = {
	render: () => (
		<div className="max-w-sm space-y-3">
			<Skeleton isLoaded={false} className="h-4 w-3/4 rounded-lg" />
			<Skeleton isLoaded={false} className="h-4 w-full rounded-lg" />
			<Skeleton isLoaded={false} className="h-4 w-2/3 rounded-lg" />
			<Skeleton isLoaded={false} className="h-4 w-1/2 rounded-lg" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Multiple text line skeletons with different widths.",
			},
		},
	},
};

export const CardSkeleton: Story = {
	render: () => (
		<div className="max-w-sm space-y-4 rounded-lg border bg-white p-6 shadow">
			<Skeleton isLoaded={false} className="h-32 w-full rounded-lg" />
			<div className="space-y-2">
				<Skeleton isLoaded={false} className="h-6 w-3/4 rounded-lg" />
				<Skeleton isLoaded={false} className="h-4 w-full rounded-lg" />
				<Skeleton isLoaded={false} className="h-4 w-full rounded-lg" />
				<Skeleton isLoaded={false} className="h-4 w-2/3 rounded-lg" />
			</div>
			<div className="flex space-x-2">
				<Skeleton isLoaded={false} className="h-8 w-20 rounded-lg" />
				<Skeleton isLoaded={false} className="h-8 w-24 rounded-lg" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Card layout skeleton with image, text, and button placeholders.",
			},
		},
	},
};

export const ProfileSkeleton: Story = {
	render: () => (
		<div className="flex max-w-md items-center space-x-4 rounded-lg border bg-white p-4 shadow">
			<Skeleton isLoaded={false} className="h-12 w-12 rounded-full" />
			<div className="flex-1 space-y-2">
				<Skeleton isLoaded={false} className="h-4 w-24 rounded-lg" />
				<Skeleton isLoaded={false} className="h-3 w-32 rounded-lg" />
			</div>
			<Skeleton isLoaded={false} className="h-6 w-16 rounded-lg" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Profile card skeleton with avatar, name, and status placeholders.",
			},
		},
	},
};

export const ListSkeleton: Story = {
	render: () => (
		<div className="max-w-md space-y-4">
			{[...Array(5)].map((_, i) => {
				const uniqueKey = `list-skeleton-item-${i}-${Math.random()
					.toString(36)
					.substr(2, 9)}`;
				return (
					<div
						key={uniqueKey}
						className="flex items-center space-x-3 rounded-lg border bg-white p-3"
					>
						<Skeleton isLoaded={false} className="h-8 w-8 rounded-full" />
						<div className="flex-1 space-y-1">
							<Skeleton isLoaded={false} className="h-4 w-3/4 rounded-lg" />
							<Skeleton isLoaded={false} className="h-3 w-1/2 rounded-lg" />
						</div>
						<Skeleton isLoaded={false} className="h-6 w-12 rounded-lg" />
					</div>
				);
			})}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "List of skeleton items for loading states in lists.",
			},
		},
	},
};

export const LoadingStates: Story = {
	render: () => {
		const [isLoaded, setIsLoaded] = useState(false);

		useEffect(() => {
			const timer = setTimeout(() => setIsLoaded(true), 2000);
			return () => clearTimeout(timer);
		}, []);

		return (
			<div className="max-w-sm rounded-lg border bg-white p-6 shadow">
				<Skeleton isLoaded={isLoaded} className="mb-4 h-40 w-full rounded-lg">
					<div className="h-40 w-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-500" />
				</Skeleton>

				<div className="space-y-2">
					<Skeleton isLoaded={isLoaded} className="h-6 w-3/4 rounded-lg">
						<h3 className="font-bold text-lg">Amazing Product Title</h3>
					</Skeleton>

					<Skeleton isLoaded={isLoaded} className="h-4 w-full rounded-lg">
						<p className="text-gray-600">
							This is a detailed product description that explains all the
							features.
						</p>
					</Skeleton>

					<Skeleton isLoaded={isLoaded} className="h-6 w-1/3 rounded-lg">
						<div className="font-bold text-blue-600 text-xl">$99.99</div>
					</Skeleton>
				</div>

				<div className="mt-4">
					<Skeleton isLoaded={isLoaded} className="h-10 w-full rounded-lg">
						<button
							type="button"
							className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							Add to Cart
						</button>
					</Skeleton>
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Interactive example showing skeleton loading state transitioning to actual content.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		isLoaded: false,
		children: "Playground content",
		className: "w-64 h-16 rounded-lg",
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different skeleton configurations.",
			},
		},
	},
};
