import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../../data-display/Typography";
import { Admin } from "../Admin";
import { Auth } from "../Auth";
import { App } from "./App";

const meta = {
	title: "layout/App",
	component: App,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"전역 content boundary와 global layer를 소유하는 root app primitive입니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlobalBoundary: Story = {
	render: () => (
		<App>
			<App.Content>
				<div className="min-h-screen bg-surface-secondary p-6">
					<Typography>App content</Typography>
				</div>
			</App.Content>
			<App.GlobalLayer>
				<div className="pointer-events-auto fixed right-4 bottom-4 rounded-lg border border-border bg-surface px-4 py-2 shadow-sm">
					<Typography.Paragraph size="sm">Global layer</Typography.Paragraph>
				</div>
			</App.GlobalLayer>
			<App.PortalHost />
		</App>
	),
};

export const WithAdminShell: Story = {
	render: () => (
		<App>
			<App.Content>
				<Admin>
					<Admin.Header>
						<div className="border-border border-b bg-surface px-4 py-3">
							<Typography>Admin header</Typography>
						</div>
					</Admin.Header>
					<Admin.Body>
						<Admin.LeftAside>
							<div className="h-full border-border border-r bg-surface p-4">
								<Typography>Admin navigation</Typography>
							</div>
						</Admin.LeftAside>
						<Admin.Main>
							<div className="rounded-lg border border-border bg-surface p-6">
								<Typography>Admin main</Typography>
							</div>
						</Admin.Main>
					</Admin.Body>
				</Admin>
			</App.Content>
		</App>
	),
};

export const WithAuth: Story = {
	render: () => (
		<App>
			<App.Content>
				<Auth>
					<Auth.Body>
						<Auth.Main>
							<div className="rounded-2xl border border-border bg-surface p-6">
								<Typography>Auth main</Typography>
							</div>
						</Auth.Main>
					</Auth.Body>
				</Auth>
			</App.Content>
		</App>
	),
};
