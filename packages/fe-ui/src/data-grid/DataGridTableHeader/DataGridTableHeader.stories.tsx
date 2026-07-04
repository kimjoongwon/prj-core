import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridTableHeader } from "./index";

const state = new DataGridState({
	queryStates: {},
	setQueryStates: async () => new URLSearchParams(),
});
const t = (key: string) => key;

const meta = {
	title: "data-grid/DataGridTableHeader",
	component: DataGridTableHeader,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		headers: [],
		isAllVisibleRowsSelected: false,
		isSomeVisibleRowsSelected: true,
		selectionMode: "multiple",
		sortValues: [],
		state,
		t,
		onSortChange: () => undefined,
		onVisibleSelectionChange: () => undefined,
	},
} satisfies Meta<typeof DataGridTableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;
export const SelectionOnly: Story = {
	render: (args) => (
		<table className="w-[480px] border-collapse border border-border">
			<DataGridTableHeader {...args} />
		</table>
	),
};
