import type { Meta, StoryObj } from "@storybook/react";
import { FieldError } from "./FieldError";

const meta: Meta<typeof FieldError> = {
	title: "control/FieldError",
	component: FieldError,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
