"use client";

import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	useCreateInquiry,
} from "@cocrepo/api/core/inquiries";

import { ADMIN_PATHS } from "@cocrepo/constant";
import type { InquiryCreateAIFormSuggestion } from "./useInquiryCreateAIClassification";

export interface InquiryCreateFormData {
	customerId: string;
	title: string;
	content: string;
	category: string;
	channel: string;
	priority: string;
	assigneeId?: string;
}

interface LocalState {
	isSubmitting: boolean;
	aiSuggestion: InquiryCreateAIFormSuggestion | null;
	isAiLoading: boolean;
}

interface UseInquiryCreateHandlersProps {
	state: LocalState;
	router: {
		push: (url: string) => void;
	};
}

interface UseInquiryCreateHandlersReturn {
	onClickCancel: () => void;
	onSubmit: (data: InquiryCreateFormData) => Promise<void>;
	onClickSaveDraft: () => void;
}

function requireInquiryCategory(value: string): InquiryCategory {
	switch (value) {
		case InquiryCategory.GENERAL:
		case InquiryCategory.DELIVERY:
		case InquiryCategory.REFUND:
		case InquiryCategory.PRODUCT:
		case InquiryCategory.ACCOUNT:
		case InquiryCategory.TECHNICAL:
		case InquiryCategory.COMPLAINT:
		case InquiryCategory.OTHER:
			return value;
		default:
			throw new Error("유효하지 않은 문의 카테고리입니다.");
	}
}

function requireInquiryChannel(value: string): InquiryChannel {
	switch (value) {
		case InquiryChannel.WEB:
		case InquiryChannel.EMAIL:
		case InquiryChannel.CHAT:
		case InquiryChannel.SMS:
		case InquiryChannel.PHONE:
		case InquiryChannel.WALK_IN:
			return value;
		default:
			throw new Error("유효하지 않은 문의 채널입니다.");
	}
}

function requireInquiryPriority(value: string): InquiryPriority {
	switch (value) {
		case InquiryPriority.LOW:
		case InquiryPriority.NORMAL:
		case InquiryPriority.HIGH:
		case InquiryPriority.URGENT:
			return value;
		default:
			throw new Error("유효하지 않은 문의 우선순위입니다.");
	}
}

/** 문의 접수 페이지 이벤트 핸들러 훅입니다. */
export function useInquiryCreateHandlers({
	state,
	router,
}: UseInquiryCreateHandlersProps): UseInquiryCreateHandlersReturn {
	const createInquiryMutation = useCreateInquiry();

	/**
	 * 취소 버튼 클릭 - 목록으로 이동
	 */
	const onClickCancel = () => {
		router.push(ADMIN_PATHS.INQUIRIES);
	};

	/** 문의 접수를 제출합니다. */
	const onSubmit = async (data: InquiryCreateFormData) => {
		state.isSubmitting = true;

		try {
			const response = await createInquiryMutation.mutateAsync({
				data: {
					customerId: BigInt(data.customerId),
					title: data.title,
					content: data.content,
					category: requireInquiryCategory(data.category),
					channel: requireInquiryChannel(data.channel),
					priority: requireInquiryPriority(data.priority),
					assigneeId: data.assigneeId ? BigInt(data.assigneeId) : undefined,
				},
			});
			const createdInquiryId = response?.data?.id;
			if (createdInquiryId) {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						String(createdInquiryId),
					),
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
