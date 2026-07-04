import type { Meta, StoryObj } from "@storybook/react";
import { DataGridLoading } from "./index";

const meta = {
	title: "data-grid/DataGridLoading",
	component: DataGridLoading,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof DataGridLoading>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: () => (
		<div className="w-[720px]">
			<DataGridLoading />
		</div>
	),
};
