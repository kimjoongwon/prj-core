import type { Option } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import type { Key } from "react";
import { useState } from "react";
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
	{ text: "Tab 1", value: "1" },
	{ text: "Tab 2", value: "2" },
	{ text: "Tab 3", value: "3" },
];

export const Default: Story = {
	args: {
		options,
	},
	render: (args) => {
		const [selectedKey, setSelectedKey] = useState<Key>("1");
		return (
			<Tabs
				{...args}
				selectedKey={selectedKey as string}
				onSelectionChange={setSelectedKey}
			/>
		);
	},
};
