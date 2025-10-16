import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Option } from "../../../types";
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

const options: Option[] = [
	{ key: "1", label: "Tab 1", value: "1" },
	{ key: "2", label: "Tab 2", value: "2" },
	{ key: "3", label: "Tab 3", value: "3" },
];

export const Default: Story = {
	args: {
		options,
	},
	render: (args) => {
		const [selectedTab, setSelectedTab] = useState("1");
		return (
			<Tabs {...args} selectedTab={selectedTab} onChange={setSelectedTab} />
		);
	},
};
