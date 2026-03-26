import { Card, CardBody } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../control/Button/Button";
import { HStack } from "../../layout/HStack/HStack";
import { VStack } from "../../layout/VStack/VStack";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
	title: "Layouts/Modal",
	component: Modal,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const _pageBuilder = {
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
		<p className="mb-4 text-default-600">
			Please fill out the form below to continue.
		</p>

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
			<h4 className="text-xl font-bold text-warning-600">⚠️</h4>
		</div>

		<VStack gap={2} alignItems="center">
			<h6 className="text-base font-bold">Confirm Action</h6>
			<p className="max-w-md text-default-600">
				Are you sure you want to delete this item? This action cannot be undone.
			</p>
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
					<span className="text-default-600 mb-3">User Information</span>
					<VStack gap={2}>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Name:</p>
							<p className="text-sm">John Doe</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Email:</p>
							<p className="text-sm">john@example.com</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Role:</p>
							<p className="text-sm">Administrator</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Status:</p>
							<span className="rounded-full bg-success-100 px-2 py-1 text-success-800 text-xs">
								Active
							</span>
						</HStack>
					</VStack>
				</CardBody>
			</Card>

			<Card>
				<CardBody>
					<span className="text-default-600 mb-3">Activity Summary</span>
					<VStack gap={2}>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Last Login:</p>
							<p className="text-sm">2 hours ago</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Total Sessions:</p>
							<p className="text-sm">234</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Created:</p>
							<p className="text-sm">Jan 15, 2024</p>
						</HStack>
						<HStack justifyContent="between">
							<p className="text-sm text-default-500">Updated:</p>
							<p className="text-sm">Today</p>
						</HStack>
					</VStack>
				</CardBody>
			</Card>
		</div>

		<Card>
			<CardBody>
				<span className="text-default-600 mb-3">Recent Activity</span>
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
								<p className="text-sm">{activity.action}</p>
								<span className="text-sm text-default-500">
									{activity.time}
								</span>
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
			<span className="text-default-600">Select Items</span>
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
										<p className="text-sm font-medium">{item.name}</p>
										<span className="text-sm text-default-500">
											{item.type} • {item.size}
										</span>
									</VStack>
									<p className="text-sm text-primary">📄</p>
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
					<h6 className="text-base font-bold">Simple Modal Content</h6>
					<p className="text-default-600">
						This is a simple modal with minimal content to demonstrate the basic
						layout.
					</p>
					<Button color="primary">Got it</Button>
				</VStack>
			),
		},
	},
};
