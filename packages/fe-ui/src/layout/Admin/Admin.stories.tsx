import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../../data-display/Typography";
import { Admin } from "./Admin";

const meta = {
	title: "layout/Admin",
	component: Admin,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof Admin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shell: Story = {
	render: () => (
		<Admin>
			<Admin.Header>
				<div className="px-6 py-4">
					<Typography weight="semibold">Admin header</Typography>
				</div>
			</Admin.Header>
			<Admin.Body>
				<Admin.LeftAside>
					<div className="h-full border-border border-r bg-surface p-4">
						<Typography.Paragraph color="muted" size="sm">
							Navigation
						</Typography.Paragraph>
					</div>
				</Admin.LeftAside>
				<Admin.Main>
					<div className="rounded-lg border border-border bg-surface p-6">
						<Typography>Main content</Typography>
					</div>
				</Admin.Main>
				<Admin.RightAside>
					<div className="h-full border-border border-l bg-surface p-4">
						<Typography.Paragraph color="muted" size="sm">
							Summary
						</Typography.Paragraph>
					</div>
				</Admin.RightAside>
			</Admin.Body>
		</Admin>
	),
};
