import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridColumnResizer } from "./index";

const state = new DataGridState({
	queryStates: {},
	setQueryStates: async () => new URLSearchParams(),
});

const meta = {
	title: "data-grid/DataGridColumnResizer",
	component: DataGridColumnResizer,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { columnId: "name", state },
} satisfies Meta<typeof DataGridColumnResizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<table className="border border-border">
			<thead>
				<tr>
					<th className="relative h-10 w-48 border-border border-r px-3 text-left">
						이름
						<DataGridColumnResizer {...args} />
					</th>
				</tr>
			</thead>
		</table>
	),
};
