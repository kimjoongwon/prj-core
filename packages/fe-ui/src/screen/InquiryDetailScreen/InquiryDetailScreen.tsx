"use client";

import type {
	InquiryCategory,
	InquiryPriority,
} from "@cocrepo/api/core/inquiries";
import type {
	AiFormFieldMeta,
	AiFormFillRequest,
	AiFormFillResponse,
	AiFormOptionItem,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
	InquiryMessage,
} from "@cocrepo/type";
import {
	SectionSurface,
	AiForm,
	Button,
	ConfirmModal,
	CustomerInfoCard,
	HStack,
	InquiryInfoCard,
	InquiryMetaPanel,
	InquiryWebSocketProvider,
	PageTitleBar,
	ParticipantList,
	RealtimeChatPanel,
	SLATracker,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Input } from "../../input/Input/Input";
import { Select } from "../../selection/Select/Select";
import { ListBox } from "@heroui/react";
import type { WebSocketStatus } from "@cocrepo/hook";
const toMinutes = (start: string, end: string) => {
	return Math.max(
		0,
		Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000),
	);
};
export interface InquiryDetailScreenInquiry {
	id: string;
	inquiryNumber: string;
	title: string;
	channel: string;
	status: string;
	priority: string;
	category: string;
	assigneeId?: string | null;
	customerId?: string | null;
	createdAt: string;
	firstResponseAt?: string | null;
	resolvedAt?: string | null;
	slaResponseDue?: string | null;
	slaResolveDue?: string | null;
	isSlaResponseBreached?: boolean | null;
	isSlaResolveBreached?: boolean | null;
	sentiment?: {
		sentiment?: string | null;
		confidence?: number | null;
	} | null;
}
export interface InquiryDetailScreenBootstrap {
	fieldMeta: Record<string, AiFormFieldMeta>;
	aiSchemas: AiFormSchema[];
	ui: AiFormUiPaths;
	options: Record<string, AiFormOptionItem[]>;
}
export interface InquiryDetailScreenOption {
	value: string;
	label: string;
}
export interface InquiryDetailScreenMetaFormState {
	title: string;
	category: InquiryCategory;
	priority: InquiryPriority;
	error: string;
}
export interface InquiryDetailScreenParticipantListItem {
	id: string;
	name: string;
	role: "customer" | "agent" | "supervisor";
	isOnline: boolean;
	isTyping: boolean;
}
export interface InquiryDetailScreenAssigneeOption {
	value: string;
	text: string;
}
export interface InquiryDetailScreenRealtimeState {
	messages: InquiryMessage[];
	typingUserNames: string[];
	isWebSocketConnected: boolean;
	isTyping: boolean;
	isGeneratingDraft: boolean;
}
export interface InquiryDetailScreenProps {
	inquiryId: string;
	inquiry?: InquiryDetailScreenInquiry;
	bootstrap?: InquiryDetailScreenBootstrap;
	metaFormState: InquiryDetailScreenMetaFormState;
	editCategoryOptions: InquiryDetailScreenOption[];
	editPriorityOptions: InquiryDetailScreenOption[];
	realtimeState: InquiryDetailScreenRealtimeState;
	participantListItems: InquiryDetailScreenParticipantListItem[];
	onlineParticipantNames: string[];
	assigneeOptions: InquiryDetailScreenAssigneeOption[];
	deleteModalOpen: boolean;
	isDeleting: boolean;
	isUpdatingMeta: boolean;
	isFillingMeta: boolean;
	webSocketStatus: WebSocketStatus;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onConfirmDelete: () => void;
	onChangeStatus: (status: string) => void;
	onChangePriority: (priority: string) => void;
	onChangeCategory: (category: string) => void;
	onChangeAssignee: (assigneeId: string) => void;
	onTagAdd: (tag: string) => void;
	onTagRemove: (tag: string) => void;
	onFillMetaAiForm: (
		input: AiFormFillRequest<Record<string, unknown>>,
	) => Promise<AiFormFillResponse>;
	onApplyMetaAiPatch: (patches: AiFormPatch[]) => void;
	onChangeMetaTitleInput: (value: string) => void;
	onChangeMetaCategorySelection: (value: InquiryCategory) => void;
	onChangeMetaPrioritySelection: (value: InquiryPriority) => void;
	onClickSaveMetaButton: () => void;
	onClickReconnectButton: () => void;
	onSendInquiryMessage: (content: string, attachments?: File[]) => void;
	onSendTypingStatus: (isTyping: boolean) => void;
	onTypingStart: () => void;
	onTypingStop: () => void;
	onClickGenerateDraftButton: () => void;
	onClickSearchKnowledgeButton: () => void;
}
export const InquiryDetailScreen = observer(
	({
		inquiryId,
		inquiry,
		bootstrap,
		metaFormState,
		editCategoryOptions,
		editPriorityOptions,
		realtimeState,
		participantListItems,
		onlineParticipantNames,
		assigneeOptions,
		deleteModalOpen,
		isDeleting,
		isUpdatingMeta,
		isFillingMeta,
		webSocketStatus,
		onClickBackButton,
		onClickEditButton,
		onOpenDeleteModal,
		onCloseDeleteModal,
		onConfirmDelete,
		onChangeStatus,
		onChangePriority,
		onChangeCategory,
		onChangeAssignee,
		onTagAdd,
		onTagRemove,
		onFillMetaAiForm,
		onApplyMetaAiPatch,
		onChangeMetaTitleInput,
		onChangeMetaCategorySelection,
		onChangeMetaPrioritySelection,
		onClickSaveMetaButton,
		onClickReconnectButton,
		onSendInquiryMessage,
		onSendTypingStatus,
		onTypingStart,
		onTypingStop,
		onClickGenerateDraftButton,
		onClickSearchKnowledgeButton,
	}: InquiryDetailScreenProps) => {
		const editCategoryOptionValues = new Set(
			editCategoryOptions.map((option) => option.value),
		);
		const editPriorityOptionValues = new Set(
			editPriorityOptions.map((option) => option.value),
		);
		const createdAt = inquiry?.createdAt ?? new Date().toISOString();
		const firstResponseEnd =
			inquiry?.firstResponseAt ?? new Date().toISOString();
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
		const statusOptions = (bootstrap?.options.status ?? []).map((option) => ({
			value: String(option.value ?? ""),
			text: option.label,
		}));
		const priorityOptions = (bootstrap?.options.priority ?? []).map(
			(option) => ({
				value: String(option.value ?? ""),
				text: option.label,
			}),
		);
		const categoryOptions = (bootstrap?.options.category ?? []).map(
			(option) => ({
				value: String(option.value ?? ""),
				text: option.label,
			}),
		);
		const channelLabel =
			(bootstrap?.options.channel ?? []).find(
				(option) => String(option.value ?? "") === (inquiry?.channel ?? ""),
			)?.label ??
			inquiry?.channel ??
			"-";
		return (
			<InquiryWebSocketProvider
				inquiryId={inquiryId}
				status={webSocketStatus}
				onReconnect={onClickReconnectButton}
				sendMessage={onSendInquiryMessage}
				sendTypingStatus={onSendTypingStatus}
			>
				<VStack gap="section" fullWidth>
					<PageTitleBar
						title="문의 상세"
						description="문의 상세 정보를 확인하고 답변을 작성합니다."
						actions={
							<HStack gap={2}>
								<Button
									variant="light"
									startContent={<ArrowLeft className="h-4 w-4" />}
									onPress={onClickBackButton}
								>
									목록으로
								</Button>
								<Button
									variant="flat"
									color="primary"
									startContent={<Pencil className="h-4 w-4" />}
									onPress={onClickEditButton}
								>
									수정
								</Button>
								<Button
									variant="flat"
									color="danger"
									startContent={<Trash2 className="h-4 w-4" />}
									onPress={onOpenDeleteModal}
								>
									삭제
								</Button>
							</HStack>
						}
					/>

					<SectionSurface>
						<VStack gap={4}>
							<SectionSurface>
								<HStack gap={4} className="flex-col lg:flex-row">
									<div className="w-full lg:w-2/3">
										<InquiryInfoCard
											inquiryNumber={inquiry?.inquiryNumber ?? inquiryId}
											title={inquiry?.title ?? "문의 정보 로딩 중"}
											channel={channelLabel}
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
									<div className="w-full lg:w-1/3">
										<InquiryMetaPanel
											status={inquiry?.status ?? "NEW"}
											statusOptions={statusOptions}
											onStatusChange={onChangeStatus}
											priority={inquiry?.priority ?? "NORMAL"}
											priorityOptions={priorityOptions}
											onPriorityChange={onChangePriority}
											category={inquiry?.category ?? "GENERAL"}
											categoryOptions={categoryOptions}
											onCategoryChange={onChangeCategory}
											assigneeId={inquiry?.assigneeId ?? undefined}
											assigneeName={inquiry?.assigneeId ?? undefined}
											assigneeOptions={assigneeOptions}
											onAssigneeChange={onChangeAssignee}
											tags={[]}
											onTagAdd={onTagAdd}
											onTagRemove={onTagRemove}
										/>
									</div>
								</HStack>
							</SectionSurface>
							<SectionSurface>
								<HStack gap={4} className="flex-col lg:flex-row">
									<div className="w-full lg:w-1/2">
										<CustomerInfoCard
											name={inquiry?.customerId ?? "고객"}
											email=""
											phone=""
											joinedAt={undefined}
											inquiryCount={undefined}
										/>
									</div>
									<div className="w-full lg:w-1/2">
										<ParticipantList participants={participantListItems} />
									</div>
								</HStack>
							</SectionSurface>
							{bootstrap && (
								<>
									<SectionSurface>
										<VStack gap={4}>
											<PageTitleBar level={2} title="AI 메타 추천" />
											<AiForm
												formState={{
													title: metaFormState.title,
													category: metaFormState.category,
													priority: metaFormState.priority,
												}}
												fieldMeta={bootstrap.fieldMeta}
												aiSchemas={bootstrap.aiSchemas}
												ui={bootstrap.ui}
												options={bootstrap.options}
												onFill={onFillMetaAiForm}
												applyPatch={onApplyMetaAiPatch}
												disabled={isUpdatingMeta || isFillingMeta}
											/>
										</VStack>
									</SectionSurface>
									<SectionSurface>
										<VStack gap={4}>
											<PageTitleBar level={2} title="메타 수정" />
											<Input
												label="문의 제목"
												labelPlacement="outside"
												value={metaFormState.title}
												onValueChange={onChangeMetaTitleInput}
												isInvalid={Boolean(metaFormState.error)}
												errorMessage={metaFormState.error}
											/>
											<HStack gap={4} className="flex-col md:flex-row">
												<Select
													label="카테고리"
													placeholder="카테고리 선택"
													value={
														metaFormState.category &&
														editCategoryOptionValues.has(metaFormState.category)
															? metaFormState.category
															: null
													}
													onChange={(selectedValue) => {
														if (selectedValue) {
															onChangeMetaCategorySelection(
																String(selectedValue) as InquiryCategory,
															);
														}
													}}
												>
													{editCategoryOptions.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
												<Select
													label="우선순위"
													placeholder="우선순위 선택"
													value={
														metaFormState.priority &&
														editPriorityOptionValues.has(metaFormState.priority)
															? metaFormState.priority
															: null
													}
													onChange={(selectedValue) => {
														if (selectedValue) {
															onChangeMetaPrioritySelection(
																String(selectedValue) as InquiryPriority,
															);
														}
													}}
												>
													{editPriorityOptions.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
											</HStack>
											<div className="flex justify-end">
												<Button
													color="primary"
													onPress={onClickSaveMetaButton}
													isLoading={isUpdatingMeta}
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
									messages={realtimeState.messages}
									typingUserNames={realtimeState.typingUserNames}
									isWebSocketConnected={realtimeState.isWebSocketConnected}
									isTyping={realtimeState.isTyping}
									onSendMessage={onSendInquiryMessage}
									onTypingStart={onTypingStart}
									onTypingStop={onTypingStop}
									onReconnect={onClickReconnectButton}
									onGenerateDraft={onClickGenerateDraftButton}
									onSearchKnowledge={onClickSearchKnowledgeButton}
									isGeneratingDraft={realtimeState.isGeneratingDraft}
								/>
							</SectionSurface>
							<SectionSurface>
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
							</SectionSurface>
						</VStack>
					</SectionSurface>
					<ConfirmModal
						isOpen={deleteModalOpen}
						onClose={onCloseDeleteModal}
						onConfirm={onConfirmDelete}
						title="문의 삭제"
						message={
							<span>
								<strong>{inquiry?.inquiryNumber ?? inquiryId}</strong>문의를
								삭제하시겠습니까?
								<br />
								삭제된 문의는 복구할 수 없습니다.
							</span>
						}
						confirmText="삭제"
						confirmColor="danger"
						iconType="delete"
						loading={isDeleting}
					/>
				</VStack>
			</InquiryWebSocketProvider>
		);
	},
);
