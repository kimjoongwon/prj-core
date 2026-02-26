"use client";

import type { AIFormTemplateStore } from "@cocrepo/store";
import type { AIFormPreviewResponse, AIFormTemplate } from "@cocrepo/type";
import { useCallback, useState } from "react";

export interface UseAIFormFillParams {
	/** 대상 도메인 */
	domain: string;
	/** AI 폼 템플릿 Store */
	store: AIFormTemplateStore;
	/** 현재 폼 값 */
	currentValues: Record<string, unknown>;
	/** 필드명 → 레이블 매핑 */
	fieldLabels?: Record<string, string>;
	/** 적용 콜백 */
	onApply: (values: Record<string, unknown>) => void;
	/** AI 미리보기 실행 함수 */
	onPreviewAI: (
		templateId: string,
		context: Record<string, unknown>,
		userPrompt?: string,
	) => Promise<AIFormPreviewResponse>;
}

export interface UseAIFormFillReturn {
	/** 선택된 템플릿 */
	selectedTemplate: AIFormTemplate | null;
	/** 로딩 상태 */
	isLoading: boolean;
	/** 미리보기 결과 */
	previewResult: AIFormPreviewResponse | null;
	/** 모달 열림 상태 */
	isModalOpen: boolean;
	/** 에러 메시지 */
	errorMessage: string | null;
	/** 템플릿 선택 핸들러 */
	handleSelectTemplate: (template: AIFormTemplate) => void;
	/** AI 실행 핸들러 */
	handleExecuteAI: (userPrompt?: string) => Promise<void>;
	/** 적용 핸들러 */
	handleApply: () => void;
	/** 모달 닫기 핸들러 */
	handleModalClose: () => void;
}

/**
 * AI 폼 채우기 기능을 위한 커스텀 훅
 *
 * 템플릿 선택, AI 미리보기 실행, 결과 적용 로직을 관리합니다.
 */
export function useAIFormFill({
	domain,
	store,
	currentValues,
	fieldLabels = {},
	onApply,
	onPreviewAI,
}: UseAIFormFillParams): UseAIFormFillReturn {
	const [selectedTemplate, setSelectedTemplate] =
		useState<AIFormTemplate | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [previewResult, setPreviewResult] =
		useState<AIFormPreviewResponse | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	/**
	 * 템플릿 선택 핸들러
	 */
	const handleSelectTemplate = useCallback(
		(template: AIFormTemplate) => {
			setSelectedTemplate(template);
			store.setCurrentTemplate(template);
			setErrorMessage(null);
			setPreviewResult(null);
		},
		[store],
	);

	/**
	 * AI 실행 핸들러
	 * 미리보기 API를 호출하고 결과를 표시합니다.
	 */
	const handleExecuteAI = useCallback(
		async (userPrompt?: string) => {
			if (!selectedTemplate) {
				setErrorMessage("템플릿을 선택해주세요.");
				return;
			}

			setIsLoading(true);
			setErrorMessage(null);
			setIsModalOpen(true);

			try {
				// 컨텍스트 구성
				const context: Record<string, unknown> = {
					...currentValues,
					_domain: domain,
					_fieldLabels: fieldLabels,
				};

				// AI 미리보기 API 호출
				const result = await onPreviewAI(
					selectedTemplate.id,
					context,
					userPrompt,
				);

				setPreviewResult(result);
				store.setPreviewResult(result);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "AI 실행 중 오류가 발생했습니다.";
				setErrorMessage(message);
				store.setError(message);
			} finally {
				setIsLoading(false);
			}
		},
		[selectedTemplate, currentValues, domain, fieldLabels, store, onPreviewAI],
	);

	/**
	 * 적용 핸들러
	 * 미리보기 결과를 폼에 적용합니다.
	 */
	const handleApply = useCallback(() => {
		if (!previewResult) {
			setErrorMessage("적용할 결과가 없습니다.");
			return;
		}

		// 결과를 필드명 기준으로 변환
		const valuesToApply: Record<string, unknown> = {};
		for (const result of previewResult.results) {
			valuesToApply[result.fieldName] = result.value;
		}

		// 부모 컴포넌트에 전달
		onApply(valuesToApply);

		// 모달 닫기 및 상태 초기화
		setIsModalOpen(false);
		setPreviewResult(null);
		store.clearResult();
	}, [previewResult, onApply, store]);

	/**
	 * 모달 닫기 핸들러
	 */
	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		setErrorMessage(null);
	}, []);

	return {
		selectedTemplate,
		isLoading,
		previewResult,
		isModalOpen,
		errorMessage,
		handleSelectTemplate,
		handleExecuteAI,
		handleApply,
		handleModalClose,
	};
}
