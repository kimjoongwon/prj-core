import type { DataGridColumnConfig } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGridGroupPanel } from "./index";

interface StoryRow {
	id: string;
	status: string;
	owner: string;
}
const columns: DataGridColumnConfig<StoryRow>[] = [
	{ field: "status", label: "상태", enableRowGroup: true },
	{ field: "owner", label: "담당자", enableRowGroup: true },
];
const meta = {
	title: "data-grid/DataGridGroupPanel",
	component: DataGridGroupPanel,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		columns: columns as never,
		grouping: ["status"],
		rowGroupPanelShow: "always",
		onGroupingChange: () => undefined,
	},
} satisfies Meta<typeof DataGridGroupPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Grouped: Story = {};
export const Empty: Story = { args: { grouping: [] } };
