"use client";

import { Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Button, Textarea } from "../../design-system/primitives";

export interface PromptFormProps {
	/** 메인 프롬프트 값 */
	prompt: string;
	/** 네거티브 프롬프트 값 (옵션) */
	negativePrompt?: string;
	/** 처리 중 여부 */
	isProcessing: boolean;
	/** 프롬프트 변경 핸들러 */
	onPromptChange: (value: string) => void;
	/** 네거티브 프롬프트 변경 핸들러 */
	onNegativePromptChange?: (value: string) => void;
	/** 제출 핸들러 */
	onSubmit: () => void;
	/** 프롬프트 라벨 */
	promptLabel?: string;
	/** 프롬프트 플레이스홀더 */
	promptPlaceholder?: string;
	/** 프롬프트 힌트 */
	promptHint?: string;
	/** 네거티브 프롬프트 라벨 */
	negativePromptLabel?: string;
	/** 네거티브 프롬프트 플레이스홀더 */
	negativePromptPlaceholder?: string;
	/** 네거티브 프롬프트 힌트 */
	negativePromptHint?: string;
	/** 제출 버튼 텍스트 */
	submitLabel?: string;
	/** 처리 중 버튼 텍스트 */
	processingLabel?: string;
	/** 제출 버튼 아이콘 */
	submitIcon?: ReactNode;
	/** 키보드 단축키 힌트 */
	shortcutHint?: string;
	/** 네거티브 프롬프트 표시 여부 */
	showNegativePrompt?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * PromptForm 컴포넌트
 * 메인 프롬프트와 선택적 네거티브 프롬프트를 입력받아 제출하는 폼입니다.
 * AI 이미지 생성 등에 사용됩니다.
 *
 * @example
 * ```tsx
 * <PromptForm
 *   prompt={prompt}
 *   negativePrompt={negativePrompt}
 *   isProcessing={isProcessing}
 *   onPromptChange={setPrompt}
 *   onNegativePromptChange={setNegativePrompt}
 *   onSubmit={handleGenerate}
 *   submitLabel="이미지 생성"
 * />
 * ```
 */
export const PromptForm = observer(
	({
		prompt,
		negativePrompt = "",
		isProcessing,
		onPromptChange,
		onNegativePromptChange,
		onSubmit,
		promptLabel = "프롬프트",
		promptPlaceholder = "내용을 입력하세요...",
		promptHint,
		negativePromptLabel = "네거티브 프롬프트 (선택)",
		negativePromptPlaceholder = "제외할 요소...",
		negativePromptHint,
		submitLabel = "생성",
		processingLabel = "처리 중...",
		submitIcon = <Sparkles className="w-4 h-4" />,
		shortcutHint = "⌘ + Enter로 빠르게 실행",
		showNegativePrompt = true,
		className = "",
	}: PromptFormProps) => {
		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" && e.metaKey && !isProcessing && prompt.trim()) {
				onSubmit();
			}
		};

		return (
			<div className={`space-y-4 ${className}`}>
				<div>
					<label className="block text-sm font-medium text-default-700 mb-2">
						{promptLabel}
					</label>
					<Textarea
						placeholder={promptPlaceholder}
						value={prompt}
						onValueChange={onPromptChange}
						onKeyDown={handleKeyDown}
						minRows={3}
						maxRows={6}
						variant="bordered"
						classNames={{
							input: "text-sm",
							inputWrapper: "bg-content1",
						}}
					/>
					{promptHint && (
						<p className="text-xs text-default-400 mt-1">{promptHint}</p>
					)}
				</div>

				{showNegativePrompt && onNegativePromptChange && (
					<div>
						<label className="block text-sm font-medium text-default-700 mb-2">
							{negativePromptLabel}
						</label>
						<Textarea
							placeholder={negativePromptPlaceholder}
							value={negativePrompt}
							onValueChange={onNegativePromptChange}
							minRows={2}
							maxRows={4}
							variant="bordered"
							classNames={{
								input: "text-sm",
								inputWrapper: "bg-content1",
							}}
						/>
						{negativePromptHint && (
							<p className="text-xs text-default-400 mt-1">
								{negativePromptHint}
							</p>
						)}
					</div>
				)}

				<Button
					color="primary"
					size="lg"
					className="w-full"
					isLoading={isProcessing}
					isDisabled={!prompt.trim() || isProcessing}
					onPress={onSubmit}
					startContent={!isProcessing && submitIcon}
				>
					{isProcessing ? processingLabel : submitLabel}
				</Button>

				{shortcutHint && (
					<p className="text-xs text-default-500 text-center">{shortcutHint}</p>
				)}
			</div>
		);
	},
);
