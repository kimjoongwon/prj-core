import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { WeekInput } from "./WeekInput";

const meta: Meta<typeof WeekInput> = {
	title: "Inputs/WeekInput",
	component: WeekInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => {
		const [day, setDay] = useState("MONDAY");
		return <WeekInput {...args} day={day} onChange={setDay} />;
	},
};
