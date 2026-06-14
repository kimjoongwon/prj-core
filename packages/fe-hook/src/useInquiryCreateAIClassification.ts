import { useRef } from "react";

export interface InquiryCreateAIFormSuggestion {
	category: string;
	categoryName: string;
	priority: string;
	priorityName: string;
	confidence: number;
	suggestedTags: string[];
}

interface UseInquiryCreateAIClassificationProps {
	/** AI 분류 결과 콜백 */
	onResult: (result: InquiryCreateAIFormSuggestion) => void;
	/** AI 분류 에러 콜백 */
	onError: (error: Error) => void;
	/** 디바운스 시간 (ms) */
	debounceMs?: number;
}

interface UseInquiryCreateAIClassificationReturn {
	/** AI 분류 요청 */
	classify: (content: string) => void;
	/** 수동 AI 분류 요청 (버튼 클릭용) */
	classifyManually: (title: string, content: string) => void;
	/** 분류 취소 */
	cancel: () => void;
}

type InquiryCategory =
	| "GENERAL"
	| "DELIVERY"
	| "PAYMENT"
	| "REFUND"
	| "PRODUCT"
	| "ACCOUNT"
	| "TECHNICAL"
	| "COMPLAINT"
	| "OTHER";
type InquiryPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

/**
 * Mock AI 분류 결과 생성
 * TODO: 실제 API 호출로 교체
 */
const generateMockAIClassification = (
	content: string,
): InquiryCreateAIFormSuggestion => {
	const lowerContent = content.toLowerCase();

	// 키워드 기반 카테고리 추천
	let category: InquiryCategory = "GENERAL";
	let categoryName = "일반";
	let priority: InquiryPriority = "NORMAL";
	let priorityName = "보통";
	const suggestedTags: string[] = [];

	if (lowerContent.includes("배송") || lowerContent.includes("택배")) {
		category = "DELIVERY";
		categoryName = "배송";
		suggestedTags.push("배송");
	}
	if (lowerContent.includes("결제") || lowerContent.includes("결재")) {
		category = "PAYMENT";
		categoryName = "결제";
		suggestedTags.push("결제");
	}
	if (lowerContent.includes("환불") || lowerContent.includes("취소")) {
		category = "REFUND";
		categoryName = "환불/취소";
		suggestedTags.push("환불");
	}
	if (lowerContent.includes("상품") || lowerContent.includes("제품")) {
		category = "PRODUCT";
		categoryName = "상품";
		suggestedTags.push("상품");
	}
	if (lowerContent.includes("계정") || lowerContent.includes("로그인")) {
		category = "ACCOUNT";
		categoryName = "계정";
		suggestedTags.push("계정");
	}
	if (
		lowerContent.includes("불편") ||
		lowerContent.includes("불만") ||
		lowerContent.includes("불평")
	) {
		category = "COMPLAINT";
		categoryName = "불만/불편";
		suggestedTags.push("불만");
	}

	// 감정 기반 우선순위 추천
	if (
		lowerContent.includes("긴급") ||
		lowerContent.includes("빨리") ||
		lowerContent.includes("당장")
	) {
		priority = "URGENT";
		priorityName = "긴급";
		suggestedTags.push("긴급");
	} else if (
		lowerContent.includes("화나") ||
		lowerContent.includes("짜증") ||
		lowerContent.includes("불만")
	) {
		priority = "HIGH";
		priorityName = "높음";
		suggestedTags.push("불만고객");
	} else if (lowerContent.includes("궁금") || lowerContent.includes("문의")) {
		priority = "NORMAL";
		priorityName = "보통";
	}

	// 신뢰도 계산 (내용 길이 기반)
	const confidence = Math.min(95, 50 + content.length / 5);

	return {
		category,
		categoryName,
		priority,
		priorityName,
		confidence: Math.round(confidence),
		suggestedTags: Array.from(new Set(suggestedTags)), // 중복 제거
	};
};

/**
 * AI 분류 추천 훅
 * 문의 내용을 분석하여 카테고리, 우선순위를 추천합니다.
 */
export function useInquiryCreateAIClassification({
	onResult,
	onError,
	debounceMs = 1000,
}: UseInquiryCreateAIClassificationProps): UseInquiryCreateAIClassificationReturn {
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * AI 분류 요청
	 */
	const classify = (content: string) => {
		// 기존 타이머 취소
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// 기존 요청 취소
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// 내용이 너무 짧으면 분류하지 않음
		if (content.length < 50) {
			return;
		}

		// 디바운스 적용
		debounceTimerRef.current = setTimeout(async () => {
			abortControllerRef.current = new AbortController();

			try {
				// TODO: 실제 API 호출
				// const response = await postInquiryDraft(
				// 	{ content },
				// 	{ signal: abortControllerRef.current.signal }
				// );
				// onResult(response);

				// Mock: 500ms 후 결과 반환
				await new Promise((resolve) => setTimeout(resolve, 500));

				const result = generateMockAIClassification(content);
				onResult(result);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					onError(error);
				}
			}
		}, debounceMs);
	};

	/**
	 * 수동 AI 분류 요청 (버튼 클릭용)
	 */
	const classifyManually = (title: string, content: string) => {
		// 기존 요청 취소
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		abortControllerRef.current = new AbortController();

		(async () => {
			try {
				// TODO: 실제 API 호출
				// const response = await postInquiryDraft(
				// 	{ title, content },
				// 	{ signal: abortControllerRef.current.signal }
				// );
				// onResult(response);

				// Mock: 500ms 후 결과 반환
				await new Promise((resolve) => setTimeout(resolve, 500));

				const combinedContent = `${title}\n\n${content}`;
				const result = generateMockAIClassification(combinedContent);
				onResult(result);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					onError(error);
				}
			}
		})();
	};

	/**
	 * 분류 취소
	 */
	const cancel = () => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
	};

	return {
		classify,
		classifyManually,
		cancel,
	};
}
