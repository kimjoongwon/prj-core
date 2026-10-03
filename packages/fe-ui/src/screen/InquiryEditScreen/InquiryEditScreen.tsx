"use client";

import type { WebSocketStatus } from "@cocrepo/hook";
import { Card, ProgressBar } from "@heroui/react";
import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	Hash,
	Mail,
	MessageSquare,
	Pencil,
	Phone,
	Plus,
	Tag,
	Trash2,
	User,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { InquiryWebSocketProvider } from "../../domain/inquiry";
import {
	InquiryForm,
	type InquiryFormBootstrap,
	type InquiryFormCustomerSearchResult,
	type InquiryFormOption,
	type InquiryFormState,
} from "../../form/InquiryForm";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select/Select";
import { TextField } from "../../input/TextField/TextField";
import { Screen } from "../../layout/Screen";
import { Section } from "../../layout/Section/Section";
import { HStack, VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

const toMinutes = (start: string, end: string) => {
	return Math.max(
		0,
		Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000),
	);
};
const formatDurationMinutes = (minutes: number): string => {
	if (minutes < 60) {
		return `${minutes}분`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes === 0
		? `${hours}시간`
		: `${hours}시간 ${remainingMinutes}분`;
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
	participantListItems?: InquiryEditScreenParticipantListItem[];
	onlineParticipantNames?: string[];
	assigneeOptions?: InquiryEditScreenAssigneeOption[];
	isDeleting?: boolean;
	isUpdatingMeta?: boolean;
	webSocketStatus?: WebSocketStatus;
	onClickEditButton?: () => void;
	onClickDeleteButton?: () => void;
	onChangeStatus?: (status: string) => void;
	onChangePriority?: (priority: string) => void;
	onChangeCategory?: (category: string) => void;
	onChangeAssignee?: (assigneeId: string) => void;
	onTagAdd?: (tag: string) => void;
	onTagRemove?: (tag: string) => void;
	onClickReconnectButton?: () => void;
	onSendInquiryMessage?: (content: string, attachments?: File[]) => void;
	onSendTypingStatus?: (isTyping: boolean) => void;
}
const inquiryPriorityColors: Record<
	string,
	"danger" | "warning" | "accent" | "default"
> = {
	URGENT: "danger",
	HIGH: "warning",
	NORMAL: "accent",
	LOW: "default",
};
const findOptionText = (options: InquiryEditScreenOption[], value: string) => {
	return options.find((option) => option.value === value)?.text ?? value;
};
function InquiryMetaPanel({
	status,
	statusOptions,
	onStatusChange,
	priority,
	priorityOptions,
	onPriorityChange,
	category,
	categoryOptions,
	onCategoryChange,
	assigneeId,
	assigneeName,
	assigneeOptions,
	onAssigneeChange,
	tags = [],
	onTagAdd,
	onTagRemove,
	isEditable = true,
	className = "",
}: {
	status: string;
	statusOptions: InquiryEditScreenOption[];
	onStatusChange: (status: string) => void;
	priority: string;
	priorityOptions: InquiryEditScreenOption[];
	onPriorityChange: (priority: string) => void;
	category: string;
	categoryOptions: InquiryEditScreenOption[];
	onCategoryChange: (category: string) => void;
	assigneeId?: string;
	assigneeName?: string;
	assigneeOptions: InquiryEditScreenAssigneeOption[];
	onAssigneeChange: (assigneeId: string) => void;
	tags?: string[];
	onTagAdd?: (tag: string) => void;
	onTagRemove?: (tag: string) => void;
	isEditable?: boolean;
	className?: string;
}) {
	const [newTag, setNewTag] = useState("");
	const [isAddingTag, setIsAddingTag] = useState(false);
	const handleAddTag = () => {
		const trimmedTag = newTag.trim();
		if (!trimmedTag || !onTagAdd) {
			return;
		}
		onTagAdd(trimmedTag);
		setNewTag("");
		setIsAddingTag(false);
	};
	return (
		<Card className={`bg-surface ${className}`}>
			<Card.Content className="p-4">
				<VStack gap="section">
					<h3>
						<Typography type="body-sm" weight="semibold" color="muted">
							메타 정보
						</Typography>
					</h3>

					<VStack gap="dense">
						<label>
							<Typography type="body-xs" color="muted">
								상태
							</Typography>
						</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={statusOptions}
								value={status}
								onChange={(value) => onStatusChange(String(value ?? ""))}
							/>
						) : (
							<Chip size="sm" variant="soft">
								{findOptionText(statusOptions, status)}
							</Chip>
						)}
					</VStack>

					<VStack gap="dense">
						<label>
							<Typography type="body-xs" color="muted">
								우선순위
							</Typography>
						</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={priorityOptions}
								value={priority}
								onChange={(value) => onPriorityChange(String(value ?? ""))}
							/>
						) : (
							<Chip
								size="sm"
								variant="soft"
								color={inquiryPriorityColors[priority] || "default"}
							>
								{findOptionText(priorityOptions, priority)}
							</Chip>
						)}
					</VStack>

					<VStack gap="dense">
						<label>
							<Typography type="body-xs" color="muted">
								카테고리
							</Typography>
						</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={categoryOptions}
								value={category}
								onChange={(value) => onCategoryChange(String(value ?? ""))}
							/>
						) : (
							<Chip size="sm" variant="soft" color="accent">
								{findOptionText(categoryOptions, category)}
							</Chip>
						)}
					</VStack>

					<VStack gap="dense">
						<label>
							<Typography type="body-xs" color="muted">
								담당자
							</Typography>
						</label>
						{isEditable ? (
							<Select
								size="sm"
								variant="bordered"
								options={assigneeOptions}
								value={assigneeId || ""}
								onChange={(value) => onAssigneeChange(String(value ?? ""))}
								placeholder="담당자 선택"
							/>
						) : (
							<Typography type="body-sm">{assigneeName || "미배정"}</Typography>
						)}
					</VStack>

					<VStack gap="block">
						<label>
							<Typography type="body-xs" color="muted">
								태그
							</Typography>
						</label>
						<HStack gap="dense" className="flex-wrap">
							{tags.map((tag) => (
								<Chip
									key={tag}
									size="sm"
									variant="soft"
									color="accent"
									onClose={isEditable ? () => onTagRemove?.(tag) : undefined}
								>
									#{tag}
								</Chip>
							))}
							{isEditable && !isAddingTag ? (
								<Button
									size="sm"
									variant="tertiary"
									startContent={<Plus className="size-3" />}
									onPress={() => setIsAddingTag(true)}
									className="h-6 min-w-0 px-2"
								>
									추가
								</Button>
							) : null}
						</HStack>
						{isEditable && isAddingTag ? (
							<TextField
								size="sm"
								placeholder="태그 입력..."
								value={newTag}
								onValueChange={setNewTag}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										handleAddTag();
									}
									if (event.key === "Escape") {
										setIsAddingTag(false);
										setNewTag("");
									}
								}}
								onBlur={() => {
									if (newTag.trim()) {
										handleAddTag();
										return;
									}
									setIsAddingTag(false);
								}}
								startContent={<Tag className="size-3 text-muted" />}
								classNames={{
									input: "text-sm",
								}}
							/>
						) : null}
					</VStack>
				</VStack>
			</Card.Content>
		</Card>
	);
}
function InquiryInfoPanel({
	inquiryNumber,
	title,
	channel,
	createdAt,
	sentiment,
	onlineParticipants,
}: {
	inquiryNumber: string;
	title: string;
	channel: string;
	createdAt: string;
	sentiment: {
		type: "positive" | "neutral" | "negative";
		label: string;
		confidence: number;
	};
	onlineParticipants: string[];
}) {
	const sentimentTone = {
		positive: "😊",
		neutral: "😐",
		negative: "😠",
	}[sentiment.type];
	return (
		<Card className="bg-surface">
			<Card.Content className="p-4">
				<VStack gap="block">
					<h3>
						<Typography type="body-sm" weight="semibold" color="muted">
							문의 정보
						</Typography>
					</h3>
					<HStack alignItems="center">
						<Hash className="size-4 text-muted" />
						<Typography type="body-sm" color="muted">
							문의번호:
						</Typography>
						<Typography.Code weight="medium">{inquiryNumber}</Typography.Code>
					</HStack>
					<div>
						<Typography type="body-sm" color="muted">
							제목:{" "}
						</Typography>
						<Typography weight="semibold">{title}</Typography>
					</div>
					<HStack alignItems="center">
						<MessageSquare className="size-4 text-muted" />
						<Typography type="body-sm" color="muted">
							채널:
						</Typography>
						<Typography type="body-sm">{channel}</Typography>
					</HStack>
					<HStack alignItems="center">
						<Clock className="size-4 text-muted" />
						<Typography type="body-sm" color="muted">
							접수일:
						</Typography>
						<Typography type="body-sm">{createdAt}</Typography>
					</HStack>
					<HStack
						alignItems="center"
						className="rounded-lg bg-surface-secondary p-2"
					>
						<Typography type="body-sm">감정 분석:</Typography>
						<Typography className="text-lg">{sentimentTone}</Typography>
						<Typography type="body-sm" weight="medium">
							{sentiment.label}
						</Typography>
						<Typography type="body-xs" color="muted">
							(신뢰도 {sentiment.confidence}%)
						</Typography>
					</HStack>
					{onlineParticipants.length > 0 ? (
						<HStack alignItems="center">
							<User className="size-4 text-success" />
							<Typography type="body-sm" className="text-success">
								온라인:
							</Typography>
							<Typography type="body-sm">
								{onlineParticipants.join(", ")}
							</Typography>
						</HStack>
					) : null}
				</VStack>
			</Card.Content>
		</Card>
	);
}
function CustomerInfoPanel({
	name,
	email,
	phone,
	joinedAt,
	inquiryCount,
}: {
	name: string;
	email?: string;
	phone?: string;
	joinedAt?: string;
	inquiryCount?: number;
}) {
	return (
		<Card className="bg-surface">
			<Card.Content className="p-4">
				<VStack gap="block">
					<h3>
						<Typography type="body-sm" weight="semibold" color="muted">
							고객 정보
						</Typography>
					</h3>
					<HStack alignItems="center">
						<User className="size-4 text-muted" />
						<Typography weight="semibold">{name}</Typography>
						{email ? (
							<Typography type="body-sm" color="muted">
								({email})
							</Typography>
						) : null}
					</HStack>
					{phone ? (
						<HStack alignItems="center">
							<Phone className="size-4 text-muted" />
							<Typography type="body-sm">{phone}</Typography>
						</HStack>
					) : null}
					{joinedAt ? (
						<HStack alignItems="center">
							<Calendar className="size-4 text-muted" />
							<Typography type="body-sm" color="muted">
								가입일:
							</Typography>
							<Typography type="body-sm">{joinedAt}</Typography>
						</HStack>
					) : null}
					{inquiryCount !== undefined ? (
						<HStack alignItems="center">
							<Mail className="size-4 text-muted" />
							<Typography type="body-sm" color="muted">
								문의 이력:
							</Typography>
							<Typography type="body-sm" weight="medium">
								{inquiryCount}건
							</Typography>
						</HStack>
					) : null}
				</VStack>
			</Card.Content>
		</Card>
	);
}
const participantRoleConfig = {
	customer: {
		label: "고객",
		color: "accent" as const,
	},
	agent: {
		label: "담당자",
		color: "success" as const,
	},
	supervisor: {
		label: "감독관",
		color: "warning" as const,
	},
};
function ParticipantPanel({
	participants,
}: {
	participants: InquiryEditScreenParticipantListItem[];
}) {
	const onlineParticipants = participants.filter(
		(participant) => participant.isOnline,
	);
	const typingParticipants = participants.filter(
		(participant) => participant.isTyping,
	);
	return (
		<Card className="bg-surface">
			<Card.Content className="p-4">
				<VStack gap="block">
					<div className="flex items-center justify-between">
						<h3>
							<Typography type="body-sm" weight="semibold" color="muted">
								참여자 ({participants.length})
							</Typography>
						</h3>
						{onlineParticipants.length > 0 ? (
							<Typography type="body-xs" className="text-success">
								{onlineParticipants.length}명 온라인
							</Typography>
						) : null}
					</div>
					<VStack gap="block">
						{participants.map((participant) => {
							const roleInfo = participantRoleConfig[participant.role];
							return (
								<HStack
									alignItems="center"
									key={participant.id}
									className="w-full rounded-lg p-2"
								>
									<span
										className={`size-2 rounded-full ${participant.isOnline ? "bg-success" : "bg-default"}`}
									/>
									<Typography type="body-sm" className="flex-1">
										{participant.name}
									</Typography>
									<Chip size="sm" variant="soft" color={roleInfo.color}>
										{roleInfo.label}
									</Chip>
									{participant.isTyping ? (
										<Typography type="body-xs" className="text-accent">
											작성 중...
										</Typography>
									) : null}
								</HStack>
							);
						})}
					</VStack>
					{typingParticipants.length > 0 ? (
						<div className="rounded-lg bg-accent-soft p-2">
							<Typography type="body-xs" className="text-accent">
								{typingParticipants
									.map((participant) => participant.name)
									.join(", ")}
								님이 타이핑 중입니다...
							</Typography>
						</div>
					) : null}
				</VStack>
			</Card.Content>
		</Card>
	);
}
interface SlaMetric {
	label: string;
	elapsedMinutes: number;
	targetMinutes: number;
	isCompleted?: boolean;
	isBreached?: boolean;
}
function SlaMetricRow({ metric }: { metric: SlaMetric }) {
	const progress = Math.min(
		(metric.elapsedMinutes / metric.targetMinutes) * 100,
		100,
	);
	const isBreached =
		Boolean(metric.isBreached) || metric.elapsedMinutes >= metric.targetMinutes;
	const status = metric.isCompleted ? "완료" : isBreached ? "위반" : "진행중";
	const color = metric.isCompleted
		? "text-success"
		: isBreached
			? "text-danger"
			: "text-accent";
	const icon = metric.isCompleted ? (
		<CheckCircle className="size-4 text-success" />
	) : isBreached ? (
		<AlertTriangle className="size-4 text-danger" />
	) : (
		<Clock className="size-4 text-accent" />
	);
	return (
		<VStack gap="block">
			<div className="flex items-center justify-between">
				<HStack alignItems="center">
					{icon}
					<Typography type="body-sm">{metric.label}</Typography>
				</HStack>
				<Typography type="body-xs" weight="medium" className={color}>
					{status}
				</Typography>
			</div>
			<div className="flex items-center justify-between">
				<Typography type="body-xs" color="muted">
					{formatDurationMinutes(metric.elapsedMinutes)}
				</Typography>
				<Typography type="body-xs" color="muted">
					목표: {formatDurationMinutes(metric.targetMinutes)}
				</Typography>
			</div>
			<ProgressBar
				aria-label={`${metric.label} 진행률`}
				value={progress}
				color={
					isBreached ? "danger" : metric.isCompleted ? "success" : "accent"
				}
				size="sm"
				className="h-2"
			/>
		</VStack>
	);
}
function SlaTrackerPanel({
	firstResponse,
	resolution,
}: {
	firstResponse: SlaMetric;
	resolution: SlaMetric;
}) {
	return (
		<Card className="bg-surface">
			<Card.Content className="p-4">
				<VStack gap="section">
					<h3>
						<Typography type="body-sm" weight="semibold" color="muted">
							SLA 추적
						</Typography>
					</h3>
					<VStack gap="section">
						<SlaMetricRow metric={firstResponse} />
						<SlaMetricRow metric={resolution} />
					</VStack>
				</VStack>
			</Card.Content>
		</Card>
	);
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
		participantListItems = [],
		onlineParticipantNames = [],
		assigneeOptions = [],
		isDeleting = false,
		isUpdatingMeta = false,
		webSocketStatus = "disconnected",
		onClickEditButton,
		onClickDeleteButton,
		onChangeStatus,
		onChangePriority,
		onChangeCategory,
		onChangeAssignee,
		onTagAdd,
		onTagRemove,
		onClickReconnectButton,
		onSendInquiryMessage,
		onSendTypingStatus,
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
					(option) => String(option.value ?? "") === (inquiry?.channel ?? ""),
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
						<Screen.Header
							title={title ?? "문의 상세"}
							description={
								description ?? "문의 상세 정보를 확인하고 답변을 작성합니다."
							}
							actions={
								<HStack>
									<Button
										variant="ghost"
										startContent={<ArrowLeft className="h-4 w-4" />}
										onPress={onClickBackButton}
									>
										목록으로
									</Button>
									<Button
										variant="tertiary"
										startContent={<Pencil className="h-4 w-4" />}
										onPress={onClickEditButton}
									>
										수정
									</Button>
									<Button
										variant="tertiary"
										startContent={<Trash2 className="h-4 w-4" />}
										isLoading={isDeleting}
										onPress={onClickDeleteButton}
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
														<InquiryInfoPanel
															inquiryNumber={
																inquiry?.inquiryNumber ?? inquiryId
															}
															title={inquiry?.title ?? "문의 정보 로딩 중"}
															channel={channelLabel}
															createdAt={createdAt}
															sentiment={{
																type: sentimentType,
																label:
																	inquiry?.sentiment?.sentiment ?? "NEUTRAL",
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
															assigneeId={inquiry?.assigneeId ?? undefined}
															assigneeName={inquiry?.assigneeId ?? undefined}
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
														<CustomerInfoPanel
															name={inquiry?.customerId ?? "고객"}
															email=""
															phone=""
															joinedAt={undefined}
															inquiryCount={undefined}
														/>
													</div>
													<div className="w-full lg:w-1/2">
														<ParticipantPanel
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
														onClickSubmitButton={
															onClickSubmitButton ?? (() => undefined)
														}
													/>
												</Section.Body>
											</Section>
										) : null}
										<Section>
											<Section.Body>
												<SlaTrackerPanel
													firstResponse={{
														label: "첫 응답",
														elapsedMinutes: toMinutes(
															createdAt,
															firstResponseEnd,
														),
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
											</Section.Body>
										</Section>
									</VStack>
								</Section.Body>
							</Section>
						</SectionSurface>
					</VStack>
				</InquiryWebSocketProvider>
			);
		}
		return (
			<VStack fullWidth>
				<Screen.Header
					title={title ?? "문의 수정"}
					description={description ?? "문의 메타 정보를 수정합니다."}
					actions={
						<Button
							variant="tertiary"
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
									onClickCancelButton={onClickCancelButton ?? onClickBackButton}
									onClickSubmitButton={onClickSubmitButton ?? (() => undefined)}
								/>
							) : null}
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
