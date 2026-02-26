import { createLogger } from "@cocrepo/toolkit";
import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

const logger = createLogger("[InquiryStore]");

// ============================================================================
// 타입 정의 (Store 내부에서 사용하는 UI 상태용 타입)
// ============================================================================

/** 문의 상태 */
export type InquiryStatus =
	| "NEW"
	| "IN_PROGRESS"
	| "PENDING_CUSTOMER"
	| "RESOLVED"
	| "CLOSED";

/** 문의 채널 */
export type InquiryChannel = "WEB" | "EMAIL" | "PHONE" | "CHAT" | "SOCIAL";

/** 문의 카테고리 */
export type InquiryCategory =
	| "GENERAL"
	| "TECHNICAL"
	| "BILLING"
	| "COMPLAINT"
	| "FEEDBACK"
	| "OTHER";

/** 문의 우선순위 */
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/**
 * 문의 메시지 UI 상태 타입
 */
export interface InquiryMessage {
	id: string;
	threadId: string;
	inquiryId: string;
	senderType: "USER" | "AI" | "SYSTEM";
	senderId: string | null;
	content: string;
	contentType: string;
	isEdited: boolean;
	isDeleted: boolean;
	deliveredAt: string | null;
	readAt: string | null;
	editedAt: string | null;
	createdAt: string;
}

/**
 * 문의 참여자 UI 상태 타입
 */
export interface InquiryParticipant {
	id: string;
	inquiryId: string;
	threadId: string | null;
	userId: string;
	role: "CUSTOMER" | "AGENT" | "SUPERVISOR";
	isOnline: boolean;
	isTyping: boolean;
	unreadCount: number;
	joinedAt: string;
	lastSeenAt: string | null;
	lastReadAt: string | null;
	leftAt: string | null;
}

/**
 * InquiryStore - 문의 관리 비즈니스 로직
 *
 * 문의 관리와 관련된 UI 상태를 관리합니다. 문의 목록 필터, 선택된 문의, 답변 작성 상태,
 * AI 초안 생성 상태, 실시간 채팅 상태 등을 관리합니다.
 *
 * API 호출은 외부(React Query)에서 수행 후 결과를 전달받습니다.
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.inquiryStore = new InquiryStore(rootStore);
 *
 * // 필터 설정
 * inquiryStore.setFilterStatus("IN_PROGRESS");
 *
 * // 문의 선택
 * inquiryStore.selectInquiry("inq-1");
 *
 * // 실시간 메시지 추가
 * inquiryStore.addMessage(message);
 * ```
 */
export class InquiryStore {
	readonly rootStore: RootStore;

	// === 문의 관리 상태 ===

	/** 현재 조회 중인 문의 ID */
	currentInquiryId: string | null = null;

	/** 현재 선택된 스레드 ID */
	currentThreadId: string | null = null;

	/** 목록에서 선택된 문의 ID 목록 */
	selectedInquiryIds = observable.set<string>();

	// === 필터 상태 ===

	/** 필터: 상태 */
	filterStatus: InquiryStatus | null = null;

	/** 필터: 채널 */
	filterChannel: InquiryChannel | null = null;

	/** 필터: 카테고리 */
	filterCategory: InquiryCategory | null = null;

	/** 필터: 우선순위 */
	filterPriority: InquiryPriority | null = null;

	/** 필터: 담당자 ID */
	filterAssigneeId: string | null = null;

	/** 검색어 */
	searchKeyword = "";

	// === 답변 작성 상태 ===

	/** 답변 작성 폼 열림 여부 */
	isReplyFormOpen = false;

	/** 작성 중인 답변 내용 */
	replyContent = "";

	/** AI 초안 생성 중 여부 */
	isGeneratingDraft = false;

	// === 모달 상태 ===

	/** 지식베이스 검색 모달 열림 여부 */
	isKnowledgeBaseModalOpen = false;

	/** 메타 정보 수정 모달 열림 여부 */
	isMetaEditModalOpen = false;

	// === 페이지네이션 상태 ===

	/** 현재 페이지 번호 */
	page = 1;

	/** 페이지당 항목 수 */
	pageSize = 20;

	// === 실시간 채팅 상태 ===

	/** 실시간 메시지 목록 */
	messages: InquiryMessage[] = [];

	/** 실시간 참여자 목록 */
	participants: InquiryParticipant[] = [];

	/** WebSocket 연결 여부 */
	isWebSocketConnected = false;

	/** 현재 사용자 타이핑 중 여부 */
	isTyping = false;

	/** 타이핑 중인 사용자 목록 */
	typingUsers = observable.map<string, boolean>();

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this, {
			selectedInquiryIds: observable,
			typingUsers: observable,
		});
	}

	// === Computed ===

	/**
	 * 선택된 문의가 있는지 확인
	 */
	get hasSelection(): boolean {
		return this.selectedInquiryIds.size > 0;
	}

	/**
	 * 선택된 문의 수
	 */
	get selectionCount(): number {
		return this.selectedInquiryIds.size;
	}

	/**
	 * 문의 상세를 보고 있는지 확인
	 */
	get isViewingInquiry(): boolean {
		return this.currentInquiryId !== null;
	}

	/**
	 * 활성화된 필터가 있는지 확인
	 */
	get hasActiveFilters(): boolean {
		return (
			this.filterStatus !== null ||
			this.filterChannel !== null ||
			this.filterCategory !== null ||
			this.filterPriority !== null ||
			this.filterAssigneeId !== null ||
			this.searchKeyword !== ""
		);
	}

	/**
	 * API 호출용 필터 파라미터 객체
	 */
	get filterParams(): {
		status?: InquiryStatus;
		channel?: InquiryChannel;
		category?: InquiryCategory;
		priority?: InquiryPriority;
		assigneeId?: string;
		search?: string;
	} {
		return {
			...(this.filterStatus && { status: this.filterStatus }),
			...(this.filterChannel && { channel: this.filterChannel }),
			...(this.filterCategory && { category: this.filterCategory }),
			...(this.filterPriority && { priority: this.filterPriority }),
			...(this.filterAssigneeId && { assigneeId: this.filterAssigneeId }),
			...(this.searchKeyword && { search: this.searchKeyword }),
		};
	}

	/**
	 * 읽지 않은 메시지 수
	 */
	get unreadCount(): number {
		return this.messages.filter((m) => !m.readAt).length;
	}

	/**
	 * 온라인 참여자 목록
	 */
	get onlineParticipants(): InquiryParticipant[] {
		return this.participants.filter((p) => p.isOnline);
	}

	/**
	 * 누군가 타이핑 중인지 확인
	 */
	get isAnyoneTyping(): boolean {
		return this.typingUsers.size > 0;
	}

	/**
	 * 타이핑 중인 사용자 이름 목록
	 */
	get typingUserNames(): string[] {
		// Map의 key(사용자 ID)를 반환
		// 실제 이름은 외부에서 사용자 정보와 매핑 필요
		return Array.from(this.typingUsers.keys());
	}

	// === 문의 관리 액션 ===

	/**
	 * 현재 문의 설정
	 */
	setCurrentInquiry(inquiryId: string | null): void {
		this.currentInquiryId = inquiryId;
		logger.info("현재 문의 설정", { inquiryId });
	}

	/**
	 * 현재 스레드 설정
	 */
	setCurrentThread(threadId: string | null): void {
		this.currentThreadId = threadId;
		logger.info("현재 스레드 설정", { threadId });
	}

	/**
	 * 문의 선택 (토글)
	 */
	selectInquiry(inquiryId: string): void {
		if (this.selectedInquiryIds.has(inquiryId)) {
			this.selectedInquiryIds.delete(inquiryId);
			logger.info("문의 선택 해제", { inquiryId });
		} else {
			this.selectedInquiryIds.add(inquiryId);
			logger.info("문의 선택", { inquiryId });
		}
	}

	/**
	 * 전체 선택
	 */
	selectAllInquiries(inquiryIds: string[]): void {
		for (const id of inquiryIds) {
			this.selectedInquiryIds.add(id);
		}
		logger.info("전체 선택", { count: inquiryIds.length });
	}

	/**
	 * 선택 초기화
	 */
	clearSelection(): void {
		this.selectedInquiryIds.clear();
		logger.info("선택 초기화");
	}

	// === 필터 관리 액션 ===

	/**
	 * 상태 필터 설정
	 */
	setFilterStatus(status: InquiryStatus | null): void {
		this.filterStatus = status;
		this.page = 1; // 필터 변경 시 페이지 초기화
		logger.info("상태 필터 설정", { status });
	}

	/**
	 * 채널 필터 설정
	 */
	setFilterChannel(channel: InquiryChannel | null): void {
		this.filterChannel = channel;
		this.page = 1;
		logger.info("채널 필터 설정", { channel });
	}

	/**
	 * 카테고리 필터 설정
	 */
	setFilterCategory(category: InquiryCategory | null): void {
		this.filterCategory = category;
		this.page = 1;
		logger.info("카테고리 필터 설정", { category });
	}

	/**
	 * 우선순위 필터 설정
	 */
	setFilterPriority(priority: InquiryPriority | null): void {
		this.filterPriority = priority;
		this.page = 1;
		logger.info("우선순위 필터 설정", { priority });
	}

	/**
	 * 담당자 필터 설정
	 */
	setFilterAssignee(assigneeId: string | null): void {
		this.filterAssigneeId = assigneeId;
		this.page = 1;
		logger.info("담당자 필터 설정", { assigneeId });
	}

	/**
	 * 검색어 설정
	 */
	setSearchKeyword(keyword: string): void {
		this.searchKeyword = keyword;
		this.page = 1;
		logger.info("검색어 설정", { keyword });
	}

	/**
	 * 모든 필터 초기화
	 */
	clearAllFilters(): void {
		this.filterStatus = null;
		this.filterChannel = null;
		this.filterCategory = null;
		this.filterPriority = null;
		this.filterAssigneeId = null;
		this.searchKeyword = "";
		this.page = 1;
		logger.info("모든 필터 초기화");
	}

	/**
	 * 페이지 설정
	 */
	setPage(page: number): void {
		this.page = page;
		logger.info("페이지 설정", { page });
	}

	/**
	 * 페이지 크기 설정
	 */
	setPageSize(size: number): void {
		this.pageSize = size;
		this.page = 1;
		logger.info("페이지 크기 설정", { size });
	}

	// === 답변 작성 액션 ===

	/**
	 * 답변 폼 열기
	 */
	openReplyForm(): void {
		this.isReplyFormOpen = true;
		logger.info("답변 폼 열기");
	}

	/**
	 * 답변 폼 닫기
	 */
	closeReplyForm(): void {
		this.isReplyFormOpen = false;
		this.replyContent = "";
		logger.info("답변 폼 닫기");
	}

	/**
	 * 답변 내용 설정
	 */
	setReplyContent(content: string): void {
		this.replyContent = content;
	}

	/**
	 * AI 초안 생성 상태 설정
	 */
	setGeneratingDraft(isGenerating: boolean): void {
		this.isGeneratingDraft = isGenerating;
		logger.info("AI 초안 생성 상태", { isGenerating });
	}

	// === 모달 관리 액션 ===

	/**
	 * 지식베이스 모달 열기
	 */
	openKnowledgeBaseModal(): void {
		this.isKnowledgeBaseModalOpen = true;
		logger.info("지식베이스 모달 열기");
	}

	/**
	 * 지식베이스 모달 닫기
	 */
	closeKnowledgeBaseModal(): void {
		this.isKnowledgeBaseModalOpen = false;
		logger.info("지식베이스 모달 닫기");
	}

	/**
	 * 메타 수정 모달 열기
	 */
	openMetaEditModal(): void {
		this.isMetaEditModalOpen = true;
		logger.info("메타 수정 모달 열기");
	}

	/**
	 * 메타 수정 모달 닫기
	 */
	closeMetaEditModal(): void {
		this.isMetaEditModalOpen = false;
		logger.info("메타 수정 모달 닫기");
	}

	// === WebSocket 연결 관리 ===

	/**
	 * WebSocket 연결 상태 설정
	 */
	setWebSocketConnected(connected: boolean): void {
		this.isWebSocketConnected = connected;
		logger.info("WebSocket 연결 상태", { connected });
	}

	// === 실시간 채팅 액션 ===

	/**
	 * 새 메시지 추가
	 */
	addMessage(message: InquiryMessage): void {
		// 중복 메시지 방지
		const exists = this.messages.some((m) => m.id === message.id);
		if (!exists) {
			this.messages.push(message);
			logger.info("메시지 추가", { messageId: message.id });
		}
	}

	/**
	 * 메시지 업데이트
	 */
	updateMessage(messageId: string, updates: Partial<InquiryMessage>): void {
		const index = this.messages.findIndex((m) => m.id === messageId);
		if (index !== -1) {
			this.messages[index] = { ...this.messages[index], ...updates };
			logger.info("메시지 업데이트", { messageId });
		}
	}

	/**
	 * 메시지 삭제
	 */
	removeMessage(messageId: string): void {
		this.messages = this.messages.filter((m) => m.id !== messageId);
		logger.info("메시지 삭제", { messageId });
	}

	/**
	 * 메시지 목록 설정
	 */
	setMessages(messages: InquiryMessage[]): void {
		this.messages = messages;
		logger.info("메시지 목록 설정", { count: messages.length });
	}

	/**
	 * 메시지 읽음 처리
	 */
	markMessageRead(messageId: string): void {
		this.updateMessage(messageId, { readAt: new Date().toISOString() });
		logger.info("메시지 읽음 처리", { messageId });
	}

	/**
	 * 참여자 목록 설정
	 */
	setParticipants(participants: InquiryParticipant[]): void {
		this.participants = participants;
		logger.info("참여자 목록 설정", { count: participants.length });
	}

	/**
	 * 참여자 추가
	 */
	addParticipant(participant: InquiryParticipant): void {
		const exists = this.participants.some((p) => p.id === participant.id);
		if (!exists) {
			this.participants.push(participant);
			logger.info("참여자 추가", { participantId: participant.id });
		}
	}

	/**
	 * 참여자 제거
	 */
	removeParticipant(userId: string): void {
		this.participants = this.participants.filter((p) => p.userId !== userId);
		logger.info("참여자 제거", { userId });
	}

	/**
	 * 참여자 상태 업데이트
	 */
	updateParticipant(
		userId: string,
		updates: Partial<InquiryParticipant>,
	): void {
		const index = this.participants.findIndex((p) => p.userId === userId);
		if (index !== -1) {
			this.participants[index] = {
				...this.participants[index],
				...updates,
			};
			logger.info("참여자 상태 업데이트", { userId });
		}
	}

	/**
	 * 타이핑 상태 설정
	 */
	setTyping(userId: string, isTyping: boolean): void {
		if (isTyping) {
			this.typingUsers.set(userId, true);
		} else {
			this.typingUsers.delete(userId);
		}
	}

	/**
	 * 현재 사용자 타이핑 시작
	 */
	startTyping(): void {
		this.isTyping = true;
		logger.info("타이핑 시작");
	}

	/**
	 * 현재 사용자 타이핑 중지
	 */
	stopTyping(): void {
		this.isTyping = false;
		logger.info("타이핑 중지");
	}

	// === 초기화 ===

	/**
	 * 모든 상태 초기화
	 */
	clear(): void {
		this.currentInquiryId = null;
		this.currentThreadId = null;
		this.selectedInquiryIds.clear();
		this.filterStatus = null;
		this.filterChannel = null;
		this.filterCategory = null;
		this.filterPriority = null;
		this.filterAssigneeId = null;
		this.searchKeyword = "";
		this.isReplyFormOpen = false;
		this.replyContent = "";
		this.isGeneratingDraft = false;
		this.isKnowledgeBaseModalOpen = false;
		this.isMetaEditModalOpen = false;
		this.page = 1;
		this.messages = [];
		this.participants = [];
		this.isWebSocketConnected = false;
		this.isTyping = false;
		this.typingUsers.clear();
		logger.info("모든 상태 초기화");
	}
}
