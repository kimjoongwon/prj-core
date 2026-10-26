import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useState } from "react";
import { Switch as BoundSwitch } from "./index";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
	title: "input/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const createSwitchStoryState = () =>
	makeAutoObservable(
		{ enabled: false },
		{},
		{ autoBind: true, name: "SwitchStoryState" },
	);

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

export const ExternalState: Story = {
	render: () => {
		const state = useLocalObservable(createSwitchStoryState);
		return <BoundSwitch state={state} path="enabled" />;
	},
};
