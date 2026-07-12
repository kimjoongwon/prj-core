import type { Meta, StoryObj } from "@storybook/react";
import { TemplateActions } from "./TemplateActions";

const meta = {
	title: "domain/template/TemplateActions",
	component: TemplateActions,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		templateId: "tpl-001",
		isActive: true,
		onEdit: () => undefined,
		onDelete: () => undefined,
		onToggle: () => undefined,
		onPreview: () => undefined,
		onSendTest: () => undefined,
	},
} satisfies Meta<typeof TemplateActions>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Active: Story = {};
export const Inactive: Story = { args: { isActive: false } };
