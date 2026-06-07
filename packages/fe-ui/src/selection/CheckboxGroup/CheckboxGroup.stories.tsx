import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../Checkbox/Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
	title: "selection/CheckboxGroup",
	component: CheckboxGroup,
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
		"aria-label": "알림 채널",
		defaultValue: ["email", "push"],
	},
	render: (args) => (
		<CheckboxGroup {...args}>
			<>
				<Checkbox value="email">이메일</Checkbox>
				<Checkbox value="push">푸시</Checkbox>
				<Checkbox value="sms">문자</Checkbox>
			</>
		</CheckboxGroup>
	),
};
