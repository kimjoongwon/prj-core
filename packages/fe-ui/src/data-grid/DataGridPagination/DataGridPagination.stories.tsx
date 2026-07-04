import type { Meta, StoryObj } from "@storybook/react";
import { DataGridPagination } from "./index";

const meta = {
	title: "data-grid/DataGridPagination",
	component: DataGridPagination,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		currentPage: 2,
		take: 10,
		totalCount: 87,
		onPageChange: () => undefined,
	},
} satisfies Meta<typeof DataGridPagination>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SinglePage: Story = { args: { currentPage: 1, totalCount: 6 } };
