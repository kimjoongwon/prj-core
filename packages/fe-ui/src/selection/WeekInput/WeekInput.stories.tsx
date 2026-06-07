import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { type RecurringDayOfTheWeek, WeekInput } from "./WeekInput";

const meta: Meta<typeof WeekInput> = {
	title: "selection/WeekInput",
	component: WeekInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "MONDAY",
	},
	render: (args) => {
		const [value, setValue] = useState<RecurringDayOfTheWeek>("MONDAY");
		return <WeekInput {...args} value={value} onChange={setValue} />;
	},
};
