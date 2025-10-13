import type { Meta, StoryObj } from "@storybook/react";
import { Placeholder } from "./Placeholder";

const meta = {
	title: "UI/Placeholder",
	component: Placeholder,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A simple placeholder component that displays a message when no data is available. Used to fill empty states in lists, tables, or content areas.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Default placeholder with Korean message indicating no data exists.",
			},
		},
	},
};

export const InContainer: Story = {
	args: {},
	render: () => (
		<div className="flex h-64 w-96 items-center justify-center rounded-lg border border-gray-300 bg-gray-50">
			<Placeholder />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Placeholder displayed within a container to show typical usage context.",
			},
		},
	},
};

export const InTable: Story = {
	args: {},
	render: () => (
		<div className="w-full max-w-md">
			<table className="w-full overflow-hidden rounded-lg border border-gray-300">
				<thead className="bg-gray-100">
					<tr>
						<th className="border-b p-3 text-left">이름</th>
						<th className="border-b p-3 text-left">이메일</th>
						<th className="border-b p-3 text-left">역할</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colSpan={3} className="p-8">
							<Placeholder />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Placeholder used in a table when no data rows are available.",
			},
		},
	},
};

export const InListView: Story = {
	args: {},
	render: () => (
		<div className="w-full max-w-md rounded-lg border border-gray-300 bg-white">
			<div className="border-gray-200 border-b p-4 font-semibold">
				사용자 목록
			</div>
			<div className="p-8">
				<Placeholder />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Placeholder used in a list view when no items are available.",
			},
		},
	},
};

export const InDashboard: Story = {
	args: {},
	render: () => (
		<div className="grid w-full max-w-2xl grid-cols-2 gap-4">
			<div className="rounded-lg border border-gray-300 bg-white p-4">
				<h3 className="mb-4 font-semibold">최근 활동</h3>
				<Placeholder />
			</div>
			<div className="rounded-lg border border-gray-300 bg-white p-4">
				<h3 className="mb-4 font-semibold">알림</h3>
				<Placeholder />
			</div>
			<div className="rounded-lg border border-gray-300 bg-white p-4">
				<h3 className="mb-4 font-semibold">통계</h3>
				<Placeholder />
			</div>
			<div className="rounded-lg border border-gray-300 bg-white p-4">
				<h3 className="mb-4 font-semibold">메시지</h3>
				<Placeholder />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Placeholder used in multiple dashboard sections when content is empty.",
			},
		},
	},
};

export const Playground: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing the placeholder component.",
			},
		},
	},
};
