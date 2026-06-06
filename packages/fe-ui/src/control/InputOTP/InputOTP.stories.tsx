import type { Meta, StoryObj } from "@storybook/react";
import { InputOTP } from "./InputOTP";

const meta: Meta<typeof InputOTP> = {
	title: "Controls/InputOTP",
	component: InputOTP,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
