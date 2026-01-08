import { Avatar as HeroAvatar } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../inputs/Button/Button";
import { HStack } from "../../ui/surfaces/HStack/HStack";
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
			<p className="text-sm font-bold text-white">
				L
			</p>
		</div>
		<h6 className="text-base font-bold font-semibold">
			Logo
		</h6>
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
		<HeroAvatar src="https://via.placeholder.com/32" name="User" size="sm" />
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
		<p className="text-sm text-default-500">
			Dashboard
		</p>
		<p className="text-sm text-default-400">
			/
		</p>
		<p className="text-sm text-primary">
			Analytics
		</p>
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
				<span className="text-default-600 font-semibold">
					Brand
				</span>
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
				<h6 className="text-base font-bold font-semibold">
					Admin Dashboard
				</h6>
			</HStack>
		),
		center: (
			<span className="text-default-600">
				Welcome back, John!
			</span>
		),
		right: (
			<HStack gap={2} alignItems="center">
				<Button variant="light" size="sm" isIconOnly>
					🔔
				</Button>
				<Button variant="light" size="sm" isIconOnly>
					❓
				</Button>
				<HeroAvatar
					src="https://via.placeholder.com/32"
					name="Admin"
					size="sm"
				/>
			</HStack>
		),
	},
};
