import type { Meta, StoryObj } from "@storybook/react";
import { ChipCell } from "./ChipCell";

const meta = {
	title: "data-grid/cell/ChipCell",
	component: ChipCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { label: "활성", color: "success" },
} satisfies Meta<typeof ChipCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { label: null, placeholder: "-" } };
export const LongText: Story = {
	args: {
		label: "장기 검토가 필요한 특별 상태",
		color: "warning",
		align: "start",
	},
};
