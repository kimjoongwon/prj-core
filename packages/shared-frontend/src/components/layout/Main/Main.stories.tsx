import { Card, CardBody } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../ui/Button/Button";
import { HStack } from "../../ui/HStack/HStack";
import { Text } from "../../ui/Text/Text";
import { VStack } from "../../ui/VStack/VStack";
import { MainLayout } from "./Main";

const meta: Meta<typeof MainLayout> = {
	title: "Layout/AdminMainLayout",
	component: MainLayout,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample content components
const SampleDashboardContent = () => (
	<VStack gap={6} className="p-6">
		<div>
			<Text variant="h4" className="mb-2">
				Admin Dashboard
			</Text>
			<Text variant="body1" className="text-default-600">
				Welcome to the admin panel. Here you can manage your application.
			</Text>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{[
				{ title: "Total Users", value: "2,543", icon: "👥" },
				{ title: "Revenue", value: "$45,210", icon: "💰" },
				{ title: "Orders", value: "1,284", icon: "📦" },
				{ title: "Growth", value: "+12.5%", icon: "📈" },
			].map((stat, index) => (
				<Card key={index}>
					<CardBody className="text-center">
						<div className="text-2xl mb-2">{stat.icon}</div>
						<Text variant="h5" className="mb-1">
							{stat.value}
						</Text>
						<Text variant="body2" className="text-default-500">
							{stat.title}
						</Text>
					</CardBody>
				</Card>
			))}
		</div>

		<Card>
			<CardBody>
				<Text variant="h6" className="mb-4">
					Recent Activity
				</Text>
				<VStack gap={3}>
					{[
						"New user registration: john@example.com",
						"Payment received: $299.99",
						"System backup completed",
						"Database optimization finished",
					].map((activity, index) => (
						<HStack key={index} gap={3} alignItems="center">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							<Text variant="body2" className="text-default-600">
								{activity}
							</Text>
						</HStack>
					))}
				</VStack>
			</CardBody>
		</Card>
	</VStack>
);

const SampleFormContent = () => (
	<VStack gap={4} className="p-6">
		<Text variant="h5" className="mb-4">
			User Settings
		</Text>

		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-2">Name</label>
				<input
					type="text"
					className="w-full px-3 py-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					placeholder="Enter your name"
					defaultValue="John Doe"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Email</label>
				<input
					type="email"
					className="w-full px-3 py-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					placeholder="Enter your email"
					defaultValue="john@example.com"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Role</label>
				<select className="w-full px-3 py-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
					<option>Administrator</option>
					<option>Editor</option>
					<option>Viewer</option>
				</select>
			</div>
		</div>

		<HStack gap={3} className="mt-6">
			<Button color="primary">Save Changes</Button>
			<Button variant="bordered">Cancel</Button>
		</HStack>
	</VStack>
);

const SampleTableContent = () => (
	<VStack gap={4} className="p-6">
		<HStack justifyContent="between" alignItems="center">
			<Text variant="h5">User Management</Text>
			<Button color="primary" size="sm">
				Add User
			</Button>
		</HStack>

		<Card>
			<CardBody className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-default-50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Name
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Email
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Role
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Status
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-default-200">
							{[
								{
									name: "John Doe",
									email: "john@example.com",
									role: "Admin",
									status: "Active",
								},
								{
									name: "Jane Smith",
									email: "jane@example.com",
									role: "Editor",
									status: "Active",
								},
								{
									name: "Bob Johnson",
									email: "bob@example.com",
									role: "Viewer",
									status: "Inactive",
								},
							].map((user, index) => (
								<tr key={index}>
									<td className="px-4 py-3 text-sm">{user.name}</td>
									<td className="px-4 py-3 text-sm">{user.email}</td>
									<td className="px-4 py-3 text-sm">{user.role}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												user.status === "Active"
													? "bg-success-100 text-success-800"
													: "bg-default-100 text-default-600"
											}`}
										>
											{user.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm">
										<HStack gap={2}>
											<Button size="sm" variant="light">
												Edit
											</Button>
											<Button size="sm" variant="light" color="danger">
												Delete
											</Button>
										</HStack>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardBody>
		</Card>
	</VStack>
);

export const Default: Story = {
	args: {
		children: <SampleDashboardContent />,
	},
};

export const FormLayout: Story = {
	args: {
		children: <SampleFormContent />,
	},
};

export const TableLayout: Story = {
	args: {
		children: <SampleTableContent />,
	},
};

export const EmptyLayout: Story = {
	args: {
		children: (
			<VStack gap={4} alignItems="center" className="p-12 text-center">
				<div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center">
					<Text variant="h4" className="text-default-400">
						📄
					</Text>
				</div>
				<Text variant="h5">No Content</Text>
				<Text variant="body1" className="text-default-600 max-w-md">
					This is how the main layout looks when there's no content to display.
				</Text>
				<Button color="primary">Add Content</Button>
			</VStack>
		),
	},
};

export const SimpleContent: Story = {
	args: {
		children: (
			<div className="p-6">
				<Text variant="h6" className="mb-4">
					Simple Content Area
				</Text>
				<Text variant="body1" className="text-default-600">
					This shows the admin main layout with simple text content. The layout
					provides a bordered container with margin and rounded corners.
				</Text>
			</div>
		),
	},
};
