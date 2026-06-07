import type { Meta, StoryObj } from "@storybook/react";
import { Fieldset } from "./Fieldset";

const meta: Meta<typeof Fieldset> = {
	title: "control/Fieldset",
	component: Fieldset,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
