import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
	title: "Inputs/TimePicker",
	component: TimePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const [time, setTime] = useState("12:00");
		return <TimePicker {...args} time={time} onChange={setTime} />;
	},
};
