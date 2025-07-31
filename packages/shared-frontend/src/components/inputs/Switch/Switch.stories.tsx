import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
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

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ checked: args.state?.checked || false }));
	return <Switch {...args} state={state} path="checked" />;
};

export const Default: Story = {
	args: {
		state: { checked: false },
	},
	render: Template,
};

export const Checked: Story = {
	args: {
		state: { checked: true },
	},
	render: Template,
};
