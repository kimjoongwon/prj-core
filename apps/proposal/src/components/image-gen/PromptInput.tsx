"use client";

import { Button, Textarea } from "@heroui/react";
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

export const PromptInput = observer(({
  prompt,
  negativePrompt,
  isGenerating,
  onPromptChange,
  onNegativePromptChange,
  onGenerate,
}: PromptInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey && !isGenerating && prompt.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-default-700 mb-2">
          프롬프트
        </label>
        <Textarea
          placeholder="생성할 아이콘을 설명하세요... (예: delivery motorcycle, red color)"
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
        <p className="text-xs text-default-400 mt-1">
          기본 스타일: flat icon, minimalist, clean lines
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-default-700 mb-2">
          네거티브 프롬프트 (선택)
        </label>
        <Textarea
          placeholder="제외할 요소... (예: realistic, complex)"
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
        <p className="text-xs text-default-400 mt-1">
          기본 제외: blurry, low quality, watermark, text
        </p>
      </div>

      <Button
        color="primary"
        size="lg"
        className="w-full"
        isLoading={isGenerating}
        isDisabled={!prompt.trim() || isGenerating}
        onPress={onGenerate}
        startContent={!isGenerating && <Sparkles className="w-4 h-4" />}
      >
        {isGenerating ? "생성 중..." : "이미지 생성"}
      </Button>

      <p className="text-xs text-default-500 text-center">
        ⌘ + Enter로 빠르게 생성
      </p>
    </div>
  );
});
