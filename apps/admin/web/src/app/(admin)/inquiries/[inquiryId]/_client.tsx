"use client";

import { useInquiryStore, type InquiryMessage, type InquiryParticipant } from "@cocrepo/store";
import {
	Button,
	PageSurface,
	SectionSurface,
	VStack,
	HStack,
	InquiryInfoCard,
	InquiryMetaPanel,
	CustomerInfoCard,
	ParticipantList,
	SLATracker,
	RealtimeChatPanel,
	InquiryWebSocketProvider,
	ConfirmModal,
} from "@cocrepo/ui";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useHandlers } from "./hooks/useHandlers";
import { useInquiryWebSocket } from "./hooks/useInquiryWebSocket";

// TODO: Orval 훅 생성 후 아래 import 추가
// import {
// 	useGetInquiryById,
// 	useGetInquiryMessages,
// 	useGetParticipants,
// 	useUpdateInquiryStatus,
// 	useUpdateInquiryPriority,
// 	useAssignInquiry,
// 	useCreateInquiryMessage,
// } from "@cocrepo/api";
// import type { InquiryDetailDto, InquiryMessageDto, InquiryParticipantDto } from "@cocrepo/api";

/**
 * 더미 데이터 (API 훅 생성 전까지 사용)
 *
 * @requires Orval API 훅 생성 후 제거 필요
 */
const dummyInquiry = {
	id: "inq-001",
	inquiryNumber: "INQ-2026-0225-001",
	title: "배송 일정 문의",
	channel: "CHAT",
	channelLabel: "채팅 (실시간)",
	createdAt: "2026.02.25 14:30",
	status: "IN_PROGRESS",
	priority: "HIGH",
	category: "DELIVERY",
	assigneeId: "user-001",
	assigneeName: "김상담",
	tags: ["배송", "긴급"],
	sentiment: {
		type: "neutral" as const,
		label: "중립",
		confidence: 85,
	},
};

const dummyCustomer = {
	name: "홍길동",
	email: "hong@example.com",
	phone: "010-1234-5678",
	joinedAt: "2025.01.15",
	inquiryCount: 5,
};

const dummyParticipants: Array<{
	id: string;
	name: string;
	role: "customer" | "agent" | "supervisor";
	isOnline: boolean;
	isTyping?: boolean;
}> = [
	{ id: "1", name: "홍길동", role: "customer", isOnline: true, isTyping: true },
	{ id: "2", name: "김상담", role: "agent", isOnline: true },
	{ id: "3", name: "이감독", role: "supervisor", isOnline: false },
];

const dummyMessages: InquiryMessage[] = [
	{
		id: "msg-1",
		threadId: "thread-1",
		inquiryId: "inq-001",
		senderType: "USER",
		senderId: "홍길동",
		content: "안녕하세요, 2월 20일에 주문한 상품 배송 일정이 어떻게 되나요?\n주문번호는 ORD-2026-0220-123입니다.",
		contentType: "text",
		isEdited: false,
		isDeleted: false,
		deliveredAt: "2026-02-25T14:31:00Z",
		readAt: "2026-02-25T14:35:00Z",
		editedAt: null,
		createdAt: "2026-02-25T14:30:00Z",
	},
	{
		id: "msg-2",
		threadId: "thread-1",
		inquiryId: "inq-001",
		senderType: "USER",
		senderId: "김상담",
		content: "안녕하세요, 고객님. 주문하신 상품은 현재 배송 준비 중입니다.\n2월 27일 출고 예정이며, 2월 28~29일 수령 가능합니다.\n\n[AI 초안 사용됨]",
		contentType: "text",
		isEdited: false,
		isDeleted: false,
		deliveredAt: "2026-02-25T15:00:00Z",
		readAt: "2026-02-25T15:30:00Z",
		editedAt: null,
		createdAt: "2026-02-25T15:00:00Z",
	},
	{
		id: "msg-3",
		threadId: "thread-1",
		inquiryId: "inq-001",
		senderType: "USER",
		senderId: "홍길동",
		content: "네, 확인 감사합니다. 혹시 배송지 변경이 가능할까요?",
		contentType: "text",
		isEdited: false,
		isDeleted: false,
		deliveredAt: "2026-02-25T15:31:00Z",
		readAt: null,
		editedAt: null,
		createdAt: "2026-02-25T15:30:00Z",
	},
];

const dummySLA = {
	firstResponse: {
		label: "첫 응답",
		elapsedMinutes: 30,
		targetMinutes: 60,
		isCompleted: true,
		isBreached: false,
	},
	resolution: {
		label: "해결",
		elapsedMinutes: 90,
		targetMinutes: 240,
		isCompleted: false,
		isBreached: false,
	},
};

// 옵션 데이터
const statusOptions = [
	{ value: "NEW", text: "신규" },
	{ value: "IN_PROGRESS", text: "진행중" },
	{ value: "PENDING_CUSTOMER", text: "고객대기" },
	{ value: "RESOLVED", text: "해결" },
	{ value: "CLOSED", text: "종료" },
];

const priorityOptions = [
	{ value: "URGENT", text: "긴급" },
	{ value: "HIGH", text: "높음" },
	{ value: "MEDIUM", text: "보통" },
	{ value: "LOW", text: "낮음" },
];

const categoryOptions = [
	{ value: "GENERAL", text: "일반" },
	{ value: "DELIVERY", text: "배송" },
	{ value: "PAYMENT", text: "결제" },
	{ value: "REFUND", text: "환불" },
	{ value: "PRODUCT", text: "상품" },
	{ value: "TECHNICAL", text: "기술" },
];

const assigneeOptions = [
	{ value: "", text: "미배정" },
	{ value: "user-001", text: "김상담" },
	{ value: "user-002", text: "박상담" },
	{ value: "user-003", text: "이상담" },
];

interface Props {
	inquiryId: string;
}

/**
 * 문의 상세 페이지 - 클라이언트 컴포넌트
 *
 * @requires Orval API 훅 생성 후 아래와 같이 변경:
 * 1. useGetInquiryById 훅 호출
 * 2. useGetInquiryMessages 훅 호출
 * 3. useGetParticipants 훅 호출
 * 4. dummy 데이터 제거
 */
function InquiryDetailPageClient({ inquiryId }: Props) {
	const router = useRouter();
	const store = useInquiryStore();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		// WebSocket 재연결 트리거
		reconnectKey: 0,
		// 삭제 모달
		deleteModalOpen: false,
		// 지식베이스 모달
		knowledgeBaseModalOpen: false,
	}));

	// TODO: Orval 훅 생성 후 아래 주석 해제
	// // 문의 상세 조회
	// const { data: inquiryResponse, isLoading: isLoadingInquiry } = useGetInquiryById(inquiryId);
	// // 메시지 목록 조회
	// const { data: messagesResponse } = useGetInquiryMessages(inquiryId);
	// // 참여자 목록 조회
	// const { data: participantsResponse } = useGetParticipants(inquiryId);
	//
	// // 데이터 추출
	// const inquiry = inquiryResponse?.data;
	// const messages = messagesResponse?.data ?? [];
	// const participants = participantsResponse?.data ?? [];

	// WebSocket 연결
	const ws = useInquiryWebSocket({
		inquiryId,
		autoConnect: true,
		onConnect: () => {
			console.log("WebSocket 연결됨");
		},
		onDisconnect: () => {
			console.log("WebSocket 연결 해제됨");
		},
	});

	// 초기 데이터 설정
	useEffect(() => {
		store.setCurrentInquiry(inquiryId);
		store.setMessages(dummyMessages);

		// 참여자 데이터 변환
		const participants: InquiryParticipant[] = dummyParticipants.map((p) => ({
			id: p.id,
			inquiryId,
			threadId: "thread-1",
			userId: p.id,
			role: p.role.toUpperCase() as "CUSTOMER" | "AGENT" | "SUPERVISOR",
			isOnline: p.isOnline,
			isTyping: p.isTyping ?? false,
			unreadCount: 0,
			joinedAt: "2026-02-25T14:30:00Z",
			lastSeenAt: null,
			lastReadAt: null,
			leftAt: null,
		}));
		store.setParticipants(participants);

		return () => {
			store.clear();
		};
	}, [inquiryId, store]);

	// 핸들러
	const handlers = useHandlers({
		inquiryId,
		ws,
	});

	// 재연결 핸들러
	const handleReconnect = useCallback(() => {
		state.reconnectKey += 1;
		ws.reconnect();
	}, [state, ws]);

	// 메시지 전송 핸들러
	const handleSendMessage = useCallback(
		(content: string, attachments?: File[]) => {
			ws.sendMessage(content, attachments);
		},
		[ws],
	);

	// 온라인 참여자 이름 목록
	const onlineParticipantNames = store.onlineParticipants
		.map((p) => p.userId)
		.filter(Boolean);

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
					{/* 상단 섹션: 문의 정보 + 메타 정보 */}
					<HStack gap={4} className="lg:flex-row flex-col">
						<div className="lg:w-2/3 w-full">
							<InquiryInfoCard
								inquiryNumber={dummyInquiry.inquiryNumber}
								title={dummyInquiry.title}
								channel={dummyInquiry.channelLabel}
								createdAt={dummyInquiry.createdAt}
								sentiment={dummyInquiry.sentiment}
								onlineParticipants={onlineParticipantNames}
							/>
						</div>
						<div className="lg:w-1/3 w-full">
							<InquiryMetaPanel
								status={dummyInquiry.status}
								statusOptions={statusOptions}
								onStatusChange={handlers.onChangeStatus}
								priority={dummyInquiry.priority}
								priorityOptions={priorityOptions}
								onPriorityChange={handlers.onChangePriority}
								category={dummyInquiry.category}
								categoryOptions={categoryOptions}
								onCategoryChange={handlers.onChangeCategory}
								assigneeId={dummyInquiry.assigneeId}
								assigneeName={dummyInquiry.assigneeName}
								assigneeOptions={assigneeOptions}
								onAssigneeChange={handlers.onChangeAssignee}
								tags={dummyInquiry.tags}
								onTagAdd={handlers.onTagAdd}
								onTagRemove={handlers.onTagRemove}
							/>
						</div>
					</HStack>

					{/* 중간 섹션: 고객 정보 + 참여자 목록 */}
					<HStack gap={4} className="lg:flex-row flex-col">
						<div className="lg:w-1/2 w-full">
							<CustomerInfoCard
								name={dummyCustomer.name}
								email={dummyCustomer.email}
								phone={dummyCustomer.phone}
								joinedAt={dummyCustomer.joinedAt}
								inquiryCount={dummyCustomer.inquiryCount}
							/>
						</div>
						<div className="lg:w-1/2 w-full">
							<ParticipantList
								participants={dummyParticipants.map((p) => ({
									...p,
									isTyping: store.typingUsers.has(p.id) || p.isTyping,
								}))}
							/>
						</div>
					</HStack>

					{/* 실시간 채팅 패널 */}
					<SectionSurface>
						<RealtimeChatPanel
							inquiryId={inquiryId}
							initialMessages={store.messages.length > 0 ? undefined : dummyMessages}
							participants={store.participants}
							onSendMessage={handleSendMessage}
							onTypingStart={handlers.onTypingStart}
							onTypingStop={handlers.onTypingStop}
							onReconnect={handleReconnect}
							onGenerateDraft={handlers.onClickGenerateDraft}
							onSearchKnowledge={() => {
								state.knowledgeBaseModalOpen = true;
							}}
							isGeneratingDraft={store.isGeneratingDraft}
						/>
					</SectionSurface>

					{/* SLA 추적 */}
					<SLATracker
						firstResponse={dummySLA.firstResponse}
						resolution={dummySLA.resolution}
					/>
				</VStack>

				{/* 삭제 확인 모달 */}
				<ConfirmModal
					isOpen={state.deleteModalOpen}
					onClose={() => {
						state.deleteModalOpen = false;
					}}
					onConfirm={async () => {
						await handlers.deleteModal.confirm();
						state.deleteModalOpen = false;
						router.push("/inquiries" as Route);
					}}
					title="문의 삭제"
					message={
						<span>
							<strong>{dummyInquiry.inquiryNumber}</strong> 문의를 삭제하시겠습니까?
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
