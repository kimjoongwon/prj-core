import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridHeaderFilter } from "./index";

const state = new DataGridState({
	queryStates: { keyword: "예약" },
	setQueryStates: async () => new URLSearchParams(),
});

const meta = {
	title: "data-grid/DataGridHeaderFilter",
	component: DataGridHeaderFilter,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		state,
		config: {
			id: "keyword",
			type: "search",
			label: "키워드",
			placeholder: "검색어",
		},
	},
} satisfies Meta<typeof DataGridHeaderFilter>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Search: Story = {
	render: (args) => (
		<div className="w-56">
			<DataGridHeaderFilter {...args} />
		</div>
	),
};
