import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
	title: "Inputs/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
	{ text: "Tab 1", value: "1" },
	{ text: "Tab 2", value: "2" },
	{ text: "Tab 3", value: "3" },
];

const Template: Story['render'] = (args) => {
	const state = useLocalObservable(() => ({ selectedTab: args.state?.selectedTab || "1" }));
	return <Tabs {...args} state={state} path="selectedTab" />;
};

export const Default: Story = {
	args: {
		options,
		state: { selectedTab: "1" },
	},
	render: Template,
};
