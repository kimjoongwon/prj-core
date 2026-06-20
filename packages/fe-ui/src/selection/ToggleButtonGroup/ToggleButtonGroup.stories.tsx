import { ToggleButton } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

const meta: Meta<typeof ToggleButtonGroup> = {
	title: "selection/ToggleButtonGroup",
	component: ToggleButtonGroup,
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
		"aria-label": "정렬 방식",
		defaultSelectedKeys: ["left"],
	},
	render: (args) => (
		<ToggleButtonGroup {...args}>
			<>
				<ToggleButton id="left">왼쪽</ToggleButton>
				<ToggleButtonGroup.Separator />
				<ToggleButton id="center">가운데</ToggleButton>
				<ToggleButtonGroup.Separator />
				<ToggleButton id="right">오른쪽</ToggleButton>
			</>
		</ToggleButtonGroup>
	),
};
