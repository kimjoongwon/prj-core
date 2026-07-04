"use client";

import {
	type InquiryCategory,
	type InquiryChannel,
	type InquiryMessageDto,
	type InquiryParticipantDto,
	type InquiryPriority,
	useAssignInquiry,
	useDeleteInquiry,
	useGetInquiryById,
	useGetInquiryMessages,
	useGetInquiryParticipants,
	useGetUpdateInquiryForm,
	useUpdateInquiry,
	useUpdateInquiryPriority,
	useUpdateInquiryStatus,
} from "@cocrepo/api/core/inquiries";
import { ADMIN_PATHS } from "@cocrepo/constant";
import { useInquiryDetailWebSocket } from "@cocrepo/hook";
import type {
	FormOptionItem,
	InquiryMessage,
	InquiryParticipant,
} from "@cocrepo/type";
import {
	InquiryEditScreen,
	type InquiryEditScreenMetaFormState,
} from "@cocrepo/ui";
import { observable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const normalizeFormOptionValue = (
	value: unknown,
): FormOptionItem["value"] => {
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}

	return null;
};

const normalizeFormOptions = (
	options?: Record<string, Array<{ value: unknown; label: string }>>,
): Record<string, FormOptionItem[]> => {
	return Object.fromEntries(
		Object.entries(options ?? {}).map(([path, items]) => [
			path,
			items.map((item) => ({
				value: normalizeFormOptionValue(item.value),
				label: item.label,
			})),
		]),
	);
};

const mapMessageToStore = (message: InquiryMessageDto): InquiryMessage => {
	return {
		id: message.id,
		threadId: message.threadId,
		inquiryId: message.inquiryId,
		senderType: message.senderType,
		senderId: message.senderName || message.senderId || null,
		content: message.content,
		contentType: message.contentType,
		isEdited: message.isEdited,
		isDeleted: message.isDeleted,
		deliveredAt: message.deliveredAt,
		readAt: message.readAt,
		editedAt: message.editedAt,
		createdAt: message.createdAt,
	};
};

const mapParticipantToStore = (
	participant: InquiryParticipantDto | Record<string, unknown>,
	inquiryId: string,
): InquiryParticipant => {
	const data = participant as Record<string, unknown>;
	return {
		id: (data.id as string) ?? crypto.randomUUID(),
		inquiryId,
		threadId: (data.threadId as string | null) ?? null,
		userId: (data.userId as string) ?? "unknown-user",
		role: ((data.role as string) ?? "AGENT") as
			| "CUSTOMER"
			| "AGENT"
			| "SUPERVISOR",
		isOnline: Boolean(data.isOnline),
		isTyping: Boolean(data.isTyping),
		unreadCount: Number(data.unreadCount ?? 0),
		joinedAt: (data.joinedAt as string) ?? new Date().toISOString(),
		lastSeenAt: (data.lastSeenAt as string | null) ?? null,
		lastReadAt: (data.lastReadAt as string | null) ?? null,
		leftAt: (data.leftAt as string | null) ?? null,
	};
};

export default observer(function InquiryReadOnlyRoute() {
	const inquiryId = useParams<{ inquiryId: string }>().inquiryId;
	const router = useRouter();
	const deleteModalState = useStateLike(false);
	const inquiryState = useLocalObservable(() => ({
		currentInquiryId: null as string | null,
		currentThreadId: null as string | null,
		replyContent: "",
		isKnowledgeBaseModalOpen: false,
		isMetaEditModalOpen: false,
		messages: [] as InquiryMessage[],
		participants: [] as InquiryParticipant[],
		isWebSocketConnected: false,
		isTyping: false,
		typingUsers: observable.map<string, boolean>(),
		setCurrentInquiry(id: string | null) {
			this.currentInquiryId = id;
		},
		setMessages(messages: InquiryMessage[]) {
			this.messages = messages;
		},
		addMessage(message: InquiryMessage) {
			this.messages.push(message);
		},
		updateMessage(messageId: string, updates: Partial<InquiryMessage>) {
			const index = this.messages.findIndex(
				(message) => message.id === messageId,
			);
			if (index >= 0) {
				this.messages[index] = { ...this.messages[index], ...updates };
			}
		},
		setParticipants(participants: InquiryParticipant[]) {
			this.participants = participants;
		},
		addParticipant(participant: InquiryParticipant) {
			const index = this.participants.findIndex(
				(existing) => existing.userId === participant.userId,
			);
			if (index < 0) {
				this.participants.push(participant);
				return;
			}
			this.participants[index] = participant;
		},
		removeParticipant(userId: string) {
			this.participants = this.participants.filter(
				(participant) => participant.userId !== userId,
			);
			this.typingUsers.delete(userId);
		},
		updateParticipant(userId: string, updates: Partial<InquiryParticipant>) {
			const index = this.participants.findIndex(
				(participant) => participant.userId === userId,
			);
			if (index >= 0) {
				this.participants[index] = { ...this.participants[index], ...updates };
			}
		},
		setTyping(userId: string, isTyping: boolean) {
			if (isTyping) {
				this.typingUsers.set(userId, true);
				return;
			}
			this.typingUsers.delete(userId);
		},
		startTyping() {
			this.isTyping = true;
		},
		stopTyping() {
			this.isTyping = false;
		},
		setWebSocketConnected(isConnected: boolean) {
			this.isWebSocketConnected = isConnected;
		},
		setReplyContent(content: string) {
			this.replyContent = content;
		},
		openKnowledgeBaseModal() {
			this.isKnowledgeBaseModalOpen = true;
		},
		closeKnowledgeBaseModal() {
			this.isKnowledgeBaseModalOpen = false;
		},
		clear() {
			this.currentInquiryId = null;
			this.currentThreadId = null;
			this.replyContent = "";
			this.isKnowledgeBaseModalOpen = false;
			this.isMetaEditModalOpen = false;
			this.messages = [];
			this.participants = [];
			this.isWebSocketConnected = false;
			this.isTyping = false;
			this.typingUsers.clear();
		},
	}));
	const metaState = useLocalObservable<
		InquiryEditScreenMetaFormState & {
			initialized: boolean;
			setFromBootstrap: () => void;
		}
	>(() => ({
		initialized: false,
		customerId: "",
		customerKeyword: "",
		title: "",
		content: "",
		category: "GENERAL" as InquiryCategory,
		channel: "WEB" as InquiryChannel,
		priority: "NORMAL" as InquiryPriority,
		searchResults: [],
		errors: {},
		setFromBootstrap() {
			if (!updateFormBootstrap || this.initialized) {
				return;
			}

			this.title =
				typeof updateFormBootstrap.defaultObject.title === "string"
					? updateFormBootstrap.defaultObject.title
					: (inquiry?.title ?? "");
			this.category =
				typeof updateFormBootstrap.defaultObject.category === "string"
					? (updateFormBootstrap.defaultObject.category as InquiryCategory)
					: ((inquiry?.category ?? "GENERAL") as InquiryCategory);
			this.priority =
				typeof updateFormBootstrap.defaultObject.priority === "string"
					? (updateFormBootstrap.defaultObject.priority as InquiryPriority)
					: ((inquiry?.priority ?? "NORMAL") as InquiryPriority);
			this.initialized = true;
		},
	}));

	const { data: inquiryResponse } = useGetInquiryById(inquiryId);
	const { data: messagesResponse } = useGetInquiryMessages(inquiryId);
	const { data: participantsResponse } = useGetInquiryParticipants(inquiryId);
	const { data: updateFormBootstrapResponse } =
		useGetUpdateInquiryForm(inquiryId);
	const deleteInquiryMutation = useDeleteInquiry();
	const updateStatusMutation = useUpdateInquiryStatus();
	const updatePriorityMutation = useUpdateInquiryPriority();
	const assignMutation = useAssignInquiry();
	const updateInquiryMutation = useUpdateInquiry();

	const inquiry = inquiryResponse?.data;
	const updateFormBootstrap = updateFormBootstrapResponse?.data;
	const updateFormOptions = normalizeFormOptions(updateFormBootstrap?.options);
	const messages = (messagesResponse?.data ?? []).map(mapMessageToStore);
	const participantRows =
		(participantsResponse?.data as
			| Array<Record<string, unknown>>
			| undefined) ??
		(inquiry?.participants as Array<Record<string, unknown>> | undefined) ??
		[];
	const participants = participantRows.map((participant) =>
		mapParticipantToStore(participant, inquiryId),
	);

	const ws = useInquiryDetailWebSocket({
		inquiryId,
		state: inquiryState,
		autoConnect: true,
	});

	useEffect(() => {
		inquiryState.setCurrentInquiry(inquiryId);
		inquiryState.setMessages(messages);
		inquiryState.setParticipants(participants);

		return () => {
			inquiryState.clear();
		};
	}, [inquiryId, messages, participants, inquiryState]);

	useEffect(() => {
		metaState.setFromBootstrap();
	}, [metaState, inquiry, updateFormBootstrap]);

	const participantListItems = inquiryState.participants.map((participant) => {
		const role: "customer" | "agent" | "supervisor" =
			participant.role === "CUSTOMER"
				? "customer"
				: participant.role === "SUPERVISOR"
					? "supervisor"
					: "agent";

		return {
			id: participant.id,
			name: participant.userId,
			role,
			isOnline: participant.isOnline,
			isTyping:
				inquiryState.typingUsers.has(participant.userId) ||
				participant.isTyping,
		};
	});

	const assigneeOptions = inquiryState.participants
		.filter((participant) => participant.role === "AGENT")
		.map((participant) => ({
			value: participant.userId,
			text: participant.userId,
		}));

	return (
		<>
			<InquiryEditScreen
				readOnly
				inquiryId={inquiryId}
				inquiry={
					inquiry
						? {
								id: inquiry.id,
								inquiryNumber: inquiry.inquiryNumber,
								title: inquiry.title,
								channel: inquiry.channel,
								status: inquiry.status,
								priority: inquiry.priority,
								category: inquiry.category,
								assigneeId: inquiry.assigneeId,
								customerId: inquiry.customerId,
								createdAt: inquiry.createdAt,
								firstResponseAt: inquiry.firstResponseAt,
								resolvedAt: inquiry.resolvedAt,
								slaResponseDue: inquiry.slaResponseDue,
								slaResolveDue: inquiry.slaResolveDue,
								isSlaResponseBreached: inquiry.isSlaResponseBreached,
								isSlaResolveBreached: inquiry.isSlaResolveBreached,
								sentiment: inquiry.sentiment
									? {
											sentiment: inquiry.sentiment.sentiment,
											confidence: inquiry.sentiment.confidence,
										}
									: null,
							}
						: undefined
				}
				bootstrap={
					updateFormBootstrap
						? {
								fieldMeta: updateFormBootstrap.fieldMeta,
								ui: updateFormBootstrap.ui,
								options: updateFormOptions,
							}
						: undefined
				}
				metaFormState={metaState}
				categoryOptions={(updateFormOptions.category ?? []).map((item) => ({
					value: String(item.value ?? ""),
					label: item.label,
				}))}
				priorityOptions={(updateFormOptions.priority ?? []).map((item) => ({
					value: String(item.value ?? ""),
					label: item.label,
				}))}
				realtimeState={{
					messages:
						inquiryState.messages.length > 0 ? inquiryState.messages : messages,
					typingUserNames: Array.from(inquiryState.typingUsers.keys()),
					isWebSocketConnected: inquiryState.isWebSocketConnected,
					isTyping: inquiryState.isTyping,
				}}
				participantListItems={participantListItems}
				onlineParticipantNames={inquiryState.participants
					.filter((participant) => participant.isOnline)
					.map((participant) => participant.userId)}
				assigneeOptions={assigneeOptions}
				deleteModalOpen={deleteModalState.value}
				isDeleting={deleteInquiryMutation.isPending}
				isUpdatingMeta={updateInquiryMutation.isPending}
				webSocketStatus={ws.status}
				onClickBackButton={() => {
					router.push(ADMIN_PATHS.INQUIRIES as Route);
				}}
				onClickEditButton={() => {
					router.push(
						ADMIN_PATHS.INQUIRIES_EDIT.replace(
							"[inquiryId]",
							inquiryId,
						) as Route,
					);
				}}
				onOpenDeleteModal={() => {
					deleteModalState.value = true;
				}}
				onCloseDeleteModal={() => {
					deleteModalState.value = false;
				}}
				onConfirmDelete={() => {
					void (async () => {
						await deleteInquiryMutation.mutateAsync({ inquiryId });
						deleteModalState.value = false;
						router.push(ADMIN_PATHS.INQUIRIES as Route);
					})();
				}}
				onChangeStatus={(status) => {
					void updateStatusMutation.mutateAsync({
						inquiryId,
						data: {
							status: status as
								| "NEW"
								| "OPEN"
								| "IN_PROGRESS"
								| "WAITING_CUSTOMER"
								| "RESOLVED"
								| "CLOSED"
								| "ESCALATED",
						},
					});
				}}
				onChangePriority={(priority) => {
					void updatePriorityMutation.mutateAsync({
						inquiryId,
						data: {
							priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT",
						},
					});
				}}
				onChangeCategory={(category) => {
					void updateInquiryMutation.mutateAsync({
						inquiryId,
						data: {
							category: category as
								| "GENERAL"
								| "DELIVERY"
								| "PAYMENT"
								| "REFUND"
								| "PRODUCT"
								| "ACCOUNT"
								| "TECHNICAL"
								| "COMPLAINT"
								| "OTHER",
						},
					});
				}}
				onChangeAssignee={(assigneeId) => {
					void assignMutation.mutateAsync({
						inquiryId,
						data: { assigneeId },
					});
				}}
				onTagAdd={(_tag) => {}}
				onTagRemove={(_tag) => {}}
				onClickReconnectButton={() => {
					ws.reconnect();
				}}
				onSendInquiryMessage={(content, attachments) => {
					ws.sendMessage(content, attachments);
				}}
				onSendTypingStatus={(isTyping) => {
					ws.sendTypingStatus(isTyping);
				}}
				onTypingStart={() => {
					inquiryState.startTyping();
					ws.sendTypingStatus(true);
				}}
				onTypingStop={() => {
					inquiryState.stopTyping();
					ws.sendTypingStatus(false);
				}}
				onClickSearchKnowledgeButton={() => {
					inquiryState.openKnowledgeBaseModal();
				}}
			/>
		</>
	);
});

function useStateLike<T>(initialValue: T) {
	return useLocalObservable(() => ({
		value: initialValue,
	}));
}
