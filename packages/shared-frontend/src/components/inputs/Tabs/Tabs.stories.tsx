import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { Tabs } from "./Tabs";
import { Option } from "../../../types";

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

const options: Option[] = [
	{ key: "1", label: "Tab 1", value: "1" },
	{ key: "2", label: "Tab 2", value: "2" },
	{ key: "3", label: "Tab 3", value: "3" },
];

const Template: Story["render"] = (args) => {
	const state = useLocalObservable(() => ({
		// @ts-ignore
		selectedTab: args.state?.selectedTab || "1",
	}));
	return <Tabs {...args} state={state} path="selectedTab" />;
};

export const Default: Story = {
	args: {
		options,
		state: { selectedTab: "1" },
	},
	render: Template,
};
