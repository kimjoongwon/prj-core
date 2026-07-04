import type { Meta, StoryObj } from "@storybook/react";
import { DataGridSelectionCell } from "./index";

const meta = {
	title: "data-grid/DataGridSelectionCell",
	component: DataGridSelectionCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		entity: "User",
		rowKey: "user-001",
		selectionMode: "multiple",
		isSelected: true,
		onSelectionChange: () => undefined,
	},
} satisfies Meta<typeof DataGridSelectionCell>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Selected: Story = {
	render: (args) => (
		<table>
			<tbody>
				<tr>
					<DataGridSelectionCell {...args} />
				</tr>
			</tbody>
		</table>
	),
};
export const Unselected: Story = { args: { isSelected: false } };
