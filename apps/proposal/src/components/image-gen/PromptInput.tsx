"use client";

import { PromptForm } from "@cocrepo/ui";
import { Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";

interface PromptInputProps {
	prompt: string;
	negativePrompt: string;
	isGenerating: boolean;
	onPromptChange: (value: string) => void;
	onNegativePromptChange: (value: string) => void;
	onGenerate: () => void;
}

/**
 * 이미지 생성용 프롬프트 입력 컴포넌트
 * PromptForm을 이미지 생성에 맞게 커스터마이징
 */
export const PromptInput = observer(
	({
		prompt,
		negativePrompt,
		isGenerating,
		onPromptChange,
		onNegativePromptChange,
		onGenerate,
	}: PromptInputProps) => {
		return (
			<PromptForm
				prompt={prompt}
				negativePrompt={negativePrompt}
				isProcessing={isGenerating}
				onPromptChange={onPromptChange}
				onNegativePromptChange={onNegativePromptChange}
				onSubmit={onGenerate}
				promptLabel="프롬프트"
				promptPlaceholder="생성할 아이콘을 설명하세요... (예: delivery motorcycle, red color)"
				promptHint="기본 스타일: flat icon, minimalist, clean lines"
				negativePromptLabel="네거티브 프롬프트 (선택)"
				negativePromptPlaceholder="제외할 요소... (예: realistic, complex)"
				negativePromptHint="기본 제외: blurry, low quality, watermark, text"
				submitLabel="이미지 생성"
				processingLabel="생성 중..."
				submitIcon={<Sparkles className="w-4 h-4" />}
				shortcutHint="⌘ + Enter로 빠르게 생성"
			/>
		);
	},
);
