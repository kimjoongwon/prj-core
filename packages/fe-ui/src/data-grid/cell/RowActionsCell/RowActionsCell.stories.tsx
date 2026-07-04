import type { Meta, StoryObj } from "@storybook/react";
import { RowActionsCell } from "./RowActionsCell";

const meta = {
	title: "data-grid/cell/RowActionsCell",
	component: RowActionsCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		id: "user-001",
		basePath: "/users",
		onDelete: () => undefined,
	},
} satisfies Meta<typeof RowActionsCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { showEdit: false, showDelete: false } };
export const DisabledActions: Story = {
	args: { disableEdit: true, disableDelete: true },
};
