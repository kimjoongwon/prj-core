import type { DataGridConfig } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridTable } from "./index";

interface StoryRow {
	id: string;
	name: string;
}
const config: DataGridConfig<StoryRow> = {
	entity: "User",
	columns: [],
	emptyMessage: "행이 없습니다.",
};
const state = new DataGridState({
	queryStates: {},
	setQueryStates: async () => new URLSearchParams(),
});
const t = (key: string) => key;

const meta = {
	title: "data-grid/DataGridTable",
	component: DataGridTable,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		config: config as never,
		headers: [],
		isAllVisibleRowsSelected: false,
		isSomeVisibleRowsSelected: false,
		rows: [],
		selectedKeySet: new Set<string>(),
		selectionMode: "multiple",
		sortValues: [],
		state,
		t,
		onRowSelectionChange: () => undefined,
		onSortChange: () => undefined,
		onVisibleSelectionChange: () => undefined,
	},
} satisfies Meta<typeof DataGridTable>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
	render: (args) => (
		<div className="w-[640px]">
			<DataGridTable {...args} />
		</div>
	),
};
