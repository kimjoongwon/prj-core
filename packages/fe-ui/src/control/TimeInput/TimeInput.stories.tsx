import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimeInput } from "./TimeInput";

const meta: Meta<typeof TimeInput> = {
	title: "control/TimeInput",
	component: TimeInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Select a time",
	},
	render: (args) => {
		const [_value, setValue] = useState<string>("");
		return <TimeInput {...args} onChange={setValue} />;
	},
};
