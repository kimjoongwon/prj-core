import type { Meta, StoryObj } from "@storybook/react";
import { DataGridSortHeader } from "./index";

const meta = {
	title: "data-grid/DataGridSortHeader",
	component: DataGridSortHeader,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { label: "생성일", sortDirection: null, onToggle: () => undefined },
} satisfies Meta<typeof DataGridSortHeader>;

export default meta;
type Story = StoryObj<typeof meta>;
export const None: Story = {};
export const Ascending: Story = { args: { sortDirection: "asc" } };
export const Descending: Story = { args: { sortDirection: "desc" } };
