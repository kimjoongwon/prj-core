import type { Meta, StoryObj } from "@storybook/react";
import { NavbarItem } from "./NavbarItem";

const meta = {
	title: "UI/NavbarItem",
	component: NavbarItem,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A navigation item component that automatically detects active state by comparing window.location.pathname with the value prop. Callbacks the value when clicked.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "The text to display in the navigation item",
		},
		url: {
			control: "text",
			description: "The URL (deprecated, use value instead)",
		},
		value: {
			control: "text",
			description: "The path value to compare with window.location.pathname",
		},
		onChange: {
			description: "Callback function called with the value when clicked",
		},
	},
} satisfies Meta<typeof NavbarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Home",
		url: "/home",
		value: "/home",
		onChange: (value) => console.log("Navigating to:", value),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Default navigation item. Active state is automatically determined by comparing value with window.location.pathname.",
			},
		},
	},
};

export const Active: Story = {
	args: {
		label: "Dashboard",
		url: "/dashboard",
		value: window.location.pathname, // This will make it active if current path matches
		onChange: (value) => console.log("Navigating to:", value),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Navigation item that appears active when window.location.pathname matches the value.",
			},
		},
	},
};

export const LongText: Story = {
	args: {
		label: "Very Long Navigation Item Text",
		url: "/long-page",
		value: "/long-page",
		onChange: (value) => console.log("Navigating to:", value),
	},
	parameters: {
		docs: {
			description: {
				story: "Navigation item with longer text content.",
			},
		},
	},
};

export const NavigationBar: Story = {
	args: {},
	render: () => {
		const handleNavigation = (value: string) =>
			console.log("Navigating to:", value);
		return (
			<div className="flex gap-2 rounded-lg bg-gray-50 p-4">
				<NavbarItem
					label="Home"
					url="/"
					value="/"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Products"
					url="/products"
					value="/products"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Services"
					url="/services"
					value="/services"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="About"
					url="/about"
					value="/about"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Contact"
					url="/contact"
					value="/contact"
					onChange={handleNavigation}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Example navigation bar with multiple nav items. Active state is automatically determined by window.location.pathname.",
			},
		},
	},
};

export const VerticalNavigation: Story = {
	args: {},
	render: () => {
		const handleNavigation = (value: string) =>
			console.log("Navigating to:", value);
		return (
			<div className="flex w-48 flex-col gap-1 rounded-lg border bg-white p-4">
				<NavbarItem
					label="Dashboard"
					url="/dashboard"
					value="/dashboard"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Analytics"
					url="/analytics"
					value="/analytics"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Projects"
					url="/projects"
					value="/projects"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Team"
					url="/team"
					value="/team"
					onChange={handleNavigation}
				/>
				<NavbarItem
					label="Settings"
					url="/settings"
					value="/settings"
					onChange={handleNavigation}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Vertical navigation layout with nav items stacked. Active state is automatically determined.",
			},
		},
	},
};

export const WithParams: Story = {
	args: {
		label: "User Profile",
		url: "/user",
		value: "/user",
		onChange: (value) =>
			console.log("Navigating to:", value, "with params:", {
				userId: "123",
				tab: "profile",
			}),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Navigation item example. Additional parameters can be handled in the onChange callback.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		label: "Navigation Item",
		url: "/example",
		value: "/example",
		onChange: (value) => console.log("Navigating to:", value),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Playground for testing different navigation item configurations.",
			},
		},
	},
};
