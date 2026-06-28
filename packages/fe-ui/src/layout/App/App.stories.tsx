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
					"Root app layout primitive입니다. Header, Body, Aside, Main, Footer compound 슬롯을 소유합니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<App>
			<App.Body>
				<App.Main>
					<div className="rounded-lg border border-border bg-surface p-6">
						App main
					</div>
				</App.Main>
			</App.Body>
		</App>
	),
};

export const WithSlots: Story = {
	render: () => (
		<App>
			<App.Header>
				<div className="border-border border-b bg-surface px-4 py-3">
					Header slot
				</div>
			</App.Header>
			<App.Body>
				<App.LeftAside>
					<div className="h-full border-border border-r bg-surface p-4">
						Left aside
					</div>
				</App.LeftAside>
				<App.Main>
					<div className="min-h-48 rounded-lg border border-border bg-surface p-6">
						App main
					</div>
				</App.Main>
				<App.RightAside>
					<div className="h-full border-border border-l bg-surface p-4">
						Right aside
					</div>
				</App.RightAside>
			</App.Body>
			<App.Footer>
				<div className="border-border border-t bg-surface px-4 py-3">
					Footer slot
				</div>
			</App.Footer>
		</App>
	),
};
