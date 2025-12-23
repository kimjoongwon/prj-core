import { Card, CardBody } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../../data-display/Text/Text";
import { Button } from "../../inputs/Button/Button";
import { HStack } from "../../surfaces/HStack/HStack";
import { VStack } from "../../surfaces/VStack/VStack";
import { TableLayout } from "./Table";

const meta: Meta<typeof TableLayout> = {
	title: "Layout/TableLayout",
	component: TableLayout,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample table components
const SampleUserTable = () => (
	<VStack gap={4}>
		<HStack justifyContent="between" alignItems="center">
			<Text variant="h5">User Management</Text>
			<HStack gap={2}>
				<Button variant="bordered" size="sm">
					Export
				</Button>
				<Button color="primary" size="sm">
					Add User
				</Button>
			</HStack>
		</HStack>

		<Card>
			<CardBody className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-default-50">
							<tr>
								<th className="px-4 py-3 text-left font-medium text-sm">
									<input type="checkbox" className="h-4 w-4" />
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Name
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Email
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Role
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Status
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Last Login
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-default-200">
							{[
								{
									name: "John Doe",
									email: "john@example.com",
									role: "Administrator",
									status: "Active",
									lastLogin: "2 hours ago",
								},
								{
									name: "Jane Smith",
									email: "jane@example.com",
									role: "Editor",
									status: "Active",
									lastLogin: "1 day ago",
								},
								{
									name: "Bob Johnson",
									email: "bob@example.com",
									role: "Viewer",
									status: "Inactive",
									lastLogin: "1 week ago",
								},
								{
									name: "Alice Brown",
									email: "alice@example.com",
									role: "Editor",
									status: "Active",
									lastLogin: "5 minutes ago",
								},
							].map((user, index) => (
								<tr key={index} className="hover:bg-default-50">
									<td className="px-4 py-3">
										<input type="checkbox" className="h-4 w-4" />
									</td>
									<td className="px-4 py-3 font-medium text-sm">{user.name}</td>
									<td className="px-4 py-3 text-default-600 text-sm">
										{user.email}
									</td>
									<td className="px-4 py-3 text-sm">{user.role}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs ${
												user.status === "Active"
													? "bg-success-100 text-success-800"
													: "bg-default-100 text-default-600"
											}`}
										>
											{user.status}
										</span>
									</td>
									<td className="px-4 py-3 text-default-600 text-sm">
										{user.lastLogin}
									</td>
									<td className="px-4 py-3 text-sm">
										<HStack gap={1}>
											<Button size="sm" variant="light" isIconOnly>
												👁️
											</Button>
											<Button size="sm" variant="light" isIconOnly>
												✏️
											</Button>
											<Button
												size="sm"
												variant="light"
												isIconOnly
												color="danger"
											>
												🗑️
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

		<HStack justifyContent="between" alignItems="center">
			<Text variant="body2" className="text-default-500">
				Showing 4 of 24 users
			</Text>
			<HStack gap={1}>
				<Button size="sm" variant="bordered" isDisabled>
					Previous
				</Button>
				<Button size="sm" variant="bordered">
					1
				</Button>
				<Button size="sm" variant="light">
					2
				</Button>
				<Button size="sm" variant="light">
					3
				</Button>
				<Button size="sm" variant="bordered">
					Next
				</Button>
			</HStack>
		</HStack>
	</VStack>
);

const SampleProductTable = () => (
	<VStack gap={4}>
		<HStack justifyContent="between" alignItems="center">
			<Text variant="h5">Product Inventory</Text>
			<HStack gap={2}>
				<input
					type="search"
					placeholder="Search products..."
					className="rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<Button color="primary" size="sm">
					Add Product
				</Button>
			</HStack>
		</HStack>

		<Card>
			<CardBody className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-default-50">
							<tr>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Product
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">SKU</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Category
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Stock
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Price
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Status
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-default-200">
							{[
								{
									name: "Wireless Headphones",
									sku: "WH-1000",
									category: "Electronics",
									stock: 45,
									price: "$199.99",
									status: "In Stock",
								},
								{
									name: "Coffee Mug",
									sku: "MUG-001",
									category: "Home & Garden",
									stock: 120,
									price: "$12.99",
									status: "In Stock",
								},
								{
									name: "Running Shoes",
									sku: "RS-500",
									category: "Sports",
									stock: 0,
									price: "$89.99",
									status: "Out of Stock",
								},
								{
									name: "Notebook Set",
									sku: "NB-250",
									category: "Office",
									stock: 8,
									price: "$24.99",
									status: "Low Stock",
								},
							].map((product, index) => (
								<tr key={index} className="hover:bg-default-50">
									<td className="px-4 py-3">
										<HStack gap={3} alignItems="center">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-default-100">
												📦
											</div>
											<VStack gap={0}>
												<Text variant="body2" className="font-medium">
													{product.name}
												</Text>
												<Text variant="caption" className="text-default-500">
													{product.sku}
												</Text>
											</VStack>
										</HStack>
									</td>
									<td className="px-4 py-3 text-default-600 text-sm">
										{product.sku}
									</td>
									<td className="px-4 py-3 text-sm">{product.category}</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={
												product.stock === 0
													? "text-danger-600"
													: product.stock < 10
														? "text-warning-600"
														: "text-default-900"
											}
										>
											{product.stock}
										</span>
									</td>
									<td className="px-4 py-3 font-medium text-sm">
										{product.price}
									</td>
									<td className="px-4 py-3 text-sm">
										<span
											className={`rounded-full px-2 py-1 text-xs ${
												product.status === "In Stock"
													? "bg-success-100 text-success-800"
													: product.status === "Low Stock"
														? "bg-warning-100 text-warning-800"
														: "bg-danger-100 text-danger-800"
											}`}
										>
											{product.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm">
										<HStack gap={1}>
											<Button size="sm" variant="light" isIconOnly>
												👁️
											</Button>
											<Button size="sm" variant="light" isIconOnly>
												✏️
											</Button>
											<Button
												size="sm"
												variant="light"
												isIconOnly
												color="danger"
											>
												🗑️
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

const SampleSimpleList = () => (
	<VStack gap={4}>
		<Text variant="h6">Simple List</Text>
		<Card>
			<CardBody>
				<VStack gap={3}>
					{[
						"First item in the list",
						"Second item with more content",
						"Third item example",
						"Fourth and final item",
					].map((item, index) => (
						<HStack key={index} gap={3} alignItems="center" className="py-2">
							<div className="h-2 w-2 rounded-full bg-primary"></div>
							<Text variant="body2" className="flex-1">
								{item}
							</Text>
							<Button size="sm" variant="light">
								Action
							</Button>
						</HStack>
					))}
				</VStack>
			</CardBody>
		</Card>
	</VStack>
);

const SampleEmptyTable = () => (
	<VStack gap={4}>
		<HStack justifyContent="between" alignItems="center">
			<Text variant="h5">Empty Table</Text>
			<Button color="primary" size="sm">
				Add First Item
			</Button>
		</HStack>

		<Card>
			<CardBody className="py-12">
				<VStack gap={4} alignItems="center" className="text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-default-100">
						<Text variant="h4" className="text-default-400">
							📋
						</Text>
					</div>
					<VStack gap={2} alignItems="center">
						<Text variant="h6">No Data Available</Text>
						<Text variant="body2" className="max-w-md text-default-600">
							There are no items to display yet. Add your first item to get
							started.
						</Text>
					</VStack>
					<Button color="primary">Add Item</Button>
				</VStack>
			</CardBody>
		</Card>
	</VStack>
);

export const Default: Story = {
	args: {
		children: <SampleUserTable />,
	},
};

export const UserTable: Story = {
	args: {
		children: <SampleUserTable />,
	},
};

export const ProductTable: Story = {
	args: {
		children: <SampleProductTable />,
	},
};

export const SimpleList: Story = {
	args: {
		children: <SampleSimpleList />,
	},
};

export const EmptyState: Story = {
	args: {
		children: <SampleEmptyTable />,
	},
};

export const MinimalContent: Story = {
	args: {
		children: (
			<VStack gap={3}>
				<Text variant="h6">Minimal Table Layout</Text>
				<Text variant="body2" className="text-default-600">
					This shows the table layout with minimal content. The layout provides
					padding around the content area.
				</Text>
			</VStack>
		),
	},
};
