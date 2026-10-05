import type { Meta, StoryObj } from "@storybook/react";
import { VariableEditTable } from "./VariableEditTable";

const variables = [
	{
		id: "var-1",
		name: "userName",
		description: "고객 이름",
		defaultValue: "김온유",
		isRequired: true,
	},
	{
		id: "var-2",
		name: "reservationDate",
		description: "예약일",
		defaultValue: "2026-07-04",
		isRequired: false,
	},
];
const meta = {
	title: "form/VariableEditTable",
	component: VariableEditTable,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		variables,
		contentText: "{{userName}}님의 예약일은 {{reservationDate}}입니다.",
		onChange: () => undefined,
	},
} satisfies Meta<typeof VariableEditTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[760px]">
			<VariableEditTable {...args} />
		</div>
	),
};
export const WithErrors: Story = {
	args: { errors: { 0: { name: "영문으로 시작해야 합니다." } } },
	render: Default.render,
};
