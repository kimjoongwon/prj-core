import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { InquiryDetailPage } from "./InquiryDetailPage";

const defaultArgs = {
  "assigneeOptions": [{
  "text": "text-1",
  "value": "value-1",
}, {
  "text": "text-1",
  "value": "value-1",
}],
  "bootstrap": {
  "aiSchemas": [],
  "fieldMeta": {},
  "options": {},
  "ui": {"readOnlyPaths": [], "hiddenPaths": [], "disabledPaths": []},
},
  "deleteModalOpen": false,
  "editCategoryOptions": [{
  "label": "샘플 label 1",
  "value": "value-1",
}, {
  "label": "샘플 label 1",
  "value": "value-1",
}],
  "editPriorityOptions": [{
  "label": "샘플 label 1",
  "value": "value-1",
}, {
  "label": "샘플 label 1",
  "value": "value-1",
}],
  "inquiry": {
  "assigneeId": "assignee-1",
  "category": "샘플 category 1",
  "channel": "channel-1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "customerId": "customer-1",
  "firstResponseAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "inquiryNumber": "inquiry-number-1",
  "isSlaResolveBreached": false,
  "isSlaResponseBreached": false,
  "priority": "priority-1",
  "resolvedAt": "2026-04-14T09:00:00.000Z",
  "sentiment": {
  "confidence": createStorybookMock("confidence") as never,
  "sentiment": createStorybookMock("sentiment") as never,
},
  "slaResolveDue": "sla-resolve-due-1",
  "slaResponseDue": "sla-response-due-1",
  "status": "샘플 status 1",
  "title": "샘플 title",
},
  "inquiryId": "inquiry-1",
  "isDeleting": false,
  "isFillingMeta": false,
  "isUpdatingMeta": false,
  "metaFormState": {
  "category": "GENERAL",
  "error": "error-1",
  "priority": "LOW",
  "title": "샘플 title",
},
  "onApplyMetaAiPatch": (..._args: never[]) => undefined,
  "onChangeAssignee": (..._args: never[]) => undefined,
  "onChangeCategory": (..._args: never[]) => undefined,
  "onChangeMetaCategorySelection": (..._args: never[]) => undefined,
  "onChangeMetaPrioritySelection": (..._args: never[]) => undefined,
  "onChangeMetaTitleInput": (..._args: never[]) => undefined,
  "onChangePriority": (..._args: never[]) => undefined,
  "onChangeStatus": (..._args: never[]) => undefined,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onClickGenerateDraftButton": (..._args: never[]) => undefined,
  "onClickReconnectButton": (..._args: never[]) => undefined,
  "onClickSaveMetaButton": (..._args: never[]) => undefined,
  "onClickSearchKnowledgeButton": (..._args: never[]) => undefined,
  "onCloseDeleteModal": (..._args: never[]) => undefined,
  "onConfirmDelete": (..._args: never[]) => undefined,
  "onFillMetaAiForm": async (..._args: never[]) => undefined,
  "onlineParticipantNames": ["샘플 online participant name 1", "샘플 online participant name 1"],
  "onOpenDeleteModal": (..._args: never[]) => undefined,
  "onSendInquiryMessage": (..._args: never[]) => undefined,
  "onSendTypingStatus": (..._args: never[]) => undefined,
  "onTagAdd": (..._args: never[]) => undefined,
  "onTagRemove": (..._args: never[]) => undefined,
  "onTypingStart": (..._args: never[]) => undefined,
  "onTypingStop": (..._args: never[]) => undefined,
  "participantListItems": [{
  "id": "item-1",
  "isOnline": false,
  "isTyping": false,
  "role": "customer",
}, {
  "id": "item-1",
  "isOnline": false,
  "isTyping": false,
  "role": "customer",
}],
  "realtimeState": {
  "isGeneratingDraft": false,
  "isTyping": false,
  "isWebSocketConnected": false,
  "messages": [{
  "content": "스토리북에서 확인할 content 예시입니다.",
  "contentType": "스토리북에서 확인할 content type 예시입니다.",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "deliveredAt": "2026-04-14T09:00:00.000Z",
  "editedAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "inquiryId": "inquiry-1",
  "isDeleted": false,
  "isEdited": false,
  "readAt": "2026-04-14T09:00:00.000Z",
  "senderId": "sender-1",
  "senderType": "USER",
  "threadId": "thread-1",
}, {
  "content": "스토리북에서 확인할 content 예시입니다.",
  "contentType": "스토리북에서 확인할 content type 예시입니다.",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "deliveredAt": "2026-04-14T09:00:00.000Z",
  "editedAt": "2026-04-14T09:00:00.000Z",
  "id": "item-1",
  "inquiryId": "inquiry-1",
  "isDeleted": false,
  "isEdited": false,
  "readAt": "2026-04-14T09:00:00.000Z",
  "senderId": "sender-1",
  "senderType": "USER",
  "threadId": "thread-1",
}],
  "typingUserNames": ["샘플 typing user name 1", "샘플 typing user name 1"],
},
  "webSocketStatus": "connected",
};

const busyArgs = {
  ...defaultArgs,
  "isDeleting": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "assigneeOptions": [],
  "editCategoryOptions": [],
  "editPriorityOptions": [],
  "onlineParticipantNames": [],
  "participantListItems": [],
};

const meta = {
  component: InquiryDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof InquiryDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
