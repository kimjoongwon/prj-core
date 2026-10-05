import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggleButton } from "./ThemeToggleButton";

const meta = {
	title: "domain/theme/ThemeToggleButton",
	component: ThemeToggleButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {},
} satisfies Meta<typeof ThemeToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
