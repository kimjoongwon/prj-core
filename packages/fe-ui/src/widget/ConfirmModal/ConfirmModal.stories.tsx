import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmModal } from "./ConfirmModal";

const meta = {
	title: "widget/ConfirmModal",
	component: ConfirmModal,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		isOpen: true,
		title: "삭제 확인",
		message: "선택한 항목을 삭제할까요?",
		confirmText: "삭제",
		confirmColor: "danger",
		iconType: "delete",
		onClose: () => undefined,
		onConfirm: () => undefined,
	},
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Danger: Story = {};
export const Loading: Story = { args: { loading: true } };
