import type { Meta, StoryObj } from "@storybook/react";
import { SecretField } from "./SecretField";

const meta = {
	title: "widget/SecretField",
	component: SecretField,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { value: "sk_live_1234567890abcdef" },
} satisfies Meta<typeof SecretField>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Masked: Story = {};
export const Empty: Story = { args: { value: null } };
