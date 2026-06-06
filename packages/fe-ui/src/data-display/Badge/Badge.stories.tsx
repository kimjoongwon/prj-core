import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
	title: "Ui/data-display/Badge",
	component: Badge,
	tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "New",
		color: "accent",
		variant: "soft",
	},
};

export const Variants: Story = {
	args: {
		children: "Primary",
		color: "accent",
		variant: "primary",
	},
};

export const Composition: Story = {
	args: {
		children: "Label",
		color: "accent",
		variant: "secondary",
	},
	render: (args) => (
		<Badge {...args} className="inline-flex items-center gap-1">
			<Badge.Anchor>외부</Badge.Anchor>
			{args.children}
		</Badge>
	),
};
