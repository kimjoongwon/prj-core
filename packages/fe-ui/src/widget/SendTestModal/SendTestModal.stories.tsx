import type { Meta, StoryObj } from "@storybook/react";
import { SendTestModal } from "./SendTestModal";

const variables = [
	{
		id: "name",
		name: "userName",
		description: "고객 이름",
		defaultValue: "김온유",
		isRequired: true,
	},
];

const meta = {
	title: "widget/SendTestModal",
	component: SendTestModal,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		isOpen: true,
		onClose: () => undefined,
		templateId: "tpl-welcome",
		type: "EMAIL",
		variables,
		onSendTest: async () => ({
			success: true,
			sentAt: "2026-07-04T10:30:00.000Z",
			errorMessage: null,
		}),
	},
} satisfies Meta<typeof SendTestModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Email: Story = {};
export const Sms: Story = { args: { type: "SMS" } };
