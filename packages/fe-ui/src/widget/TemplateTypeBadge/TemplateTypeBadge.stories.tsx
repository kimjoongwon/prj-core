import type { Meta, StoryObj } from "@storybook/react";
import { TemplateTypeBadge } from "./TemplateTypeBadge";

const meta = {
	title: "widget/TemplateTypeBadge",
	component: TemplateTypeBadge,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { type: "EMAIL" },
} satisfies Meta<typeof TemplateTypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Email: Story = {};
export const Sms: Story = { args: { type: "SMS" } };
export const Push: Story = { args: { type: "PUSH" } };
