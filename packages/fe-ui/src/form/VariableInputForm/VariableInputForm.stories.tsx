import type { Meta, StoryObj } from "@storybook/react";
import { VariableInputForm } from "./VariableInputForm";

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
	title: "form/VariableInputForm",
	component: VariableInputForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		variables,
		values: { userName: "김온유" },
		onChange: () => undefined,
	},
} satisfies Meta<typeof VariableInputForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[420px]">
			<VariableInputForm {...args} />
		</div>
	),
};
export const Empty: Story = {
	args: { variables: [], values: {} },
	render: Default.render,
};
