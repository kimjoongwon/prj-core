"use client";

import { useInquiryStore } from "@cocrepo/store";
import { createLogger } from "@cocrepo/toolkit";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { UseInquiryWebSocketReturn } from "./useInquiryWebSocket";

// TODO: Orval 훅 생성 후 아래 import 추가
// import {
// 	useUpdateInquiry,
// 	useUpdateInquiryStatus,
// 	useUpdateInquiryPriority,
// 	useAssignInquiry,
// 	useSendInquiryMessage,
// 	useGenerateAIDraft,
// 	useDeleteInquiry,
// } from "@cocrepo/api";

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
	const { inquiryId, ws } = options;
	const router = useRouter();
	const store = useInquiryStore();

	// TODO: Orval 훅 생성 후 아래 주석 해제
	// const updateStatusMutation = useUpdateInquiryStatus();
	// const updatePriorityMutation = useUpdateInquiryPriority();
	// const assignMutation = useAssignInquiry();
	// const updateInquiryMutation = useUpdateInquiry();
	// const deleteInquiryMutation = useDeleteInquiry();
	// const sendMessageMutation = useSendInquiryMessage();
	// const generateDraftMutation = useGenerateAIDraft();

	// 목록으로 이동
	const onClickBack = useCallback(() => {
		router.push("/inquiries");
	}, [router]);

	/**
	 * 상태 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateStatusMutation.mutateAsync({ inquiryId, status });
	 */
	const onChangeStatus = useCallback(
		async (status: string) => {
			logger.info("상태 변경:", status);
			// TODO: Orval 훅 생성 후 아래 주석 해제
			// try {
			// 	await updateStatusMutation.mutateAsync({ inquiryId, status });
			// 	logger.info("상태 변경 성공");
			// } catch (error) {
			// 	logger.error("상태 변경 실패:", error);
			// 	throw error;
			// }
		},
		[inquiryId],
	);

	/**
	 * 우선순위 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updatePriorityMutation.mutateAsync({ inquiryId, priority });
	 */
	const onChangePriority = useCallback(
		async (priority: string) => {
			logger.info("우선순위 변경:", priority);
			// TODO: Orval 훅 생성 후 아래 주석 해제
			// try {
			// 	await updatePriorityMutation.mutateAsync({ inquiryId, priority });
			// 	logger.info("우선순위 변경 성공");
			// } catch (error) {
			// 	logger.error("우선순위 변경 실패:", error);
			// 	throw error;
			// }
		},
		[inquiryId],
	);

	/**
	 * 카테고리 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, category });
	 */
	const onChangeCategory = useCallback(
		async (category: string) => {
			logger.info("카테고리 변경:", category);
			// TODO: Orval 훅 생성 후 아래 주석 해제
			// try {
			// 	await updateInquiryMutation.mutateAsync({ inquiryId, data: { category } });
			// 	logger.info("카테고리 변경 성공");
			// } catch (error) {
			// 	logger.error("카테고리 변경 실패:", error);
			// 	throw error;
			// }
		},
		[inquiryId],
	);

	/**
	 * 담당자 변경
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await assignMutation.mutateAsync({ inquiryId, assigneeId });
	 */
	const onChangeAssignee = useCallback(
		async (assigneeId: string) => {
			logger.info("담당자 변경:", assigneeId);
			// TODO: Orval 훅 생성 후 아래 주석 해제
			// try {
			// 	await assignMutation.mutateAsync({ inquiryId, assigneeId });
			// 	logger.info("담당자 변경 성공");
			// } catch (error) {
			// 	logger.error("담당자 변경 실패:", error);
			// 	throw error;
			// }
		},
		[inquiryId],
	);

	/**
	 * 태그 추가
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, tags: [...currentTags, tag] });
	 */
	const onTagAdd = useCallback(
		async (tag: string) => {
			logger.info("태그 추가:", tag);
			// TODO: Orval 훅 생성 후 아래 주석 해제
		},
		[inquiryId],
	);

	/**
	 * 태그 삭제
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await updateInquiryMutation.mutateAsync({ inquiryId, tags: currentTags.filter(t => t !== tag) });
	 */
	const onTagRemove = useCallback(
		async (tag: string) => {
			logger.info("태그 삭제:", tag);
			// TODO: Orval 훅 생성 후 아래 주석 해제
		},
		[inquiryId],
	);

	/**
	 * 메시지 전송
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await sendMessageMutation.mutateAsync({ inquiryId, content, attachments });
	 */
	const onSubmitReply = useCallback(
		(content: string, attachments?: File[]) => {
			const attachmentCount = attachments?.length ?? 0;
			logger.info("메시지 전송:", { content, attachmentCount });
			ws.sendMessage(content, attachments);
			store.setReplyContent("");
			// TODO: Orval 훅 생성 후 REST API로도 전송
			// try {
			// 	await sendMessageMutation.mutateAsync({ inquiryId, content, attachments });
			// } catch (error) {
			// 	logger.error("메시지 전송 실패:", error);
			// }
		},
		[ws, store],
	);

	// 타이핑 시작
	const onTypingStart = useCallback(() => {
		store.startTyping();
		ws.sendTypingStatus(true);
	}, [ws, store]);

	// 타이핑 중지
	const onTypingStop = useCallback(() => {
		store.stopTyping();
		ws.sendTypingStatus(false);
	}, [ws, store]);

	/**
	 * AI 초안 생성
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * const result = await generateDraftMutation.mutateAsync({ inquiryId });
	 * store.setReplyContent(result.content);
	 */
	const onClickGenerateDraft = useCallback(async () => {
		logger.info("AI 초안 생성 요청");
		store.setGeneratingDraft(true);

		try {
			// TODO: Orval 훅 생성 후 아래 주석 해제
			// const result = await generateDraftMutation.mutateAsync({ inquiryId });
			// store.setReplyContent(result.content);

			// 임시: 더미 초안
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const dummyDraft = "안녕하세요, 문의해 주셔서 감사합니다.\n\n확인 후 답변 드리겠습니다.";
			store.setReplyContent(dummyDraft);
		} catch (error) {
			logger.error("AI 초안 생성 실패:", error);
		} finally {
			store.setGeneratingDraft(false);
		}
	}, [inquiryId, store]);

	// 지식베이스 검색 모달 열기
	const onClickSearchKnowledge = useCallback(() => {
		store.openKnowledgeBaseModal();
	}, [store]);

	// 파일 첨부
	const onAttachFile = useCallback((files: File[]) => {
		const fileNames = files.map((f) => f.name);
		logger.info("파일 첨부:", fileNames.join(", "));
		// TODO: 파일 업로드 API 연동
	}, []);

	// 수정 페이지 이동
	const onClickEdit = useCallback(() => {
		router.push(`/inquiries/${inquiryId}/edit`);
	}, [router, inquiryId]);

	// 삭제 확인 모달 열기
	const onClickDelete = useCallback(() => {
		store.openMetaEditModal(); // TODO: 삭제 모달로 변경 필요
	}, [store]);

	// WebSocket 재연결
	const onClickReconnect = useCallback(() => {
		logger.info("WebSocket 재연결 요청");
		// 재연결은 _client.tsx에서 처리
	}, []);

	/**
	 * 삭제 확인
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * await deleteInquiryMutation.mutateAsync({ inquiryId });
	 * router.push("/inquiries");
	 */
	const onConfirmDelete = useCallback(async () => {
		logger.info("문의 삭제:", inquiryId);
		// TODO: Orval 훅 생성 후 아래 주석 해제
		// try {
		// 	await deleteInquiryMutation.mutateAsync({ inquiryId });
		// 	router.push("/inquiries");
		// } catch (error) {
		// 	logger.error("문의 삭제 실패:", error);
		// 	throw error;
		// }
	}, [inquiryId, router]);

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
			isOpen: store.isMetaEditModalOpen, // TODO: 삭제 모달 상태로 변경
			open: () => store.openMetaEditModal(),
			close: () => store.closeMetaEditModal(),
			confirm: onConfirmDelete,
		},
		knowledgeBaseModal: {
			isOpen: store.isKnowledgeBaseModalOpen,
			open: () => store.openKnowledgeBaseModal(),
			close: () => store.closeKnowledgeBaseModal(),
		},
	};
}
