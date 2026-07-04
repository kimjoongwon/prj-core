import type { Meta, StoryObj } from "@storybook/react";
import { PreviewModal } from "./PreviewModal";

const variables = [
	{
		id: "name",
		name: "userName",
		description: "고객 이름",
		defaultValue: "김온유",
		isRequired: true,
	},
	{
		id: "date",
		name: "reservationDate",
		description: "예약일",
		defaultValue: "2026-07-04",
		isRequired: false,
	},
];

const meta = {
	title: "widget/PreviewModal",
	component: PreviewModal,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		isOpen: true,
		onClose: () => undefined,
		templateId: "tpl-welcome",
		type: "EMAIL",
		variables,
		onPreview: (async () => ({
			type: "EMAIL",
			subject: "예약 안내",
			content: "<p>김온유님의 예약이 확정되었습니다.</p>",
			unresolvedVariables: [],
		})) as never,
	},
} satisfies Meta<typeof PreviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Email: Story = {};
export const Sms: Story = {
	args: {
		type: "SMS",
		onPreview: (async () => ({
			type: "SMS",
			subject: null,
			content: "예약이 확정되었습니다.",
			unresolvedVariables: [],
		})) as never,
	},
};
