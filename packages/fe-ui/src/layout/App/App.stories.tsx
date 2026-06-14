import type { Meta, StoryObj } from "@storybook/react";
import { App } from "./App";

const meta = {
	title: "layout/App",
	component: App,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Root app layout primitive입니다. header/footer/leftAside/rightAside/main 구조 슬롯을 소유합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		main: {
			table: {
				disable: true,
			},
			control: false,
		},
		header: {
			table: {
				disable: true,
			},
			control: false,
		},
		leftAside: {
			table: {
				disable: true,
			},
			control: false,
		},
		rightAside: {
			table: {
				disable: true,
			},
			control: false,
		},
	},
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		main: (
			<div className="rounded-md border border-divider bg-content1 p-6">
				App main
			</div>
		),
	},
};

export const WithSlots: Story = {
	args: {
		header: (
			<div className="rounded-md border border-divider bg-content1 p-4">
				Header slot
			</div>
		),
		leftAside: (
			<div className="w-40 rounded-md border border-divider bg-content1 p-4">
				Left aside
			</div>
		),
		rightAside: (
			<div className="w-40 rounded-md border border-divider bg-content1 p-4">
				Right aside
			</div>
		),
		main: (
			<div className="min-h-48 rounded-md border border-divider bg-content1 p-6">
				App main
			</div>
		),
		footer: (
			<div className="rounded-md border border-divider bg-content1 p-4">
				Footer slot
			</div>
		),
	},
};
