import type { Meta, StoryObj } from "@storybook/react";
import { InquiryDetailScreen } from "./InquiryDetailScreen";

const defaultArgs = {
	assigneeOptions: [
		{ text: "김상담", value: "agent-1" },
		{ text: "이매니저", value: "agent-2" },
	],
	bootstrap: {
		aiSchemas: [],
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
	deleteModalOpen: false,
	editCategoryOptions: [
		{ label: "일반", value: "GENERAL" },
		{ label: "배송", value: "DELIVERY" },
	],
	editPriorityOptions: [
		{ label: "낮음", value: "LOW" },
		{ label: "높음", value: "HIGH" },
	],
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
	isDeleting: false,
	isFillingMeta: false,
	isUpdatingMeta: false,
	metaFormState: {
		category: "GENERAL",
		error: "",
		priority: "LOW",
		title: "배송 상태가 업데이트되지 않습니다",
	},
	onApplyMetaAiPatch: (..._args: never[]) => undefined,
	onChangeAssignee: (..._args: never[]) => undefined,
	onChangeCategory: (..._args: never[]) => undefined,
	onChangeMetaCategorySelection: (..._args: never[]) => undefined,
	onChangeMetaPrioritySelection: (..._args: never[]) => undefined,
	onChangeMetaTitleInput: (..._args: never[]) => undefined,
	onChangePriority: (..._args: never[]) => undefined,
	onChangeStatus: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onClickGenerateDraftButton: (..._args: never[]) => undefined,
	onClickReconnectButton: (..._args: never[]) => undefined,
	onClickSaveMetaButton: (..._args: never[]) => undefined,
	onClickSearchKnowledgeButton: (..._args: never[]) => undefined,
	onCloseDeleteModal: (..._args: never[]) => undefined,
	onConfirmDelete: (..._args: never[]) => undefined,
	onFillMetaAiForm: async (..._args: never[]) => undefined,
	onOpenDeleteModal: (..._args: never[]) => undefined,
	onSendInquiryMessage: (..._args: never[]) => undefined,
	onSendTypingStatus: (..._args: never[]) => undefined,
	onTagAdd: (..._args: never[]) => undefined,
	onTagRemove: (..._args: never[]) => undefined,
	onTypingStart: (..._args: never[]) => undefined,
	onTypingStop: (..._args: never[]) => undefined,
	onlineParticipantNames: ["김상담"],
	participantListItems: [
		{
			id: "participant-customer-1",
			name: "홍길동",
			isOnline: true,
			isTyping: false,
			role: "customer",
		},
		{
			id: "participant-agent-1",
			name: "김상담",
			isOnline: true,
			isTyping: true,
			role: "agent",
		},
	],
	realtimeState: {
		isGeneratingDraft: false,
		isTyping: true,
		isWebSocketConnected: true,
		messages: [
			{
				content: "안녕하세요. 배송 상태를 확인하고 있습니다.",
				contentType: "TEXT",
				createdAt: "2026-04-14T09:10:00.000Z",
				deliveredAt: "2026-04-14T09:10:10.000Z",
				editedAt: null,
				id: "message-1",
				inquiryId: "inquiry-1",
				isDeleted: false,
				isEdited: false,
				readAt: "2026-04-14T09:11:00.000Z",
				senderId: "agent-1",
				senderType: "USER",
				threadId: "thread-1",
			},
			{
				content: "네, 아직 운송장 정보가 보이지 않아요.",
				contentType: "TEXT",
				createdAt: "2026-04-14T09:12:00.000Z",
				deliveredAt: "2026-04-14T09:12:03.000Z",
				editedAt: null,
				id: "message-2",
				inquiryId: "inquiry-1",
				isDeleted: false,
				isEdited: false,
				readAt: "2026-04-14T09:12:30.000Z",
				senderId: "customer-1",
				senderType: "CUSTOMER",
				threadId: "thread-1",
			},
		],
		typingUserNames: ["김상담"],
	},
	webSocketStatus: "connected",
};

const busyArgs = {
	...defaultArgs,
	isDeleting: true,
	isUpdatingMeta: true,
};

const emptyStateArgs = {
	...defaultArgs,
	assigneeOptions: [],
	editCategoryOptions: [],
	editPriorityOptions: [],
	onlineParticipantNames: [],
	participantListItems: [],
	realtimeState: {
		...defaultArgs.realtimeState,
		isTyping: false,
		messages: [],
		typingUserNames: [],
	},
};

const meta = {
	title: "screen/InquiryDetailScreen",
	component: InquiryDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof InquiryDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
