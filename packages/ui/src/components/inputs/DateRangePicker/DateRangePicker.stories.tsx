import { DateRangePickerProps } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DateRangePicker } from "./DateRangePicker";

const meta: Meta<typeof DateRangePicker> = {
	title: "Inputs/DateRangePicker",
	component: DateRangePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Date Range",
	},
	render: (args) => {
		const [value, setValue] = useState<DateRangePickerProps["value"]>();

		const handleChange: DateRangePickerProps["onChange"] = (value) => {
			setValue(value);
		};

		return <DateRangePicker {...args} onChange={handleChange} value={value} />;
	},
};
