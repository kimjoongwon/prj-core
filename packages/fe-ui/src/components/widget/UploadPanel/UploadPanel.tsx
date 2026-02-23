"use client";

import { observer } from "mobx-react-lite";
import { Check } from "lucide-react";
import { DropZone } from "../../ui/DropZone";
import { UploadQueue, type UploadQueueItemData } from "../UploadQueue";
import { Button } from "../../inputs/Button/Button";

export interface UploadPanelProps {
  /** 파일 선택 핸들러 */
  onFilesSelected: (files: File[]) => void;
  /** 전체 취소 핸들러 */
  onCancelAll?: () => void;
  /** 실패 재시도 핸들러 */
  onRetryFailed?: () => void;
  /** 완료 핸들러 */
  onComplete?: () => void;
  /** 더 업로드 핸들러 */
  onUploadMore?: () => void;
  /** 개별 일시정지 핸들러 */
  onItemPause?: (id: string) => void;
  /** 개별 재개 핸들러 */
  onItemResume?: (id: string) => void;
  /** 개별 취소 핸들러 */
  onItemCancel?: (id: string) => void;
  /** 개별 재시도 핸들러 */
  onItemRetry?: (id: string) => void;
  /** 업로드 큐 항목 */
  queueItems?: UploadQueueItemData[];
  /** 허용 파일 타입 */
  accept?: string[];
  /** 최대 파일 크기 */
  maxFileSize?: number;
  /** 최대 파일 수 */
  maxFiles?: number;
  /** 다중 파일 허용 */
  multiple?: boolean;
  /** 큐 표시 여부 */
  showQueue?: boolean;
  /** 패널 상태 */
  status?: "idle" | "uploading" | "completed" | "failed";
  /** 완료된 파일 수 */
  completedCount?: number;
  /** 실패한 파일 수 */
  failedCount?: number;
  /** 추가 클래스 */
  className?: string;
}

/**
 * 파일 업로드를 위한 통합 패널 위젯
 */
export const UploadPanel = observer(
  ({
    onFilesSelected,
    onCancelAll,
    onRetryFailed,
    onComplete,
    onUploadMore,
    onItemPause,
    onItemResume,
    onItemCancel,
    onItemRetry,
    queueItems = [],
    accept,
    maxFileSize,
    maxFiles,
    multiple = true,
    showQueue = true,
    status = "idle",
    completedCount = 0,
    failedCount = 0,
    className,
  }: UploadPanelProps) => {
    const isUploading =
      status === "uploading" ||
      queueItems.some(
        (item) =>
          item.status === "uploading" ||
          item.status === "paused" ||
          item.status === "pending"
      );
    const isCompleted = status === "completed" || (queueItems.length > 0 && !isUploading);

    const getDropZoneTitle = () => {
      if (isUploading && queueItems.length > 0) {
        return "파일을 더 추가하세요";
      }
      return "파일을 드래그하여 업로드하세요";
    };

    // 완료 상태 렌더링
    if (isCompleted && !isUploading && queueItems.length > 0) {
      return (
        <div className={`flex flex-col gap-4 ${className}`}>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl">
            <Check className="w-6 h-6 text-success" />
            <div>
              <p className="font-medium text-success">업로드 완료</p>
              <p className="text-sm text-default-500">
                {completedCount || queueItems.length}개의 파일이 성공적으로
                업로드되었습니다.
              </p>
            </div>
          </div>

          {/* 완료된 목록 */}
          <div className="space-y-2">
            {queueItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 bg-content1 rounded-lg"
              >
                <Check
                  className={`w-4 h-4 ${
                    item.status === "completed"
                      ? "text-success"
                      : "text-danger"
                  }`}
                />
                <span className="text-sm truncate flex-1">{item.fileName}</span>
                <span className="text-xs text-default-400">
                  {formatFileSize(item.fileSize)}
                </span>
              </div>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            {onUploadMore && (
              <Button variant="flat" onClick={onUploadMore}>
                더 업로드하기
              </Button>
            )}
            {onComplete && (
              <Button color="primary" onClick={onComplete}>
                완료
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* 드롭존 */}
        <DropZone
          onDrop={onFilesSelected}
          accept={accept}
          maxFileSize={maxFileSize}
          multiple={multiple}
          title={getDropZoneTitle()}
        />

        {/* 업로드 큐 */}
        {showQueue && queueItems.length > 0 && (
          <UploadQueue
            items={queueItems}
            onCancelAll={onCancelAll}
            onRetryFailed={onRetryFailed}
            onItemPause={onItemPause}
            onItemResume={onItemResume}
            onItemCancel={onItemCancel}
            onItemRetry={onItemRetry}
          />
        )}
      </div>
    );
  }
);

UploadPanel.displayName = "UploadPanel";

// 파일 크기 포맷팅 유틸리티
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
