import { Card, CardBody } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../ui/Button/Button";
import { HStack } from "../../ui/HStack/HStack";
import { Text } from "../../ui/Text/Text";
import { VStack } from "../../ui/VStack/VStack";
import { DashboardLayout } from "./DashboardLayout";

const meta: Meta<typeof DashboardLayout> = {
	title: "Layout/DashboardLayout",
	component: DashboardLayout,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample components for stories
const SampleHeader = () => (
	<div className="p-4">
		<HStack justifyContent="between" alignItems="center">
			<HStack gap={3} alignItems="center">
				<div className="w-8 h-8 bg-primary rounded-lg"></div>
				<Text variant="h5">Dashboard</Text>
			</HStack>
			<HStack gap={2}>
				<Button size="sm" variant="light">
					Settings
				</Button>
				<Button size="sm" color="primary">
					Profile
				</Button>
			</HStack>
		</HStack>
	</div>
);

const SampleLeftSidebar = () => (
	<VStack gap={2} className="p-4 w-60">
		<Text variant="subtitle2" className="text-default-500 mb-2">
			Navigation
		</Text>
		<Button variant="light" className="justify-start w-full">
			🏠 Dashboard
		</Button>
		<Button variant="light" className="justify-start w-full">
			📊 Analytics
		</Button>
		<Button variant="light" className="justify-start w-full">
			👥 Users
		</Button>
		<Button variant="light" className="justify-start w-full">
			⚙️ Settings
		</Button>
	</VStack>
);

const SampleRightSidebar = () => (
	<VStack gap={4}>
		<Card>
			<CardBody>
				<Text variant="subtitle1" className="mb-2">
					Quick Stats
				</Text>
				<VStack gap={2}>
					<HStack justifyContent="between">
						<Text variant="body2">Active Users</Text>
						<Text variant="body2" className="font-semibold">
							1,234
						</Text>
					</HStack>
					<HStack justifyContent="between">
						<Text variant="body2">Revenue</Text>
						<Text variant="body2" className="font-semibold">
							$45,678
						</Text>
					</HStack>
				</VStack>
			</CardBody>
		</Card>
		<Card>
			<CardBody>
				<Text variant="subtitle1" className="mb-2">
					Notifications
				</Text>
				<VStack gap={2}>
					<Text variant="body2" className="text-default-600">
						• New user registered
					</Text>
					<Text variant="body2" className="text-default-600">
						• Payment received
					</Text>
					<Text variant="body2" className="text-default-600">
						• System update available
					</Text>
				</VStack>
			</CardBody>
		</Card>
	</VStack>
);

const SampleBottom = () => (
	<HStack gap={2} justifyContent="center">
		<Button size="sm" variant="light">
			Home
		</Button>
		<Button size="sm" variant="light">
			Stats
		</Button>
		<Button size="sm" variant="light">
			Menu
		</Button>
	</HStack>
);

const SampleBreadcrumb = () => (
	<HStack gap={1} alignItems="center" className="text-sm">
		<Text variant="body2" className="text-default-500">
			Home
		</Text>
		<Text variant="body2" className="text-default-400">
			/
		</Text>
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

const SampleMainContent = () => (
	<VStack gap={6}>
		<div>
			<Text variant="h4" className="mb-4">
				Welcome to Dashboard
			</Text>
			<Text variant="body1" className="text-default-600">
				This is the main content area where your dashboard content will be
				displayed.
			</Text>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<Card key={i}>
					<CardBody>
						<Text variant="subtitle1" className="mb-2">
							Card {i}
						</Text>
						<Text variant="body2" className="text-default-600">
							Sample content for card {i}
						</Text>
					</CardBody>
				</Card>
			))}
		</div>
	</VStack>
);

export const Default: Story = {
	args: {
		header: <SampleHeader />,
		leftSidebar: <SampleLeftSidebar />,
		rightSidebar: <SampleRightSidebar />,
		bottom: <SampleBottom />,
		breadcrumb: <SampleBreadcrumb />,
		children: <SampleMainContent />,
	},
};

export const WithoutSidebars: Story = {
	args: {
		header: <SampleHeader />,
		breadcrumb: <SampleBreadcrumb />,
		children: <SampleMainContent />,
	},
};

export const LeftSidebarOnly: Story = {
	args: {
		header: <SampleHeader />,
		leftSidebar: <SampleLeftSidebar />,
		breadcrumb: <SampleBreadcrumb />,
		children: <SampleMainContent />,
	},
};

export const RightSidebarOnly: Story = {
	args: {
		header: <SampleHeader />,
		rightSidebar: <SampleRightSidebar />,
		bottom: <SampleBottom />,
		breadcrumb: <SampleBreadcrumb />,
		children: <SampleMainContent />,
	},
};

export const MinimalLayout: Story = {
	args: {
		children: (
			<VStack gap={4} alignItems="center" className="text-center py-8">
				<Text variant="h3">Minimal Dashboard</Text>
				<Text variant="body1" className="text-default-600 max-w-md">
					This shows the dashboard layout with only the main content area and
					default header placeholder.
				</Text>
				<Button color="primary">Get Started</Button>
			</VStack>
		),
	},
};
