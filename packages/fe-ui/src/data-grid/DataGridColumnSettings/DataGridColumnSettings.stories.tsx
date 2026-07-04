import type { DataGridColumnConfig } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridColumnSettings } from "./index";

interface StoryRow {
	id: string;
	name: string;
	status: string;
	createdAt: string;
}
const columns: DataGridColumnConfig<StoryRow>[] = [
	{ field: "name", label: "이름", isRequired: true },
	{ field: "status", label: "상태" },
	{ field: "createdAt", label: "생성일" },
];
const state = new DataGridState({
	queryStates: {},
	setQueryStates: async () => new URLSearchParams(),
	columns: { visibility: { createdAt: false } },
});

const meta = {
	title: "data-grid/DataGridColumnSettings",
	component: DataGridColumnSettings,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { columns: columns as never, state },
} satisfies Meta<typeof DataGridColumnSettings>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
