import type { Meta, StoryObj } from "@storybook/react";
import { RangeCalendar } from "./RangeCalendar";

const meta: Meta<typeof RangeCalendar> = {
	title: "Controls/RangeCalendar",
	component: RangeCalendar,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
