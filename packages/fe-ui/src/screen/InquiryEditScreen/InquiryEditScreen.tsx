"use client";

import type {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
} from "@cocrepo/api/core/inquiries";
import type { WebSocketStatus } from "@cocrepo/hook";
import type { InquiryMessage } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquiryWebSocketProvider,
} from "../../feature/InquiryWebSocketProvider";
import { RealtimeChatPanel } from "../../feature/RealtimeChatPanel";
import {
	InquiryForm,
	type InquiryFormBootstrap,
	type InquiryFormCustomerSearchResult,
	type InquiryFormOption,
	type InquiryFormState,
} from "../../form/InquiryForm";
import { Button } from "../../input/Button/Button";
import { HStack, VStack } from "../../rhythm";
import { Section } from "../../layout/Section/Section";
import { SectionSurface } from "../../surface";
import { ConfirmModal } from "../../widget/ConfirmModal";
import { CustomerInfoCard } from "../../widget/CustomerInfoCard";
import { InquiryInfoCard } from "../../widget/InquiryInfoCard";
import { InquiryMetaPanel } from "../../widget/InquiryMetaPanel";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { ParticipantList } from "../../widget/ParticipantList";
import { SLATracker } from "../../widget/SLATracker";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

const toMinutes = (start: string, end: string) => {
	return Math.max(
		0,
		Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000),
	);
};

export interface InquiryEditScreenCustomerSearchResult
	extends InquiryFormCustomerSearchResult {}
export interface InquiryEditScreenOption extends InquiryFormOption {}
export interface InquiryEditScreenBootstrap extends InquiryFormBootstrap {}
export interface InquiryEditScreenFormState extends InquiryFormState {}
export interface InquiryEditScreenMetaFormState extends InquiryFormState {}

export interface InquiryEditScreenInquiry {
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

export interface InquiryEditScreenParticipantListItem {
	id: string;
	name: string;
	role: "customer" | "agent" | "supervisor";
	isOnline: boolean;
	isTyping: boolean;
}

export interface InquiryEditScreenAssigneeOption {
	value: string;
	text: string;
}

export interface InquiryEditScreenRealtimeState {
	messages: InquiryMessage[];
	typingUserNames: string[];
	isWebSocketConnected: boolean;
	isTyping: boolean;
}

export interface InquiryEditScreenProps {
	title?: string;
	description?: string;
	readOnly?: boolean;
	formState?: InquiryEditScreenFormState;
	bootstrap?: InquiryEditScreenBootstrap;
	categoryOptions?: InquiryEditScreenOption[];
	channelOptions?: InquiryEditScreenOption[];
	priorityOptions?: InquiryEditScreenOption[];
	isLoading?: boolean;
	isSubmitting?: boolean;
	showCustomerField?: boolean;
	showContentField?: boolean;
	showChannelField?: boolean;
	submitLabel?: string;
	onSearchCustomer?: (keyword: string) => void;
	onSelectCustomer?: (customer: InquiryEditScreenCustomerSearchResult) => void;
	onClickBackButton: () => void;
	onClickCancelButton?: () => void;
	onClickSubmitButton?: () => void;
	inquiryId?: string;
	inquiry?: InquiryEditScreenInquiry;
	metaFormState?: InquiryEditScreenMetaFormState;
	realtimeState?: InquiryEditScreenRealtimeState;
	participantListItems?: InquiryEditScreenParticipantListItem[];
	onlineParticipantNames?: string[];
	assigneeOptions?: InquiryEditScreenAssigneeOption[];
	deleteModalOpen?: boolean;
	isDeleting?: boolean;
	isUpdatingMeta?: boolean;
	webSocketStatus?: WebSocketStatus;
	onClickEditButton?: () => void;
	onOpenDeleteModal?: () => void;
	onCloseDeleteModal?: () => void;
	onConfirmDelete?: () => void;
	onChangeStatus?: (status: string) => void;
	onChangePriority?: (priority: string) => void;
	onChangeCategory?: (category: string) => void;
	onChangeAssignee?: (assigneeId: string) => void;
	onTagAdd?: (tag: string) => void;
	onTagRemove?: (tag: string) => void;
	onClickReconnectButton?: () => void;
	onSendInquiryMessage?: (content: string, attachments?: File[]) => void;
	onSendTypingStatus?: (isTyping: boolean) => void;
	onTypingStart?: () => void;
	onTypingStop?: () => void;
	onClickSearchKnowledgeButton?: () => void;
}

/** Inquiry aggregate의 접수/상세/수정 route가 공유하는 화면입니다. */
export const InquiryEditScreen = observer(
	({
		title,
		description,
		readOnly = false,
		formState,
		bootstrap,
		categoryOptions = [],
		channelOptions = [],
		priorityOptions = [],
		isLoading = false,
		isSubmitting = false,
		showCustomerField = false,
		showContentField = false,
		showChannelField = false,
		submitLabel = "저장",
		onSearchCustomer,
		onSelectCustomer,
		onClickBackButton,
		onClickCancelButton,
		onClickSubmitButton,
		inquiryId,
		inquiry,
		metaFormState,
		realtimeState,
		participantListItems = [],
		onlineParticipantNames = [],
		assigneeOptions = [],
		deleteModalOpen = false,
		isDeleting = false,
		isUpdatingMeta = false,
		webSocketStatus = "disconnected",
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
		onClickReconnectButton,
		onSendInquiryMessage,
		onSendTypingStatus,
		onTypingStart,
		onTypingStop,
		onClickSearchKnowledgeButton,
	}: InquiryEditScreenProps) => {
		if (readOnly && inquiryId) {
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
			const metaPriorityOptions = (bootstrap?.options.priority ?? []).map(
				(option) => ({
					value: String(option.value ?? ""),
					text: option.label,
				}),
			);
			const metaCategoryOptions = (bootstrap?.options.category ?? []).map(
				(option) => ({
					value: String(option.value ?? ""),
					text: option.label,
				}),
			);
			const channelLabel =
				(bootstrap?.options.channel ?? []).find(
					(option) =>
						String(option.value ?? "") === (inquiry?.channel ?? ""),
				)?.label ??
				inquiry?.channel ??
				"-";

			return (
				<InquiryWebSocketProvider
					inquiryId={inquiryId}
					status={webSocketStatus}
					onReconnect={onClickReconnectButton ?? (() => undefined)}
					sendMessage={onSendInquiryMessage ?? (() => undefined)}
					sendTypingStatus={onSendTypingStatus ?? (() => undefined)}
				>
					<VStack fullWidth>
						<PageTitleBar
							title={title ?? "문의 상세"}
							description={
								description ?? "문의 상세 정보를 확인하고 답변을 작성합니다."
							}
							actions={
								<HStack>
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
							<Section>
								<Section.Body>
									<VStack>
										<Section>
											<Section.Body>
												<HStack className="flex-col lg:flex-row">
													<div className="w-full lg:w-2/3">
														<InquiryInfoCard
															inquiryNumber={
																inquiry?.inquiryNumber ?? inquiryId
															}
															title={inquiry?.title ?? "문의 정보 로딩 중"}
															channel={channelLabel}
															createdAt={createdAt}
															sentiment={{
																type: sentimentType,
																label:
																	inquiry?.sentiment?.sentiment ??
																	"NEUTRAL",
																confidence: Math.round(
																	(inquiry?.sentiment?.confidence ?? 0.7) *
																		100,
																),
															}}
															onlineParticipants={onlineParticipantNames}
														/>
													</div>
													<div className="w-full lg:w-1/3">
														<InquiryMetaPanel
															status={inquiry?.status ?? "NEW"}
															statusOptions={statusOptions}
															onStatusChange={
																onChangeStatus ?? (() => undefined)
															}
															priority={inquiry?.priority ?? "NORMAL"}
															priorityOptions={metaPriorityOptions}
															onPriorityChange={
																onChangePriority ?? (() => undefined)
															}
															category={inquiry?.category ?? "GENERAL"}
															categoryOptions={metaCategoryOptions}
															onCategoryChange={
																onChangeCategory ?? (() => undefined)
															}
															assigneeId={
																inquiry?.assigneeId ?? undefined
															}
															assigneeName={
																inquiry?.assigneeId ?? undefined
															}
															assigneeOptions={assigneeOptions}
															onAssigneeChange={
																onChangeAssignee ?? (() => undefined)
															}
															tags={[]}
															onTagAdd={onTagAdd ?? (() => undefined)}
															onTagRemove={onTagRemove ?? (() => undefined)}
														/>
													</div>
												</HStack>
											</Section.Body>
										</Section>
										<Section>
											<Section.Body>
												<HStack className="flex-col lg:flex-row">
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
														<ParticipantList
															participants={participantListItems}
														/>
													</div>
												</HStack>
											</Section.Body>
										</Section>
										{metaFormState ? (
											<Section>
												<Section.Body>
													<InquiryForm
														state={metaFormState}
														bootstrap={bootstrap}
														categoryOptions={categoryOptions}
														priorityOptions={priorityOptions}
														readOnly
														isSubmitting={isUpdatingMeta}
														submitLabel="메타 저장"
														onClickCancelButton={onClickBackButton}
														onClickSubmitButton={onClickSubmitButton ?? (() => undefined)}
													/>
												</Section.Body>
											</Section>
										) : null}
										<Section>
											<Section.Body>
												<RealtimeChatPanel
													inquiryId={inquiryId}
													messages={realtimeState?.messages ?? []}
													typingUserNames={
														realtimeState?.typingUserNames ?? []
													}
													isWebSocketConnected={Boolean(
														realtimeState?.isWebSocketConnected,
													)}
													isTyping={Boolean(realtimeState?.isTyping)}
													onSendMessage={
														onSendInquiryMessage ?? (() => undefined)
													}
													onTypingStart={onTypingStart ?? (() => undefined)}
													onTypingStop={onTypingStop ?? (() => undefined)}
													onReconnect={
														onClickReconnectButton ?? (() => undefined)
													}
													onSearchKnowledge={
														onClickSearchKnowledgeButton ??
														(() => undefined)
													}
												/>
											</Section.Body>
										</Section>
										<Section>
											<Section.Body>
												<SLATracker
													firstResponse={{
														label: "첫 응답",
														elapsedMinutes: toMinutes(
															createdAt,
															firstResponseEnd,
														),
														targetMinutes: firstResponseTargetMinutes,
														isCompleted: Boolean(inquiry?.firstResponseAt),
														isBreached: Boolean(
															inquiry?.isSlaResponseBreached,
														),
													}}
													resolution={{
														label: "해결",
														elapsedMinutes: toMinutes(
															createdAt,
															resolutionEnd,
														),
														targetMinutes: resolutionTargetMinutes,
														isCompleted: Boolean(inquiry?.resolvedAt),
														isBreached: Boolean(
															inquiry?.isSlaResolveBreached,
														),
													}}
												/>
											</Section.Body>
										</Section>
									</VStack>
								</Section.Body>
							</Section>
						</SectionSurface>
						<ConfirmModal
							isOpen={deleteModalOpen}
							onClose={onCloseDeleteModal ?? (() => undefined)}
							onConfirm={onConfirmDelete ?? (() => undefined)}
							title="문의 삭제"
							message={
								<span>
									<strong>
										{inquiry?.inquiryNumber ?? inquiryId}
									</strong>
									문의를 삭제하시겠습니까?
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
		}

		return (
			<VStack fullWidth>
				<PageTitleBar
					title={title ?? "문의 수정"}
					description={description ?? "문의 메타 정보를 수정합니다."}
					actions={
						<Button
							variant="flat"
							startContent={<ArrowLeft className="size-4" />}
							onPress={onClickBackButton}
							isDisabled={isSubmitting}
						>
							{showCustomerField ? "목록으로" : "상세로"}
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							{formState ? (
								<InquiryForm
									state={formState}
									bootstrap={bootstrap}
									categoryOptions={categoryOptions}
									channelOptions={channelOptions}
									priorityOptions={priorityOptions}
									isLoading={isLoading}
									isSubmitting={isSubmitting}
									showCustomerField={showCustomerField}
									showContentField={showContentField}
									showChannelField={showChannelField}
									submitLabel={submitLabel}
									onSearchCustomer={onSearchCustomer}
									onSelectCustomer={onSelectCustomer}
									onClickCancelButton={
										onClickCancelButton ?? onClickBackButton
									}
									onClickSubmitButton={
										onClickSubmitButton ?? (() => undefined)
									}
								/>
							) : null}
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
