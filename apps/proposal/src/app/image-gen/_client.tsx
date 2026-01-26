"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { ImageIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
  GenerationProgress,
  HistoryPanel,
  ImageGallery,
  PromptInput,
} from "@/components/image-gen";
import { useImageGeneration } from "@/hooks/useImageGeneration";

export const ImageGenClient = observer(() => {
  const {
    prompt,
    negativePrompt,
    setPrompt,
    setNegativePrompt,
    isGenerating,
    status,
    currentImages,
    history,
    selectedHistory,
    generate,
    regenerate,
    selectHistory,
    deleteHistory,
    clearHistory,
  } = useImageGeneration();

  return (
    <div className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">이미지 생성</h1>
        </div>
        <p className="text-default-500">
          ComfyUI 기반 아이콘 및 이미지 생성
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 메인 영역 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 프롬프트 입력 */}
          <Card className="bg-content1 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold">프롬프트 입력</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <PromptInput
                prompt={prompt}
                negativePrompt={negativePrompt}
                isGenerating={isGenerating}
                onPromptChange={setPrompt}
                onNegativePromptChange={setNegativePrompt}
                onGenerate={generate}
              />
            </CardBody>
          </Card>

          {/* 진행률 표시 */}
          {status && status.status !== "completed" && (
            <GenerationProgress status={status} />
          )}

          {/* 결과 갤러리 */}
          {currentImages.length > 0 && (
            <Card className="bg-content1 shadow-sm">
              <CardBody className="p-6">
                <ImageGallery
                  images={currentImages}
                  prompt={selectedHistory?.prompt || prompt}
                  onRegenerate={regenerate}
                />
              </CardBody>
            </Card>
          )}

          {/* 빈 상태 */}
          {!isGenerating && currentImages.length === 0 && (
            <Card className="bg-content1/50 border-2 border-dashed border-divider">
              <CardBody className="py-16 text-center">
                <ImageIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
                <h3 className="text-lg font-medium text-default-600 mb-2">
                  이미지를 생성해보세요
                </h3>
                <p className="text-sm text-default-400 max-w-md mx-auto">
                  프롬프트를 입력하고 "이미지 생성" 버튼을 클릭하면
                  AI가 아이콘을 생성합니다.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* 사이드바 - 이력 */}
        <div className="lg:col-span-1">
          <Card className="bg-content1 shadow-sm sticky top-24 h-[calc(100vh-8rem)]">
            <CardBody className="p-4">
              <HistoryPanel
                items={history}
                selectedId={selectedHistory?.id}
                onSelect={selectHistory}
                onDelete={deleteHistory}
                onClearAll={clearHistory}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
});
