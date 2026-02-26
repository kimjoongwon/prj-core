import { ADMIN_PATHS } from "@cocrepo/constant";
import type { AIFormSuggestion, InquiryFormData } from "@cocrepo/ui";
import type { Observable } from "mobx";
import { useCallback } from "react";

// TODO: Orval 훅 생성 후 아래 import 추가
// import { useCreateInquiry, useGetUsers } from "@cocrepo/api";

interface LocalState {
	isSubmitting: boolean;
	aiSuggestion: AIFormSuggestion | null;
	isAiLoading: boolean;
}

interface UseHandlersProps {
	state: Observable<LocalState>;
	router: {
		push: (url: string) => void;
	};
}

interface UseHandlersReturn {
	onClickCancel: () => void;
	onSubmit: (data: InquiryFormData) => Promise<void>;
	onClickSaveDraft: () => void;
}

/**
 * 문의 접수 페이지 이벤트 핸들러 훅
 *
 * @requires Orval API 훅 생성 후 아래와 같이 변경:
 * 1. useCreateInquiry 훅 호출
 * 2. mutateAsync로 API 호출
 * 3. onSuccess에서 상세 페이지로 이동
 */
export function useHandlers({
	state,
	router,
}: UseHandlersProps): UseHandlersReturn {
	// TODO: Orval 훅 생성 후 아래 주석 해제
	// const createInquiryMutation = useCreateInquiry();

	/**
	 * 취소 버튼 클릭 - 목록으로 이동
	 */
	const onClickCancel = useCallback(() => {
		router.push(ADMIN_PATHS.INQUIRIES);
	}, [router]);

	/**
	 * 문의 접수 제출
	 *
	 * @requires Orval 훅 생성 후 아래와 같이 변경:
	 * const response = await createInquiryMutation.mutateAsync({
	 *   customerId: data.customerId,
	 *   title: data.title,
	 *   content: data.content,
	 *   category: data.category,
	 *   channel: data.channel,
	 *   priority: data.priority,
	 *   assigneeId: data.assigneeId,
	 *   attachmentUrls: data.attachmentUrls,
	 * });
	 * router.push(`${ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", response.id)}`);
	 */
	const onSubmit = useCallback(
		async (_data: InquiryFormData) => {
			state.isSubmitting = true;

			try {
				// TODO: Orval 훅 생성 후 아래 주석 해제
				// const response = await createInquiryMutation.mutateAsync({
				// 	data: {
				// 		customerId: data.customerId,
				// 		title: data.title,
				// 		content: data.content,
				// 		category: data.category,
				// 		channel: data.channel,
				// 		priority: data.priority,
				// 		assigneeId: data.assigneeId,
				// 		attachmentUrls: data.attachmentUrls,
				// 	},
				// });
				//
				// // 성공 시 상세 페이지로 이동
				// router.push(
				// 	`${ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", response.id)}`
				// );

				// Mock: 1초 대기 후 성공 처리 (삭제 필요)
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Mock: 목록으로 이동 (삭제 필요)
				router.push(ADMIN_PATHS.INQUIRIES);
			} catch (error) {
				console.error("문의 접수 실패:", error);
				// TODO: 에러 토스트 표시
			} finally {
				state.isSubmitting = false;
			}
		},
		[state, router],
	);

	/**
	 * 임시 저장
	 */
	const onClickSaveDraft = useCallback(() => {
		// TODO: localStorage에 임시 저장 로직 구현
		console.log("임시 저장");
	}, []);

	return {
		onClickCancel,
		onSubmit,
		onClickSaveDraft,
	};
}
