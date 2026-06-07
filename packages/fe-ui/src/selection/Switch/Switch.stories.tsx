import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
	title: "selection/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: false,
	},
	render: (args) => {
		const [checked, setChecked] = useState(false);
		return <Switch {...args} value={checked} onValueChange={setChecked} />;
	},
};

export const Checked: Story = {
	args: {
		value: true,
	},
	render: (args) => {
		const [checked, setChecked] = useState(true);
		return <Switch {...args} value={checked} onValueChange={setChecked} />;
	},
};
