import type { Meta, StoryObj } from "@storybook/react";
import { TemplateDetailPage } from "./TemplateDetailPage";

const defaultArgs = {
	isDeleteModalOpen: false,
	isDeletePending: false,
	isLoading: false,
	isNotFound: false,
	isPreviewModalOpen: false,
	isSendTestModalOpen: false,
	isTogglePending: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteButton: (..._args: never[]) => undefined,
	onClickDeleteCancelButton: (..._args: never[]) => undefined,
	onClickDeleteConfirmButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onClickPreviewButton: (..._args: never[]) => undefined,
	onClickPreviewCloseButton: (..._args: never[]) => undefined,
	onClickSendTestButton: (..._args: never[]) => undefined,
	onClickSendTestCloseButton: (..._args: never[]) => undefined,
	onClickToggleButton: (..._args: never[]) => undefined,
	onSubmitPreviewTemplate: async (..._args: never[]) => ({
		html: "<p>안녕하세요 {{userName}}님</p>",
		text: "안녕하세요 고객님",
		subject: "주문 상태 안내",
	}),
	onSubmitSendTestTemplate: async (..._args: never[]) => ({
		success: true,
		sentAt: "2026-04-18T12:00:00.000Z",
		errorMessage: null,
	}),
	template: {
		id: "template-order-status",
		code: "ORDER_STATUS",
		name: "주문 상태 안내",
		content:
			"안녕하세요 {{userName}}님, 주문 {{orderNumber}}의 상태를 안내드립니다.",
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "주문 상태 변경 시 고객에게 발송하는 기본 템플릿입니다.",
		isActive: true,
		subject: "주문 상태 안내",
		type: "EMAIL",
		updatedAt: "2026-04-18T10:30:00.000Z",
		variables: [
			{
				id: "template-variable-user-name",
				name: "userName",
				defaultValue: "고객",
				description: "수신 고객 이름",
				isRequired: true,
			},
			{
				id: "template-variable-order-number",
				name: "orderNumber",
				defaultValue: null,
				description: "주문 번호",
				isRequired: true,
			},
		],
	},
	templateId: "template-order-status",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
	template: undefined,
};

const meta = {
	component: TemplateDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TemplateDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};
