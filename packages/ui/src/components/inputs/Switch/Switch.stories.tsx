import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
	title: "Inputs/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const [checked, setChecked] = useState(false);
		return <Switch {...args} checked={checked} onChange={setChecked} />;
	},
};

export const Checked: Story = {
	render: (args) => {
		const [checked, setChecked] = useState(true);
		return <Switch {...args} checked={checked} onChange={setChecked} />;
	},
};
