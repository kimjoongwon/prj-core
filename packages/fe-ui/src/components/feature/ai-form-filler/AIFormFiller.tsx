"use client";

import { useAIFormTemplateStore } from "@cocrepo/store";
import type { AIFormPreviewResponse } from "@cocrepo/type";
import {
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { AIFormSelector } from "../../widget/AIFormSelector";
import { useAIFormFill } from "./hooks/use-ai-form-fill";

export interface AIFormFillerProps {
	/** 대상 도메인 (예: "Inquiry") */
	domain: string;
	/** 현재 폼 값 */
	currentValues: Record<string, unknown>;
	/** 적용 콜백 */
	onApply: (values: Record<string, unknown>) => void;
	/** 필드명 → 레이블 매핑 */
	fieldLabels?: Record<string, string>;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** AI 미리보기 실행 함수 (API 호출) */
	onPreviewAI: (
		templateId: string,
		context: Record<string, unknown>,
		userPrompt?: string,
	) => Promise<AIFormPreviewResponse>;
}

/**
 * AIFormFiller Feature 컴포넌트
 *
 * AI 템플릿을 선택하고, 사용자 프롬프트를 입력한 후
 * AI가 폼 필드를 자동으로 채우도록 도와주는 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <AIFormFiller
 *   domain="Inquiry"
 *   currentValues={{ title: "", content: "" }}
 *   onApply={(values) => form.setValues(values)}
 *   fieldLabels={{ title: "제목", content: "내용" }}
 *   onPreviewAI={handlePreviewAI}
 * />
 * ```
 */
export const AIFormFiller = observer(
	({
		domain,
		currentValues,
		onApply,
		fieldLabels = {},
		disabled = false,
		onPreviewAI,
	}: AIFormFillerProps) => {
		const store = useAIFormTemplateStore();
		const [userPrompt, setUserPrompt] = useState("");

		const {
			selectedTemplate,
			isLoading,
			previewResult,
			isModalOpen,
			errorMessage,
			handleSelectTemplate,
			handleExecuteAI,
			handleApply,
			handleModalClose,
		} = useAIFormFill({
			domain,
			store,
			currentValues,
			fieldLabels,
			onApply,
			onPreviewAI,
		});

		const domainTemplates = store.getTemplatesByDomain(domain);

		const handleExecuteWithPrompt = () => {
			handleExecuteAI(userPrompt);
		};

		return (
			<>
				<HStack gap={3} alignItems="center" fullWidth>
					{/* AI 폼 선택 */}
					<AIFormSelector
						domain={domain}
						templates={domainTemplates}
						selectedTemplateId={selectedTemplate?.id}
						onSelect={handleSelectTemplate}
						disabled={disabled || isLoading}
						placeholder="AI 폼 선택"
						classNames={{
							base: "flex-shrink-0",
						}}
					/>

					{/* 사용자 프롬프트 입력 */}
					<Input
						placeholder="추가 요청사항 입력 (선택)"
						value={userPrompt}
						onValueChange={setUserPrompt}
						isDisabled={disabled || isLoading}
						isClearable
						onClear={() => setUserPrompt("")}
						classNames={{
							base: "flex-1 min-w-[200px]",
							inputWrapper: "h-10",
						}}
					/>

					{/* AI 채우기 실행 버튼 */}
					<Button
						color="primary"
						variant="flat"
						onPress={handleExecuteWithPrompt}
						isDisabled={disabled || isLoading || !selectedTemplate}
						isLoading={isLoading}
						startContent={!isLoading && <Sparkles className="size-4" />}
						className="flex-shrink-0"
					>
						AI 채우기
					</Button>
				</HStack>

				{/* AI 미리보기 모달 */}
				<Modal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					size="2xl"
					scrollBehavior="inside"
				>
					<ModalContent>
						<ModalHeader>AI 폼 채우기 미리보기</ModalHeader>
						<ModalBody>
							{errorMessage && (
								<p className="text-sm text-danger">{errorMessage}</p>
							)}

							{isLoading && (
								<VStack
									gap={4}
									alignItems="center"
									justifyContent="center"
									className="py-8"
								>
									<Spinner size="lg" />
									<span className="text-sm text-default-500">
										AI가 폼을 채우는 중입니다...
									</span>
								</VStack>
							)}

							{!isLoading && previewResult && (
								<VStack gap={4}>
									{/* 신뢰도 표시 */}
									{previewResult.confidence && (
										<HStack gap={2} alignItems="center">
											<span className="text-sm text-default-500">신뢰도:</span>
											<Chip
												size="sm"
												color={
													previewResult.confidence > 0.8
														? "success"
														: previewResult.confidence > 0.5
															? "warning"
															: "danger"
												}
												variant="flat"
											>
												{Math.round(previewResult.confidence * 100)}%
											</Chip>
										</HStack>
									)}

									{/* 필드별 결과 */}
									<VStack gap={3}>
										{previewResult.results.map((result) => (
											<VStack key={result.fieldName} gap={1}>
												<span className="text-sm font-semibold text-foreground">
													{fieldLabels[result.fieldName] ?? result.fieldLabel}
												</span>
												<div className="rounded-lg border border-divider bg-content2 p-3">
													<p className="text-sm text-foreground whitespace-pre-wrap">
														{String(result.value)}
													</p>
												</div>
												{result.reason && (
													<span className="text-xs text-default-400">
														이유: {result.reason}
													</span>
												)}
											</VStack>
										))}
									</VStack>

									{/* 제안 사항 */}
									{previewResult.suggestions &&
										previewResult.suggestions.length > 0 && (
											<VStack gap={2}>
												<span className="text-sm font-semibold text-foreground">
													제안 사항
												</span>
												<VStack gap={1}>
													{previewResult.suggestions.map((suggestion, idx) => (
														<span
															key={idx}
															className="text-sm text-default-600"
														>
															- {suggestion}
														</span>
													))}
												</VStack>
											</VStack>
										)}
								</VStack>
							)}
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={handleModalClose}>
								취소
							</Button>
							{!isLoading && previewResult && (
								<Button color="primary" onPress={handleApply}>
									적용
								</Button>
							)}
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	},
);

AIFormFiller.displayName = "AIFormFiller";
