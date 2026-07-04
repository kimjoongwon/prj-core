import type { DataGridConfig } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGridTableBody } from "./index";

interface StoryRow {
	id: string;
	name: string;
}
const config: DataGridConfig<StoryRow> = {
	entity: "User",
	columns: [],
	emptyMessage: "행이 없습니다.",
};
const t = (key: string) => key;

const meta = {
	title: "data-grid/DataGridTableBody",
	component: DataGridTableBody,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		config: config as never,
		rows: [],
		selectedKeySet: new Set<string>(),
		selectionMode: "multiple",
		tableColumnCount: 3,
		t,
		onRowSelectionChange: () => undefined,
	},
} satisfies Meta<typeof DataGridTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
	render: (args) => (
		<table className="w-[640px] border-collapse border border-border">
			<DataGridTableBody {...args} />
		</table>
	),
};
