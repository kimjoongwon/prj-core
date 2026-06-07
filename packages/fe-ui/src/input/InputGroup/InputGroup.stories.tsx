import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup } from "./InputGroup";

const meta: Meta<typeof InputGroup> = {
	title: "input/InputGroup",
	component: InputGroup,
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
	render: (args) => (
		<InputGroup {...args}>
			<InputGroup.Prefix>https://</InputGroup.Prefix>
			<InputGroup.Input placeholder="example.com" />
			<InputGroup.Suffix>.com</InputGroup.Suffix>
		</InputGroup>
	),
};
