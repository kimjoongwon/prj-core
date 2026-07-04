import type { DataGridColumnConfig } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGridState } from "../DataGridState";
import { DataGridToolbar } from "./index";

interface StoryRow {
	id: string;
	name: string;
	status: string;
}
const columns: DataGridColumnConfig<StoryRow>[] = [
	{ field: "name", label: "이름", isRequired: true },
	{ field: "status", label: "상태" },
];
const state = new DataGridState({
	queryStates: { search: "" },
	setQueryStates: async () => new URLSearchParams(),
});

const meta = {
	title: "data-grid/DataGridToolbar",
	component: DataGridToolbar,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		columns: columns as never,
		leftInputs: [
			{ id: "search", type: "search", label: "검색", placeholder: "이름 검색" },
		],
		rightInputs: [
			{
				id: "refresh",
				type: "button",
				label: "새로고침",
				props: { variant: "bordered", size: "sm" },
			},
		],
		state,
	},
} satisfies Meta<typeof DataGridToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[720px]">
			<DataGridToolbar {...args} />
		</div>
	),
};
