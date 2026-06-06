import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
	title: "Navigation/Breadcrumbs",
	component: Breadcrumbs,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderBreadcrumbs = (args: Story["args"]) => (
	<Breadcrumbs {...args}>
		<Breadcrumbs.Item href="#">Workspace</Breadcrumbs.Item>
		<Breadcrumbs.Item href="#">Users</Breadcrumbs.Item>
		<Breadcrumbs.Item>Detail</Breadcrumbs.Item>
	</Breadcrumbs>
);

export const Default: Story = {
	args: {},
	render: renderBreadcrumbs,
};

export const Composition: Story = {
	args: {
		separator: "/",
	},
	render: renderBreadcrumbs,
};
