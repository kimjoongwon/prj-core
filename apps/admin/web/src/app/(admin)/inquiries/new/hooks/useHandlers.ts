import { useCreateInquiry } from "@cocrepo/api/core/inquiries";

import { ADMIN_PATHS } from "@cocrepo/constant";
import type { AIFormSuggestion, InquiryFormData } from "@cocrepo/ui";

interface LocalState {
	isSubmitting: boolean;
	aiSuggestion: AIFormSuggestion | null;
	isAiLoading: boolean;
}

interface UseHandlersProps {
	state: LocalState;
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
	const createInquiryMutation = useCreateInquiry();

	/**
	 * 취소 버튼 클릭 - 목록으로 이동
	 */
	const onClickCancel = () => {
		router.push(ADMIN_PATHS.INQUIRIES);
	};

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
	const onSubmit = async (data: InquiryFormData) => {
		state.isSubmitting = true;

		try {
			const response = await createInquiryMutation.mutateAsync({
				data: {
					customerId: data.customerId,
					title: data.title,
					content: data.content,
					category: data.category as
						| "GENERAL"
						| "DELIVERY"
						| "PAYMENT"
						| "REFUND"
						| "PRODUCT"
						| "ACCOUNT"
						| "TECHNICAL"
						| "COMPLAINT"
						| "OTHER",
					channel: data.channel as
						| "WEB"
						| "EMAIL"
						| "CHAT"
						| "SMS"
						| "PHONE"
						| "WALK_IN",
					priority: data.priority as "LOW" | "NORMAL" | "HIGH" | "URGENT",
					assigneeId: data.assigneeId || undefined,
				},
			});
			const createdInquiryId = response?.data?.id;
			if (createdInquiryId) {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", createdInquiryId),
				);
				return;
			}
			router.push(ADMIN_PATHS.INQUIRIES);
		} catch (error) {
			console.error("문의 접수 실패:", error);
			// TODO: 에러 토스트 표시
		} finally {
			state.isSubmitting = false;
		}
	};

	/**
	 * 임시 저장
	 */
	const onClickSaveDraft = () => {
		// TODO: localStorage에 임시 저장 로직 구현
		console.log("임시 저장");
	};

	return {
		onClickCancel,
		onSubmit,
		onClickSaveDraft,
	};
}
