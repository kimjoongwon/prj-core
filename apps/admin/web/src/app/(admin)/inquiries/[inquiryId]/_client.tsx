"use client";

import {
	type InquiryCategory,
	type InquiryPriority,
	type InquiryMessageDto,
	type InquiryParticipantDto,
	useDeleteInquiry,
	useFillInquiryFormWithAi,
	useGetInquiryById,
	useGetInquiryMessages,
	useGetInquiryParticipants,
	useGetInquiryUpdateForm,
	useUpdateInquiry,
} from "@cocrepo/api";
import type { InquiryMessage, InquiryParticipant } from "@cocrepo/type";
import {
	AiForm,
	Button,
	ConfirmModal,
	CustomerInfoCard,
	HStack,
	InquiryInfoCard,
	InquiryMetaPanel,
	InquiryWebSocketProvider,
	PageSurface,
	ParticipantList,
	RealtimeChatPanel,
	SectionSurface,
	SLATracker,
	VStack,
} from "@cocrepo/ui";
import { Input, Select, SelectItem, type Selection } from "@heroui/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHandlers } from "./hooks/useHandlers";
import { useInquiryWebSocket } from "./hooks/useInquiryWebSocket";

const statusOptions = [
	{ value: "NEW", text: "신규" },
	{ value: "OPEN", text: "열림" },
	{ value: "IN_PROGRESS", text: "진행중" },
	{ value: "WAITING_CUSTOMER", text: "고객대기" },
	{ value: "RESOLVED", text: "해결" },
	{ value: "CLOSED", text: "종료" },
	{ value: "ESCALATED", text: "에스컬레이션" },
];

const priorityOptions = [
	{ value: "URGENT", text: "긴급" },
	{ value: "HIGH", text: "높음" },
	{ value: "NORMAL", text: "보통" },
	{ value: "LOW", text: "낮음" },
];

const categoryOptions = [
	{ value: "GENERAL", text: "일반" },
	{ value: "DELIVERY", text: "배송" },
	{ value: "PAYMENT", text: "결제" },
	{ value: "REFUND", text: "환불" },
	{ value: "PRODUCT", text: "상품" },
	{ value: "ACCOUNT", text: "계정" },
	{ value: "TECHNICAL", text: "기술" },
	{ value: "COMPLAINT", text: "불만" },
	{ value: "OTHER", text: "기타" },
];

interface Props {
	inquiryId: string;
}

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

const toMinutes = (start: string, end: string) => {
	return Math.max(
		0,
		Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000),
	);
};

const CHANNEL_LABELS: Record<string, string> = {
	WEB: "웹",
	EMAIL: "이메일",
	CHAT: "채팅",
	SMS: "SMS",
	PHONE: "전화",
	WALK_IN: "방문",
};

const getSelectedValue = (keys: Selection): string => {
	if (keys === "all") {
		return "";
	}
	const selectedKey = keys.values().next().value;
	return selectedKey ? String(selectedKey) : "";
};

function InquiryDetailPageClient({ inquiryId }: Props) {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		deleteModalOpen: false,
	}));

	const inquiryState = useLocalObservable(() => ({
		currentInquiryId: null as string | null,
		currentThreadId: null as string | null,
		replyContent: "",
		isGeneratingDraft: false,
		isKnowledgeBaseModalOpen: false,
		isMetaEditModalOpen: false,
		messages: [] as InquiryMessage[],
		participants: [] as InquiryParticipant[],
		isWebSocketConnected: false,
		isTyping: false,
		typingUsers: observable.map<string, boolean>(),
		get onlineParticipants() {
			return this.participants.filter((participant) => participant.isOnline);
		},
		get typingUserNames() {
			return Array.from(this.typingUsers.keys());
		},
		setCurrentInquiry(inquiryId: string | null) {
			this.currentInquiryId = inquiryId;
		},
		setMessages(messages: InquiryMessage[]) {
			this.messages = messages;
		},
		addMessage(message: InquiryMessage) {
			this.messages.push(message);
		},
		updateMessage(messageId: string, updates: Partial<InquiryMessage>) {
			const index = this.messages.findIndex((message) => message.id === messageId);
			if (index < 0) {
				return;
			}
			this.messages[index] = { ...this.messages[index], ...updates };
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
			if (index < 0) {
				return;
			}
			this.participants[index] = { ...this.participants[index], ...updates };
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
		setGeneratingDraft(isGenerating: boolean) {
			this.isGeneratingDraft = isGenerating;
		},
		openKnowledgeBaseModal() {
			this.isKnowledgeBaseModalOpen = true;
		},
		closeKnowledgeBaseModal() {
			this.isKnowledgeBaseModalOpen = false;
		},
		openMetaEditModal() {
			this.isMetaEditModalOpen = true;
		},
		closeMetaEditModal() {
			this.isMetaEditModalOpen = false;
		},
		clear() {
			this.currentInquiryId = null;
			this.currentThreadId = null;
			this.replyContent = "";
			this.isGeneratingDraft = false;
			this.isKnowledgeBaseModalOpen = false;
			this.isMetaEditModalOpen = false;
			this.messages = [];
			this.participants = [];
			this.isWebSocketConnected = false;
			this.isTyping = false;
			this.typingUsers.clear();
		},
	}));

	const { data: inquiryResponse } = useGetInquiryById(inquiryId);
	const { data: messagesResponse } = useGetInquiryMessages(inquiryId);
	const { data: participantsResponse } = useGetInquiryParticipants(inquiryId);
	const { data: updateFormBootstrapResponse } = useGetInquiryUpdateForm(inquiryId);
	const deleteInquiryMutation = useDeleteInquiry();
	const fillMetaMutation = useFillInquiryFormWithAi();
	const updateMetaMutation = useUpdateInquiry();

	const inquiry = inquiryResponse?.data;
	const updateFormBootstrap = updateFormBootstrapResponse?.data;
	const editCategoryOptions = (updateFormBootstrap?.options.category ?? []).map(
		(item) => ({
			value: String(item.value ?? ""),
			label: item.label,
		}),
	);
	const editPriorityOptions = (updateFormBootstrap?.options.priority ?? []).map(
		(item) => ({
			value: String(item.value ?? ""),
			label: item.label,
		}),
	);
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
	const metaState = useLocalObservable(() => ({
		initialized: false,
		title: "",
		category: "GENERAL" as InquiryCategory,
		priority: "NORMAL" as InquiryPriority,
		error: "",
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
		toFormObject() {
			return {
				title: this.title,
				category: this.category,
				priority: this.priority,
			} satisfies Record<string, unknown>;
		},
		applyPatch(patches: Array<{ path: string; value: unknown }>) {
			for (const patch of patches) {
				switch (patch.path) {
					case "title":
						if (typeof patch.value === "string") this.title = patch.value;
						break;
					case "category":
						if (typeof patch.value === "string")
							this.category = patch.value as InquiryCategory;
						break;
					case "priority":
						if (typeof patch.value === "string")
							this.priority = patch.value as InquiryPriority;
						break;
					default:
						break;
				}
			}
		},
	}));

	const ws = useInquiryWebSocket({
		inquiryId,
		state: inquiryState,
		autoConnect: true,
		onConnect: () => {
			console.log("WebSocket 연결됨");
		},
		onDisconnect: () => {
			console.log("WebSocket 연결 해제됨");
		},
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

	const handlers = useHandlers({
		inquiryId,
		inquiryState,
		ws,
	});

	const handleReconnect = () => {
		ws.reconnect();
	};

	const handleSendMessage = (content: string, attachments?: File[]) => {
		ws.sendMessage(content, attachments);
	};

	const onlineParticipantNames = inquiryState.onlineParticipants.map(
		(participant) => participant.userId,
	);

	const assigneeOptions = participants
		.filter((participant) => participant.role === "AGENT")
		.map((participant) => ({
			value: participant.userId,
			text: participant.userId,
		}));

	const createdAt = inquiry?.createdAt ?? new Date().toISOString();
	const firstResponseEnd = inquiry?.firstResponseAt ?? new Date().toISOString();
	const resolutionEnd = inquiry?.resolvedAt ?? new Date().toISOString();
	const firstResponseTargetMinutes = inquiry?.slaResponseDue
		? toMinutes(createdAt, inquiry.slaResponseDue)
		: 60;
	const resolutionTargetMinutes = inquiry?.slaResolveDue
		? toMinutes(createdAt, inquiry.slaResolveDue)
		: 240;

	const sentimentType =
		inquiry?.sentiment?.sentiment === "POSITIVE"
			? "positive"
			: inquiry?.sentiment?.sentiment === "NEGATIVE"
				? "negative"
				: "neutral";

	const participantListItems: Array<{
		id: string;
		name: string;
		role: "customer" | "agent" | "supervisor";
		isOnline: boolean;
		isTyping: boolean;
	}> = participants.map((participant) => ({
		id: participant.id,
		name: participant.userId,
		role:
			participant.role === "CUSTOMER"
				? "customer"
				: participant.role === "SUPERVISOR"
					? "supervisor"
					: "agent",
		isOnline: participant.isOnline,
		isTyping: participant.isTyping,
	}));
	const onSubmitMeta = async () => {
		if (!metaState.title.trim()) {
			metaState.error = "문의 제목을 입력해주세요.";
			return;
		}
		metaState.error = "";
		await updateMetaMutation.mutateAsync({
			inquiryId,
			data: {
				title: metaState.title.trim(),
				category: metaState.category,
				priority: metaState.priority,
			},
		});
	};

	return (
		<InquiryWebSocketProvider
			inquiryId={inquiryId}
			status={ws.status}
			onReconnect={handleReconnect}
			sendMessage={ws.sendMessage}
			sendTypingStatus={ws.sendTypingStatus}
		>
			<PageSurface
				title="문의 상세"
				description="문의 상세 정보를 확인하고 답변을 작성합니다."
				actions={
					<HStack gap={2}>
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={handlers.onClickBack}
						>
							목록으로
						</Button>
						<Button
							variant="flat"
							color="primary"
							startContent={<Pencil className="h-4 w-4" />}
							onPress={handlers.onClickEdit}
						>
							수정
						</Button>
						<Button
							variant="flat"
							color="danger"
							startContent={<Trash2 className="h-4 w-4" />}
							onPress={() => {
								state.deleteModalOpen = true;
							}}
						>
							삭제
						</Button>
					</HStack>
				}
			>
				<VStack gap={6}>
						<HStack gap={4} className="lg:flex-row flex-col">
						<div className="lg:w-2/3 w-full">
							<InquiryInfoCard
								inquiryNumber={inquiry?.inquiryNumber ?? inquiryId}
								title={inquiry?.title ?? "문의 정보 로딩 중"}
								channel={
									CHANNEL_LABELS[inquiry?.channel ?? ""] ??
									inquiry?.channel ??
									"-"
								}
								createdAt={createdAt}
								sentiment={{
									type: sentimentType,
									label: inquiry?.sentiment?.sentiment ?? "NEUTRAL",
									confidence: Math.round(
										(inquiry?.sentiment?.confidence ?? 0.7) * 100,
									),
								}}
								onlineParticipants={onlineParticipantNames}
							/>
						</div>
						<div className="lg:w-1/3 w-full">
							<InquiryMetaPanel
								status={inquiry?.status ?? "NEW"}
								statusOptions={statusOptions}
								onStatusChange={handlers.onChangeStatus}
								priority={inquiry?.priority ?? "NORMAL"}
								priorityOptions={priorityOptions}
								onPriorityChange={handlers.onChangePriority}
								category={inquiry?.category ?? "GENERAL"}
								categoryOptions={categoryOptions}
								onCategoryChange={handlers.onChangeCategory}
								assigneeId={inquiry?.assigneeId}
								assigneeName={inquiry?.assigneeId}
								assigneeOptions={assigneeOptions}
								onAssigneeChange={handlers.onChangeAssignee}
								tags={[]}
								onTagAdd={handlers.onTagAdd}
								onTagRemove={handlers.onTagRemove}
							/>
						</div>
					</HStack>

					<HStack gap={4} className="lg:flex-row flex-col">
						<div className="lg:w-1/2 w-full">
							<CustomerInfoCard
								name={inquiry?.customerId ?? "고객"}
								email=""
								phone=""
								joinedAt={undefined}
								inquiryCount={undefined}
							/>
						</div>
						<div className="lg:w-1/2 w-full">
							<ParticipantList
								participants={participantListItems.map((participant) => ({
									...participant,
									isTyping:
										inquiryState.typingUsers.has(participant.name) ||
										participant.isTyping,
								}))}
							/>
						</div>
						</HStack>

						{updateFormBootstrap && (
							<>
								<AiForm
									formState={metaState.toFormObject()}
									fieldMeta={updateFormBootstrap.fieldMeta}
									aiSchemas={updateFormBootstrap.aiSchemas}
									ui={updateFormBootstrap.ui}
									options={updateFormBootstrap.options}
									onFill={async (input) => {
										const result = await fillMetaMutation.mutateAsync({
											data: {
												mode: "UPDATE",
												schemaKey: input.schemaKey,
												selectedPaths: input.selectedPaths,
												currentObject: input.currentObject,
												userPrompt: input.userPrompt,
											},
										});
										return result?.data ?? { patches: [] };
									}}
									applyPatch={(patches) => {
										metaState.applyPatch(patches);
									}}
									disabled={
										updateMetaMutation.isPending || fillMetaMutation.isPending
									}
								/>

								<SectionSurface>
									<VStack gap={4}>
									<Input
										label="문의 제목"
										labelPlacement="outside"
										value={metaState.title}
										onValueChange={(value) => {
											metaState.title = value;
										}}
										isInvalid={Boolean(metaState.error)}
										errorMessage={metaState.error}
									/>
									<HStack gap={4} className="md:flex-row flex-col">
										<Select
											label="카테고리"
											placeholder="카테고리 선택"
											selectedKeys={metaState.category ? [metaState.category] : []}
											onSelectionChange={(keys) => {
												const selectedValue = getSelectedValue(keys);
												if (selectedValue) {
													metaState.category = selectedValue as InquiryCategory;
												}
											}}
										>
											{editCategoryOptions.map((option) => (
												<SelectItem key={option.value}>{option.label}</SelectItem>
											))}
										</Select>
										<Select
											label="우선순위"
											placeholder="우선순위 선택"
											selectedKeys={metaState.priority ? [metaState.priority] : []}
											onSelectionChange={(keys) => {
												const selectedValue = getSelectedValue(keys);
												if (selectedValue) {
													metaState.priority = selectedValue as InquiryPriority;
												}
											}}
										>
											{editPriorityOptions.map((option) => (
												<SelectItem key={option.value}>{option.label}</SelectItem>
											))}
										</Select>
									</HStack>
									<div className="flex justify-end">
										<Button
											color="primary"
											onPress={onSubmitMeta}
											isLoading={updateMetaMutation.isPending}
										>
											메타 저장
										</Button>
									</div>
									</VStack>
								</SectionSurface>
							</>
						)}

						<SectionSurface>
						<RealtimeChatPanel
							inquiryId={inquiryId}
							messages={
								inquiryState.messages.length > 0
									? inquiryState.messages
									: messages
							}
							typingUserNames={inquiryState.typingUserNames}
							isWebSocketConnected={inquiryState.isWebSocketConnected}
							isTyping={inquiryState.isTyping}
							onSendMessage={handleSendMessage}
							onTypingStart={handlers.onTypingStart}
							onTypingStop={handlers.onTypingStop}
							onReconnect={handleReconnect}
							onGenerateDraft={handlers.onClickGenerateDraft}
							onSearchKnowledge={handlers.onClickSearchKnowledge}
							isGeneratingDraft={inquiryState.isGeneratingDraft}
						/>
					</SectionSurface>

					<SLATracker
						firstResponse={{
							label: "첫 응답",
							elapsedMinutes: toMinutes(createdAt, firstResponseEnd),
							targetMinutes: firstResponseTargetMinutes,
							isCompleted: Boolean(inquiry?.firstResponseAt),
							isBreached: Boolean(inquiry?.isSlaResponseBreached),
						}}
						resolution={{
							label: "해결",
							elapsedMinutes: toMinutes(createdAt, resolutionEnd),
							targetMinutes: resolutionTargetMinutes,
							isCompleted: Boolean(inquiry?.resolvedAt),
							isBreached: Boolean(inquiry?.isSlaResolveBreached),
						}}
					/>
				</VStack>

				<ConfirmModal
					isOpen={state.deleteModalOpen}
					onClose={() => {
						state.deleteModalOpen = false;
					}}
					onConfirm={async () => {
						await deleteInquiryMutation.mutateAsync({ inquiryId });
						state.deleteModalOpen = false;
						router.push("/inquiries" as Route);
					}}
					title="문의 삭제"
					message={
						<span>
							<strong>{inquiry?.inquiryNumber ?? inquiryId}</strong> 문의를
							삭제하시겠습니까?
							<br />
							삭제된 문의는 복구할 수 없습니다.
						</span>
					}
					confirmText="삭제"
					confirmColor="danger"
					iconType="delete"
				/>
			</PageSurface>
		</InquiryWebSocketProvider>
	);
}

export default observer(InquiryDetailPageClient);
