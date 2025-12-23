import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../../data-display/Avatar/Avatar";
import { Text } from "../../data-display/Text/Text";
import { Button } from "../../inputs/Button/Button";
import { HStack } from "../../surfaces/HStack/HStack";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
	title: "Layout/Header",
	component: Header,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample components for stories
const SampleLogo = () => (
	<HStack gap={2} alignItems="center">
		<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
			<Text variant="body2" className="font-bold text-white">
				L
			</Text>
		</div>
		<Text variant="h6" className="font-semibold">
			Logo
		</Text>
	</HStack>
);

const SampleNavigation = () => (
	<HStack gap={4}>
		<Button variant="light" size="sm">
			Home
		</Button>
		<Button variant="light" size="sm">
			Products
		</Button>
		<Button variant="light" size="sm">
			About
		</Button>
		<Button variant="light" size="sm">
			Contact
		</Button>
	</HStack>
);

const SampleUserSection = () => (
	<HStack gap={3} alignItems="center">
		<Button variant="light" size="sm" isIconOnly>
			🔔
		</Button>
		<Button variant="light" size="sm" isIconOnly>
			⚙️
		</Button>
		<Avatar src="https://via.placeholder.com/32" alt="User avatar" size="sm" />
	</HStack>
);

const SampleSearchBar = () => (
	<div className="w-full max-w-md">
		<input
			type="search"
			placeholder="Search..."
			className="w-full rounded-lg border border-default-200 bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
		/>
	</div>
);

const SampleBreadcrumb = () => (
	<HStack gap={1} alignItems="center">
		<Text variant="body2" className="text-default-500">
			Dashboard
		</Text>
		<Text variant="body2" className="text-default-400">
			/
		</Text>
		<Text variant="body2" className="text-primary">
			Analytics
		</Text>
	</HStack>
);

export const Default: Story = {
	args: {
		left: <SampleLogo />,
		center: <SampleNavigation />,
		right: <SampleUserSection />,
	},
};

export const WithSearchBar: Story = {
	args: {
		left: <SampleLogo />,
		center: <SampleSearchBar />,
		right: <SampleUserSection />,
	},
};

export const WithBreadcrumb: Story = {
	args: {
		left: <SampleLogo />,
		center: <SampleBreadcrumb />,
		right: <SampleUserSection />,
	},
};

export const LogoOnly: Story = {
	args: {
		left: <SampleLogo />,
	},
};

export const SimpleNavigation: Story = {
	args: {
		left: (
			<HStack gap={2} alignItems="center">
				<div className="h-6 w-6 rounded bg-primary"></div>
				<Text variant="subtitle1" className="font-semibold">
					Brand
				</Text>
			</HStack>
		),
		right: (
			<HStack gap={2}>
				<Button variant="light" size="sm">
					Sign In
				</Button>
				<Button color="primary" size="sm">
					Sign Up
				</Button>
			</HStack>
		),
	},
};

export const DashboardHeader: Story = {
	args: {
		left: (
			<HStack gap={3} alignItems="center">
				<Button variant="light" size="sm" isIconOnly>
					☰
				</Button>
				<Text variant="h6" className="font-semibold">
					Admin Dashboard
				</Text>
			</HStack>
		),
		center: (
			<Text variant="subtitle1" className="text-default-600">
				Welcome back, John!
			</Text>
		),
		right: (
			<HStack gap={2} alignItems="center">
				<Button variant="light" size="sm" isIconOnly>
					🔔
				</Button>
				<Button variant="light" size="sm" isIconOnly>
					❓
				</Button>
				<Avatar
					src="https://via.placeholder.com/32"
					alt="Admin avatar"
					size="sm"
				/>
			</HStack>
		),
	},
};
