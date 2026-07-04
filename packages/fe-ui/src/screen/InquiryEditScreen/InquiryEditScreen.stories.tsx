import type { Meta, StoryObj } from "@storybook/react";
import { InquiryEditScreen } from "./InquiryEditScreen";

const formState = {
	category: "GENERAL",
	channel: "WEB",
	content: "배송 상태가 업데이트되지 않습니다.",
	customerId: "customer-1",
	customerKeyword: "홍길동",
	errors: {},
	priority: "LOW",
	searchResults: [],
	title: "배송 상태 문의",
};

const defaultArgs = {
	bootstrap: {
		fieldMeta: {},
		options: {
			category: [
				{ label: "일반", value: "GENERAL" },
				{ label: "배송", value: "DELIVERY" },
			],
			channel: [
				{ label: "웹", value: "WEB" },
				{ label: "이메일", value: "EMAIL" },
			],
			priority: [
				{ label: "낮음", value: "LOW" },
				{ label: "높음", value: "HIGH" },
			],
			status: [
				{ label: "신규", value: "NEW" },
				{ label: "열림", value: "OPEN" },
			],
		},
		ui: { readOnlyPaths: [], hiddenPaths: [], disabledPaths: [] },
	},
	categoryOptions: [
		{ label: "일반", value: "GENERAL" },
		{ label: "배송", value: "DELIVERY" },
	],
	formState,
	isLoading: false,
	isSubmitting: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
	priorityOptions: [
		{ label: "낮음", value: "LOW" },
		{ label: "높음", value: "HIGH" },
	],
	submitLabel: "저장",
	title: "문의 수정",
};

const createArgs = {
	...defaultArgs,
	channelOptions: [
		{ label: "웹", value: "WEB" },
		{ label: "이메일", value: "EMAIL" },
	],
	formState: {
		...formState,
		searchResults: [
			{
				description: "member@example.com | 010-1234-5678",
				email: "member@example.com",
				id: "customer-1",
				label: "홍길동",
				name: "홍길동",
				phone: "010-1234-5678",
			},
		],
	},
	onSearchCustomer: (..._args: never[]) => undefined,
	onSelectCustomer: (..._args: never[]) => undefined,
	showChannelField: true,
	showContentField: true,
	showCustomerField: true,
	submitLabel: "등록",
	title: "문의 접수",
};

const readOnlyArgs = {
	...defaultArgs,
	formState: undefined,
	inquiry: {
		assigneeId: "agent-1",
		category: "GENERAL",
		channel: "WEB",
		createdAt: "2026-04-14T09:00:00.000Z",
		customerId: "customer-1",
		firstResponseAt: "2026-04-14T09:15:00.000Z",
		id: "inquiry-1",
		inquiryNumber: "INQ-2026-001",
		isSlaResolveBreached: false,
		isSlaResponseBreached: false,
		priority: "LOW",
		resolvedAt: "2026-04-14T12:30:00.000Z",
		sentiment: {
			confidence: 0.82,
			sentiment: "POSITIVE",
		},
		slaResolveDue: "2026-04-14T13:00:00.000Z",
		slaResponseDue: "2026-04-14T10:00:00.000Z",
		status: "OPEN",
		title: "배송 상태가 업데이트되지 않습니다",
	},
	inquiryId: "inquiry-1",
	metaFormState: formState,
	onChangeAssignee: (..._args: never[]) => undefined,
	onChangeCategory: (..._args: never[]) => undefined,
	onChangePriority: (..._args: never[]) => undefined,
	onChangeStatus: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onClickReconnectButton: (..._args: never[]) => undefined,
	onClickSearchKnowledgeButton: (..._args: never[]) => undefined,
	onCloseDeleteModal: (..._args: never[]) => undefined,
	onConfirmDelete: (..._args: never[]) => undefined,
	onOpenDeleteModal: (..._args: never[]) => undefined,
	onSendInquiryMessage: (..._args: never[]) => undefined,
	onSendTypingStatus: (..._args: never[]) => undefined,
	onTagAdd: (..._args: never[]) => undefined,
	onTagRemove: (..._args: never[]) => undefined,
	onTypingStart: (..._args: never[]) => undefined,
	onTypingStop: (..._args: never[]) => undefined,
	onlineParticipantNames: ["agent-1"],
	participantListItems: [
		{
			id: "participant-customer-1",
			isOnline: true,
			isTyping: false,
			name: "customer-1",
			role: "customer",
		},
	],
	readOnly: true,
	realtimeState: {
		isTyping: false,
		isWebSocketConnected: true,
		messages: [],
		typingUserNames: [],
	},
	title: "문의 상세",
	webSocketStatus: "connected",
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const meta = {
	title: "screen/InquiryEditScreen",
	component: InquiryEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof InquiryEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Create: Story = {
	args: createArgs as never,
};

export const ReadOnly: Story = {
	args: readOnlyArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};
