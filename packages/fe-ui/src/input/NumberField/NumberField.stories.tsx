import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";

const meta: Meta<typeof NumberField> = {
	title: "input/NumberField",
	component: NumberField,
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		"aria-label": "수량",
		defaultValue: 24,
	},
	render: (args) => (
		<NumberField {...args}>
			<NumberField.Group>
				<NumberField.DecrementButton>-</NumberField.DecrementButton>
				<NumberField.Input />
				<NumberField.IncrementButton>+</NumberField.IncrementButton>
			</NumberField.Group>
		</NumberField>
	),
};
