"use client";
import {
	useAssignInquiry,
	useFillInquiryFormWithAi,
	useUpdateInquiry,
	useUpdateInquiryPriority,
	useUpdateInquiryStatus,
} from "@cocrepo/api/core/inquiries";

import { ADMIN_PATHS } from "@cocrepo/constant";
import { createLogger } from "@cocrepo/toolkit";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { UseInquiryWebSocketReturn } from "./useInquiryWebSocket";

const logger = createLogger("[useHandlers]");

/**
 * 문의 상세 페이지 이벤트 핸들러 훅
 *
 * @requires Orval API 훅 생성 후 아래와 같이 변경:
 * 1. Mutation 훅 호출 (useUpdateInquiryStatus, useAssignInquiry 등)
 * 2. mutateAsync로 API 호출
 * 3. onSuccess에서 캐시 무효화 (React Query 자동 처리)
 */
export interface UseHandlersOptions {
	/** 문의 ID */
	inquiryId: string;
	/** 문의 상세 페이지 로컬 상태 */
	inquiryState: {
		replyContent: string;
		setReplyContent: (content: string) => void;
		startTyping: () => void;
		stopTyping: () => void;
		setGeneratingDraft: (isGenerating: boolean) => void;
		openKnowledgeBaseModal: () => void;
		closeKnowledgeBaseModal: () => void;
		openMetaEditModal: () => void;
		closeMetaEditModal: () => void;
		isMetaEditModalOpen: boolean;
		isKnowledgeBaseModalOpen: boolean;
	};
	/** WebSocket 훅 반환값 */
	ws: Pick<UseInquiryWebSocketReturn, "sendMessage" | "sendTypingStatus">;
}

/**
 * useHandlers 훅 반환값
 */
export interface UseHandlersReturn {
	/** 목록으로 이동 */
	onClickBack: () => void;
	/** 상태 변경 */
	onChangeStatus: (status: string) => void;
	/** 우선순위 변경 */
	onChangePriority: (priority: string) => void;
	/** 카테고리 변경 */
	onChangeCategory: (category: string) => void;
	/** 담당자 변경 */
	onChangeAssignee: (assigneeId: string) => void;
	/** 태그 추가 */
	onTagAdd: (tag: string) => void;
	/** 태그 삭제 */
	onTagRemove: (tag: string) => void;
	/** 메시지 전송 */
	onSubmitReply: (content: string, attachments?: File[]) => void;
	/** 타이핑 시작 */
	onTypingStart: () => void;
	/** 타이핑 중지 */
	onTypingStop: () => void;
	/** AI 초안 생성 */
	onClickGenerateDraft: () => Promise<void>;
	/** 지식베이스 검색 */
	onClickSearchKnowledge: () => void;
	/** 파일 첨부 */
	onAttachFile: (files: File[]) => void;
	/** 수정 페이지 이동 */
	onClickEdit: () => void;
	/** 삭제 확인 */
	onClickDelete: () => void;
	/** WebSocket 재연결 */
	onClickReconnect: () => void;
	/** 삭제 확인 모달 상태 */
	deleteModal: {
		isOpen: boolean;
		open: () => void;
		close: () => void;
		confirm: () => Promise<void>;
	};
	/** 지식베이스 모달 상태 */
	knowledgeBaseModal: {
		isOpen: boolean;
		open: () => void;
		close: () => void;
	};
}

/**
 * 문의 상세 페이지 이벤트 핸들러 훅
 *
 * 페이지에서 발생하는 모든 이벤트를 처리하는 핸들러들을 제공합니다.
 */
export function useHandlers(options: UseHandlersOptions): UseHandlersReturn {
	const { inquiryId, inquiryState, ws } = options;
	const router = useRouter();

	const updateStatusMutation = useUpdateInquiryStatus();
	const updatePriorityMutation = useUpdateInquiryPriority();
	const assignMutation = useAssignInquiry();
	const updateInquiryMutation = useUpdateInquiry();
	const fillInquiryFormMutation = useFillInquiryFormWithAi();

	// 목록으로 이동
	const onClickBack = () => {
		router.push(ADMIN_PATHS.INQUIRIES as Route);
	};

	/**
	 * 상태 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateStatusMutation.mutateAsync({ inquiryId, status });
	 */
	const onChangeStatus = async (status: string) => {
		logger.info("상태 변경:", status);
		try {
			await updateStatusMutation.mutateAsync({
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
			logger.info("상태 변경 성공");
		} catch (error) {
			logger.error("상태 변경 실패:", String(error));
			throw error;
		}
	};

	/**
	 * 우선순위 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updatePriorityMutation.mutateAsync({ inquiryId, priority });
	 */
	const onChangePriority = async (priority: string) => {
		logger.info("우선순위 변경:", priority);
		try {
			await updatePriorityMutation.mutateAsync({
				inquiryId,
				data: { priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT" },
			});
			logger.info("우선순위 변경 성공");
		} catch (error) {
			logger.error("우선순위 변경 실패:", String(error));
			throw error;
		}
	};

	/**
	 * 카테고리 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, category });
	 */
	const onChangeCategory = async (category: string) => {
		logger.info("카테고리 변경:", category);
		try {
			await updateInquiryMutation.mutateAsync({
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
			logger.info("카테고리 변경 성공");
		} catch (error) {
			logger.error("카테고리 변경 실패:", String(error));
			throw error;
		}
	};

	/**
	 * 담당자 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await assignMutation.mutateAsync({ inquiryId, assigneeId });
	 */
	const onChangeAssignee = async (assigneeId: string) => {
		logger.info("담당자 변경:", assigneeId);
		try {
			await assignMutation.mutateAsync({
				inquiryId,
				data: { assigneeId },
			});
			logger.info("담당자 변경 성공");
		} catch (error) {
			logger.error("담당자 변경 실패:", String(error));
			throw error;
		}
	};

	/**
	 * 태그 추가
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, tags: [...currentTags, tag] });
	 */
	const onTagAdd = async (tag: string) => {
		logger.info("태그 추가:", tag);
		// TODO: Orval 훅 생성 후 아래 주석 해제
	};

	/**
	 * 태그 삭제
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, tags: currentTags.filter(t => t !== tag) });
	 */
	const onTagRemove = async (tag: string) => {
		logger.info("태그 삭제:", tag);
		// TODO: Orval 훅 생성 후 아래 주석 해제
	};

	/**
	 * 메시지 전송
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await sendMessageMutation.mutateAsync({ inquiryId, content, attachments });
	 */
	const onSubmitReply = (content: string, attachments?: File[]) => {
		const attachmentCount = attachments?.length ?? 0;
		logger.info("메시지 전송:", { content, attachmentCount });
		ws.sendMessage(content, attachments);
		inquiryState.setReplyContent("");
		// TODO: Orval 훅 생성 후 REST API로도 전송
		// try {
		// 	await sendMessageMutation.mutateAsync({ inquiryId, content, attachments });
		// } catch (error) {
		// 	logger.error("메시지 전송 실패:", error);
		// }
	};

	// 타이핑 시작
	const onTypingStart = () => {
		inquiryState.startTyping();
		ws.sendTypingStatus(true);
	};

	// 타이핑 중지
	const onTypingStop = () => {
		inquiryState.stopTyping();
		ws.sendTypingStatus(false);
	};

	/**
	 * AI 내용 생성
	 *
	 * 문의 폼 ai-fill endpoint를 활용하여 content patch를 생성합니다.
	 */
	const onClickGenerateDraft = async () => {
		logger.info("AI 내용 생성 요청");
		inquiryState.setGeneratingDraft(true);

		try {
			const result = await fillInquiryFormMutation.mutateAsync({
				data: {
					mode: "CREATE",
					schemaKey: "inquiry-intake-basic",
					selectedPaths: ["content"],
					currentObject: {
						title: `문의 ${inquiryId}`,
						content: inquiryState.replyContent,
						category: "GENERAL",
						priority: "NORMAL",
					},
				},
			});

			const patches = result?.data?.patches ?? [];
			const contentPatch = patches.find((patch) => patch.path === "content");
			if (typeof contentPatch?.value === "string") {
				inquiryState.setReplyContent(contentPatch.value);
			}
		} catch (error) {
			logger.error("AI 내용 생성 실패:", String(error));
		} finally {
			inquiryState.setGeneratingDraft(false);
		}
	};

	// 지식베이스 검색 모달 열기
	const onClickSearchKnowledge = () => {
		inquiryState.openKnowledgeBaseModal();
	};

	// 파일 첨부
	const onAttachFile = (files: File[]) => {
		const fileNames = files.map((f) => f.name);
		logger.info("파일 첨부:", fileNames.join(", "));
		// TODO: 파일 업로드 API 연동
	};

	// 수정 페이지 이동
	const onClickEdit = () => {
		router.push(
			ADMIN_PATHS.INQUIRIES_EDIT.replace("[inquiryId]", inquiryId) as Route,
		);
	};

	// 삭제 확인 모달 열기
	const onClickDelete = () => {
		inquiryState.openMetaEditModal(); // TODO: 삭제 모달로 변경 필요
	};

	// WebSocket 재연결
	const onClickReconnect = () => {
		logger.info("WebSocket 재연결 요청");
		// 재연결은 _client.tsx에서 처리
	};

	/**
	 * 삭제 확인
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await deleteInquiryMutation.mutateAsync({ inquiryId });
	 * router.push("/inquiries");
	 */
	const onConfirmDelete = async () => {
		logger.info("문의 삭제:", inquiryId);
		// TODO: Orval 훅 생성 후 아래 주석 해제
		// try {
		// 	await deleteInquiryMutation.mutateAsync({ inquiryId });
		// 	router.push("/inquiries");
		// } catch (error) {
		// 	logger.error("문의 삭제 실패:", error);
		// 	throw error;
		// }
	};

	return {
		onClickBack,
		onChangeStatus,
		onChangePriority,
		onChangeCategory,
		onChangeAssignee,
		onTagAdd,
		onTagRemove,
		onSubmitReply,
		onTypingStart,
		onTypingStop,
		onClickGenerateDraft,
		onClickSearchKnowledge,
		onAttachFile,
		onClickEdit,
		onClickDelete,
		onClickReconnect,
		deleteModal: {
			isOpen: inquiryState.isMetaEditModalOpen, // TODO: 삭제 모달 상태로 변경
			open: () => inquiryState.openMetaEditModal(),
			close: () => inquiryState.closeMetaEditModal(),
			confirm: onConfirmDelete,
		},
		knowledgeBaseModal: {
			isOpen: inquiryState.isKnowledgeBaseModalOpen,
			open: () => inquiryState.openKnowledgeBaseModal(),
			close: () => inquiryState.closeKnowledgeBaseModal(),
		},
	};
}
