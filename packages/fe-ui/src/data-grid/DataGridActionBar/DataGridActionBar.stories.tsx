import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridActionBar } from "./index";

const state = new DataGridState({
	queryStates: {},
	setQueryStates: async () => new URLSearchParams(),
});

const meta = {
	title: "data-grid/DataGridActionBar",
	component: DataGridActionBar,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		selectedCount: 3,
		state,
		actionBarConfig: {
			showCount: true,
			actions: [
				{
					id: "archive",
					type: "button",
					label: "보관",
					props: { variant: "flat", color: "primary", size: "sm" },
				},
				{
					id: "delete",
					type: "button",
					label: "삭제",
					props: { variant: "flat", color: "danger", size: "sm" },
				},
			],
		},
	},
} satisfies Meta<typeof DataGridActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
export const HiddenWhenEmpty: Story = { args: { selectedCount: 0 } };
