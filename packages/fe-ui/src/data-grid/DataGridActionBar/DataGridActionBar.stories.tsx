import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { DataGridActionBar } from "./index";

const meta = {
	title: "data-grid/DataGridActionBar",
	component: DataGridActionBar,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		selectedCount: 3,
		showCount: true,
		actions: (
			<>
				<Button size="sm">보관</Button>
				<Button size="sm">삭제</Button>
			</>
		),
	},
} satisfies Meta<typeof DataGridActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
export const HiddenWhenEmpty: Story = { args: { selectedCount: 0 } };
