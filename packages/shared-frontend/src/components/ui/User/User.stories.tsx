import type { Meta, StoryObj } from "@storybook/react";
import { User } from "./User";

const meta = {
	title: "UI/User",
	component: User,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A user profile component with dropdown menu functionality. Displays user avatar and provides access to profile actions like settings and logout.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		// Note: This component doesn't accept props as it's hardcoded,
		// but we can document its behavior
	},
} satisfies Meta<typeof User>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Default user component with dropdown menu. Click the avatar to see the dropdown options.",
			},
		},
	},
};

export const InNavigationBar: Story = {
	render: () => (
		<div className="flex w-full max-w-4xl items-center justify-between border-b bg-white p-4 shadow-sm">
			<div className="flex items-center space-x-4">
				<div className="font-bold text-blue-600 text-xl">플레이트</div>
				<nav className="flex space-x-6">
					<a href="#" className="text-gray-600 hover:text-gray-900">
						Dashboard
					</a>
					<a href="#" className="text-gray-600 hover:text-gray-900">
						Projects
					</a>
					<a href="#" className="text-gray-600 hover:text-gray-900">
						Team
					</a>
				</nav>
			</div>
			<div className="flex items-center space-x-4">
				<button type="button" className="p-2 text-gray-600 hover:text-gray-900">
					🔔
				</button>
				<User />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "User component integrated into a navigation bar layout.",
			},
		},
	},
};

export const InTopBar: Story = {
	render: () => (
		<div className="w-full border-b bg-white">
			<div className="flex items-center justify-between px-6 py-3">
				<div className="flex items-center space-x-4">
					<h1 className="font-semibold text-gray-900 text-lg">Dashboard</h1>
					<span className="text-gray-500 text-sm">Welcome back!</span>
				</div>
				<div className="flex items-center space-x-3">
					<div className="text-gray-600 text-sm">
						<div>Good morning</div>
					</div>
					<User />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "User component in a dashboard top bar layout.",
			},
		},
	},
};

export const InSidebar: Story = {
	render: () => (
		<div className="flex h-96 w-64 flex-col border-r bg-gray-50">
			<div className="border-b p-4">
				<div className="font-bold text-gray-900 text-lg">플레이트</div>
			</div>

			<nav className="flex-1 space-y-2 p-4">
				<a
					href="#"
					className="block rounded px-3 py-2 text-gray-700 hover:bg-blue-100"
				>
					Dashboard
				</a>
				<a
					href="#"
					className="block rounded px-3 py-2 text-gray-700 hover:bg-blue-100"
				>
					Projects
				</a>
				<a
					href="#"
					className="block rounded px-3 py-2 text-gray-700 hover:bg-blue-100"
				>
					Team
				</a>
				<a
					href="#"
					className="block rounded px-3 py-2 text-gray-700 hover:bg-blue-100"
				>
					Settings
				</a>
			</nav>

			<div className="border-t p-4">
				<User />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"User component positioned at the bottom of a sidebar navigation.",
			},
		},
	},
};

export const MultipleUsers: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="font-semibold text-lg">Team Members</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Project Manager</div>
							<div className="text-gray-500 text-sm">Online</div>
						</div>
						<User />
					</div>
				</div>

				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Developer</div>
							<div className="text-gray-500 text-sm">Away</div>
						</div>
						<User />
					</div>
				</div>

				<div className="rounded-lg border bg-white p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Designer</div>
							<div className="text-gray-500 text-sm">Offline</div>
						</div>
						<User />
					</div>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Multiple user components in a team member grid layout.",
			},
		},
	},
};

export const WithNotifications: Story = {
	render: () => (
		<div className="w-full max-w-sm rounded-lg border bg-white shadow-sm">
			<div className="border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">Account</h3>
					<User />
				</div>
			</div>

			<div className="space-y-3 p-4">
				<div className="flex items-center justify-between">
					<span className="text-sm">Notifications</span>
					<input type="checkbox" className="rounded" defaultChecked />
				</div>

				<div className="flex items-center justify-between">
					<span className="text-sm">Email Updates</span>
					<input type="checkbox" className="rounded" />
				</div>

				<div className="flex items-center justify-between">
					<span className="text-sm">Dark Mode</span>
					<input type="checkbox" className="rounded" />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "User component in an account settings card layout.",
			},
		},
	},
};

export const Playground: Story = {
	render: () => (
		<div className="flex min-h-32 items-center justify-center bg-gray-100 p-8">
			<div className="rounded-lg bg-white p-4 shadow">
				<div className="mb-4 text-gray-600 text-sm">
					Click the user avatar to see the dropdown menu
				</div>
				<User />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Playground for testing the user component functionality.",
			},
		},
	},
};
