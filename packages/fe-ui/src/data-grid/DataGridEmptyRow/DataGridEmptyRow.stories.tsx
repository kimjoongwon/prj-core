import type { Meta, StoryObj } from "@storybook/react";
import { DataGridEmptyRow } from "./index";

const meta = {
	title: "data-grid/DataGridEmptyRow",
	component: DataGridEmptyRow,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { colSpan: 3, emptyMessage: "표시할 데이터가 없습니다." },
} satisfies Meta<typeof DataGridEmptyRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<table className="w-[520px] border-collapse border border-border">
			<tbody>
				<DataGridEmptyRow {...args} />
			</tbody>
		</table>
	),
};
