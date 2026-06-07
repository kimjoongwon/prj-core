import type { Meta, StoryObj } from "@storybook/react";
import { DateField } from "./DateField";

const meta: Meta<typeof DateField> = {
	title: "input/DateField",
	component: DateField,
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
		"aria-label": "기준일",
	},
	render: (args) => (
		<DateField {...args}>
			<DateField.Group>
				<DateField.Input>
					{(segment) => <DateField.Segment segment={segment} />}
				</DateField.Input>
			</DateField.Group>
		</DateField>
	),
};
