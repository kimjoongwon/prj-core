"use client";

import { Pause, Play, X, RotateCcw, Check, AlertCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Progress } from "@heroui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileIcon } from "../FileIcon";

const uploadQueueItemStyles = cva(
  "flex flex-col p-3 rounded-lg border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-content1 border-divider",
        compact: "bg-content1 border-divider p-2",
      },
      status: {
        pending: "opacity-70",
        uploading: "border-primary/30",
        paused: "border-warning/30",
        completed: "border-success/30",
        failed: "border-danger/30 bg-danger/5",
      },
    },
    defaultVariants: {
      variant: "default",
      status: "pending",
    },
  }
);

export type UploadStatus =
  | "pending"
  | "uploading"
  | "paused"
  | "completed"
  | "failed";
export type UploadQueueItemVariant = VariantProps<
  typeof uploadQueueItemStyles
>["variant"];

export interface UploadQueueItemProps {
  /** 항목 고유 ID */
  id: string;
  /** 파일 객체 */
  file: File;
  /** 파일명 */
  fileName: string;
  /** 파일 크기 (bytes) */
  fileSize: number;
  /** 진행률 (0-100) */
  progress?: number;
  /** 업로드 상태 */
  status: UploadStatus;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 일시정지 핸들러 */
  onPause?: () => void;
  /** 재개 핸들러 */
  onResume?: () => void;
  /** 취소 핸들러 */
  onCancel?: () => void;
  /** 재시도 핸들러 */
  onRetry?: () => void;
  /** 썸네일 표시 여부 */
  showThumbnail?: boolean;
  /** 컴포넌트 변형 */
  variant?: UploadQueueItemVariant;
  /** 추가 클래스 */
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getProgressColor = (
  status: UploadStatus
): "primary" | "warning" | "success" | "danger" | "default" => {
  switch (status) {
    case "uploading":
      return "primary";
    case "paused":
      return "warning";
    case "completed":
      return "success";
    case "failed":
      return "danger";
    default:
      return "default";
  }
};

/**
 * 업로드 큐의 개별 파일 항목을 표시하는 컴포넌트
 */
export const UploadQueueItem = observer(
  ({
    file,
    fileName,
    fileSize,
    progress = 0,
    status,
    errorMessage,
    onPause,
    onResume,
    onCancel,
    onRetry,
    showThumbnail = false,
    variant = "default",
    className,
  }: UploadQueueItemProps) => {
    const displayProgress = status === "completed" ? 100 : progress;
    const progressPercent = `${Math.round(displayProgress)}%`;

    return (
      <div
        className={uploadQueueItemStyles({ variant, status, className })}
        role="listitem"
        aria-label={`${fileName} - ${status}`}
      >
        <div className="flex items-center gap-3">
          {/* 파일 아이콘/썸네일 */}
          <div className="flex-shrink-0">
            {showThumbnail && file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={fileName}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <FileIcon mimeType={file.type} fileName={fileName} size="lg" />
            )}
          </div>

          {/* 파일 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium truncate">{fileName}</span>
              <span className="flex-shrink-0 text-xs text-default-400">
                {formatFileSize(fileSize)}
              </span>
            </div>

            {/* 진행률 바 */}
            {status !== "pending" && (
              <div className="mt-2 flex items-center gap-2">
                <Progress
                  value={displayProgress}
                  color={getProgressColor(status)}
                  size="sm"
                  className="flex-1"
                  aria-label={`${fileName} 진행률`}
                  aria-valuenow={displayProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
                <span className="flex-shrink-0 text-xs text-default-500 w-10 text-right">
                  {status === "completed" ? (
                    <Check className="w-4 h-4 text-success inline" />
                  ) : status === "failed" ? (
                    <AlertCircle className="w-4 h-4 text-danger inline" />
                  ) : status === "paused" ? (
                    "일시정지"
                  ) : (
                    progressPercent
                  )}
                </span>
              </div>
            )}

            {status === "pending" && (
              <p className="mt-1 text-xs text-default-400">대기 중...</p>
            )}

            {/* 에러 메시지 */}
            {status === "failed" && errorMessage && (
              <p className="mt-1 text-xs text-danger">{errorMessage}</p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex-shrink-0 flex items-center gap-1">
            {status === "uploading" && onPause && (
              <button
                type="button"
                onClick={onPause}
                className="p-1.5 rounded-md hover:bg-default-100 transition-colors"
                aria-label="일시정지"
              >
                <Pause className="w-4 h-4 text-default-500" />
              </button>
            )}

            {status === "paused" && onResume && (
              <button
                type="button"
                onClick={onResume}
                className="p-1.5 rounded-md hover:bg-default-100 transition-colors"
                aria-label="재개"
              >
                <Play className="w-4 h-4 text-primary" />
              </button>
            )}

            {status === "failed" && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                aria-label="재시도"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                재시도
              </button>
            )}

            {(status === "uploading" ||
              status === "paused" ||
              status === "pending") &&
              onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-1.5 rounded-md hover:bg-default-100 transition-colors"
                  aria-label="취소"
                >
                  <X className="w-4 h-4 text-default-500" />
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }
);

UploadQueueItem.displayName = "UploadQueueItem";
