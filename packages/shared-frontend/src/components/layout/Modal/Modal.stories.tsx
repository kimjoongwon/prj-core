import { Card, CardBody } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../ui/Button/Button";
import { HStack } from "../../ui/HStack/HStack";
import { Text } from "../../ui/Text/Text";
import { VStack } from "../../ui/VStack/VStack";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
	title: "Layout/Modal",
	component: Modal,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const pageBuilder = {
				name: "Modal Title",
				state: {},
			};

			return <Story />;
		},
	],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample content components
const SampleFormContent = () => (
	<VStack gap={4} className="py-2">
		<Text variant="body1" className="mb-4 text-default-600">
			Please fill out the form below to continue.
		</Text>

		<div className="space-y-4">
			<div>
				<label className="mb-2 block font-medium text-sm">Full Name</label>
				<input
					type="text"
					className="w-full rounded-lg border border-default-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					placeholder="Enter your full name"
				/>
			</div>

			<div>
				<label className="mb-2 block font-medium text-sm">Email Address</label>
				<input
					type="email"
					className="w-full rounded-lg border border-default-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					placeholder="Enter your email address"
				/>
			</div>

			<div>
				<label className="mb-2 block font-medium text-sm">Message</label>
				<textarea
					rows={4}
					className="w-full resize-none rounded-lg border border-default-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					placeholder="Enter your message"
				/>
			</div>
		</div>

		<HStack
			gap={3}
			justifyContent="end"
			className="mt-6 border-default-200 border-t pt-4"
		>
			<Button variant="bordered">Cancel</Button>
			<Button color="primary">Submit</Button>
		</HStack>
	</VStack>
);

const SampleConfirmationContent = () => (
	<VStack gap={4} alignItems="center" className="py-6 text-center">
		<div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
			<Text variant="h4" className="text-warning-600">
				⚠️
			</Text>
		</div>

		<VStack gap={2} alignItems="center">
			<Text variant="h6">Confirm Action</Text>
			<Text variant="body1" className="max-w-md text-default-600">
				Are you sure you want to delete this item? This action cannot be undone.
			</Text>
		</VStack>

		<HStack gap={3} className="mt-4">
			<Button variant="bordered">Cancel</Button>
			<Button color="danger">Delete</Button>
		</HStack>
	</VStack>
);

const SampleDetailContent = () => (
	<VStack gap={6} className="py-2">
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card>
				<CardBody>
					<Text variant="subtitle1" className="mb-3">
						User Information
					</Text>
					<VStack gap={2}>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Name:
							</Text>
							<Text variant="body2">John Doe</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Email:
							</Text>
							<Text variant="body2">john@example.com</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Role:
							</Text>
							<Text variant="body2">Administrator</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Status:
							</Text>
							<span className="rounded-full bg-success-100 px-2 py-1 text-success-800 text-xs">
								Active
							</span>
						</HStack>
					</VStack>
				</CardBody>
			</Card>

			<Card>
				<CardBody>
					<Text variant="subtitle1" className="mb-3">
						Activity Summary
					</Text>
					<VStack gap={2}>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Last Login:
							</Text>
							<Text variant="body2">2 hours ago</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Total Sessions:
							</Text>
							<Text variant="body2">234</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Created:
							</Text>
							<Text variant="body2">Jan 15, 2024</Text>
						</HStack>
						<HStack justifyContent="between">
							<Text variant="body2" className="text-default-500">
								Updated:
							</Text>
							<Text variant="body2">Today</Text>
						</HStack>
					</VStack>
				</CardBody>
			</Card>
		</div>

		<Card>
			<CardBody>
				<Text variant="subtitle1" className="mb-3">
					Recent Activity
				</Text>
				<VStack gap={3}>
					{[
						{ action: "Updated profile information", time: "2 hours ago" },
						{ action: "Changed password", time: "1 day ago" },
						{ action: "Logged in from new device", time: "3 days ago" },
						{ action: "Updated email preferences", time: "1 week ago" },
					].map((activity, index) => (
						<HStack key={index} gap={3} alignItems="center">
							<div className="h-2 w-2 rounded-full bg-primary"></div>
							<VStack gap={0} className="flex-1">
								<Text variant="body2">{activity.action}</Text>
								<Text variant="caption" className="text-default-500">
									{activity.time}
								</Text>
							</VStack>
						</HStack>
					))}
				</VStack>
			</CardBody>
		</Card>

		<HStack
			gap={3}
			justifyContent="end"
			className="border-default-200 border-t pt-4"
		>
			<Button variant="bordered">Close</Button>
			<Button color="primary">Edit</Button>
		</HStack>
	</VStack>
);

const SampleListContent = () => (
	<VStack gap={4} className="py-2">
		<HStack justifyContent="between" alignItems="center">
			<Text variant="subtitle1">Select Items</Text>
			<Button size="sm" variant="bordered">
				Select All
			</Button>
		</HStack>

		<VStack gap={2}>
			{[
				{ name: "Document 1", type: "PDF", size: "2.4 MB" },
				{ name: "Image Gallery", type: "Folder", size: "15.2 MB" },
				{ name: "Presentation", type: "PPTX", size: "8.7 MB" },
				{ name: "Spreadsheet", type: "XLSX", size: "1.9 MB" },
				{ name: "Video File", type: "MP4", size: "124.5 MB" },
			].map((item, index) => (
				<Card key={index} isPressable className="w-full">
					<CardBody>
						<HStack gap={3} alignItems="center">
							<input
								type="checkbox"
								className="h-4 w-4 rounded border-default-300 text-primary focus:ring-primary"
							/>
							<div className="flex-1">
								<HStack justifyContent="between" alignItems="center">
									<VStack gap={0}>
										<Text variant="body2" className="font-medium">
											{item.name}
										</Text>
										<Text variant="caption" className="text-default-500">
											{item.type} • {item.size}
										</Text>
									</VStack>
									<Text variant="body2" className="text-primary">
										📄
									</Text>
								</HStack>
							</div>
						</HStack>
					</CardBody>
				</Card>
			))}
		</VStack>

		<HStack
			gap={3}
			justifyContent="end"
			className="mt-4 border-default-200 border-t pt-4"
		>
			<Button variant="bordered">Cancel</Button>
			<Button color="primary">Select (0)</Button>
		</HStack>
	</VStack>
);

export const Default: Story = {
	args: {
		modalBody: {
			children: <SampleFormContent />,
		},
	},
};

export const FormModal: Story = {
	args: {
		modalBody: {
			children: <SampleFormContent />,
		},
	},
};

export const ConfirmationModal: Story = {
	args: {
		modalBody: {
			children: <SampleConfirmationContent />,
		},
	},
};

export const DetailModal: Story = {
	args: {
		size: "4xl",
		modalBody: {
			children: <SampleDetailContent />,
		},
	},
};

export const ListModal: Story = {
	args: {
		size: "2xl",
		modalBody: {
			children: <SampleListContent />,
		},
	},
};

export const SimpleContent: Story = {
	args: {
		size: "md",
		modalBody: {
			children: (
				<VStack gap={4} alignItems="center" className="py-6 text-center">
					<Text variant="h6">Simple Modal Content</Text>
					<Text variant="body1" className="text-default-600">
						This is a simple modal with minimal content to demonstrate the basic
						layout.
					</Text>
					<Button color="primary">Got it</Button>
				</VStack>
			),
		},
	},
};
