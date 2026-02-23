"use client";

import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { UploadPanel } from "../../widget/UploadPanel";
import type { UploadQueueItemData } from "../../widget/UploadQueue";
import type { UploadStatus } from "../../ui/UploadQueueItem";

export type AssetKind = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface UploadError {
  file: File;
  message: string;
  code:
    | "FILE_TOO_LARGE"
    | "INVALID_TYPE"
    | "TOO_MANY_FILES"
    | "DUPLICATE_FILE"
    | "NETWORK_ERROR";
}

export interface AssetUploaderProps {
  /** 업로드 대상 폴더 */
  folderId?: string | null;
  /** 허용 타입 (IMAGE, VIDEO, DOCUMENT) */
  allowedTypes?: AssetKind[];
  /** 허용 확장자 (예: [".jpg", ".png"]) */
  allowedExtensions?: string[];
  /** 최대 파일 크기 (bytes, 기본: 104857600 = 100MB) */
  maxFileSize?: number;
  /** 최대 파일 수 (기본: 20) */
  maxFiles?: number;
  /** 다중 업로드 허용 (기본: true) */
  multiple?: boolean;
  /** 자동 업로드 (기본: true) */
  autoUpload?: boolean;
  /** 진행률 표시 (기본: true) */
  showProgress?: boolean;
  /** 업로드 시작 핸들러 */
  onUploadStart?: (files: File[]) => void;
  /** 진행률 핸들러 */
  onUploadProgress?: (fileId: string, progress: number) => void;
  /** 완료 핸들러 */
  onUploadComplete?: (assets: unknown[]) => void;
  /** 에러 핸들러 */
  onUploadError?: (errors: UploadError[]) => void;
  /** 닫기 핸들러 */
  onClose?: () => void;
  /** 업로드 큐 아이템 (Store에서 주입) */
  queueItems?: UploadQueueItemData[];
  /** 파일 업로드 실행 함수 (Store에서 주입) */
  onUploadFiles?: (files: File[], folderId?: string | null) => void;
  /** 업로드 취소 함수 (Store에서 주입) */
  onCancelUpload?: (fileId: string) => void;
  /** 업로드 일시정지 함수 (Store에서 주입) */
  onPauseUpload?: (fileId: string) => void;
  /** 업로드 재개 함수 (Store에서 주입) */
  onResumeUpload?: (fileId: string) => void;
  /** 업로드 재시도 함수 (Store에서 주입) */
  onRetryUpload?: (fileId: string) => void;
  /** 전체 업로드 취소 함수 (Store에서 주입) */
  onCancelAllUploads?: () => void;
  /** 실패 항목 재시도 함수 (Store에서 주입) */
  onRetryFailedUploads?: () => void;
  /** 초기화 함수 (Store에서 주입) */
  onReset?: () => void;
  /** 추가 클래스 */
  className?: string;
}

const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_MAX_FILES = 20;

const ASSET_KIND_EXTENSIONS: Record<AssetKind, string[]> = {
  IMAGE: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"],
  VIDEO: [".mp4", ".mov", ".avi", ".webm", ".mkv"],
  DOCUMENT: [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".md",
  ],
};

/**
 * 파일 업로드를 담당하는 비즈니스 컴포넌트
 */
export const AssetUploader = observer(
  ({
    folderId = null,
    allowedTypes = ["IMAGE", "VIDEO", "DOCUMENT"],
    allowedExtensions,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    maxFiles = DEFAULT_MAX_FILES,
    multiple = true,
    autoUpload = true,
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onClose,
    queueItems = [],
    onUploadFiles,
    onCancelUpload,
    onPauseUpload,
    onResumeUpload,
    onRetryUpload,
    onCancelAllUploads,
    onRetryFailedUploads,
    onReset,
    className,
  }: AssetUploaderProps) => {
    // 허용 확장자 계산
    const acceptedExtensions =
      allowedExtensions ||
      allowedTypes.flatMap((type) => ASSET_KIND_EXTENSIONS[type] || []);

    // 파일 검증
    const validateFiles = useCallback(
      (files: File[]): { valid: File[]; errors: UploadError[] } => {
        const valid: File[] = [];
        const errors: UploadError[] = [];

        // 파일 수 체크
        if (files.length > maxFiles) {
          errors.push({
            file: files[0],
            message: `최대 ${maxFiles}개까지 동시 업로드할 수 있습니다`,
            code: "TOO_MANY_FILES",
          });
          return { valid: [], errors };
        }

        for (const file of files) {
          // 파일 크기 체크
          if (file.size > maxFileSize) {
            errors.push({
              file,
              message: `파일 크기가 제한을 초과했습니다 (최대 ${Math.round(maxFileSize / 1024 / 1024)}MB)`,
              code: "FILE_TOO_LARGE",
            });
            continue;
          }

          // 파일 타입 체크
          const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
          if (!acceptedExtensions.includes(ext)) {
            errors.push({
              file,
              message: "지원하지 않는 파일 형식입니다",
              code: "INVALID_TYPE",
            });
            continue;
          }

          valid.push(file);
        }

        return { valid, errors };
      },
      [acceptedExtensions, maxFileSize, maxFiles]
    );

    // 파일 선택 핸들러
    const handleFilesSelected = useCallback(
      (files: File[]) => {
        const { valid, errors } = validateFiles(files);

        if (errors.length > 0 && onUploadError) {
          onUploadError(errors);
        }

        if (valid.length > 0) {
          if (onUploadStart) {
            onUploadStart(valid);
          }

          if (autoUpload && onUploadFiles) {
            onUploadFiles(valid, folderId);
          }
        }
      },
      [
        validateFiles,
        onUploadError,
        onUploadStart,
        autoUpload,
        onUploadFiles,
        folderId,
      ]
    );

    // 패널 상태 계산
    const getPanelStatus = (): "idle" | "uploading" | "completed" | "failed" => {
      if (queueItems.length === 0) return "idle";

      const hasUploading = queueItems.some(
        (item) =>
          item.status === "uploading" ||
          item.status === "paused" ||
          item.status === "pending"
      );
      if (hasUploading) return "uploading";

      const hasFailed = queueItems.some((item) => item.status === "failed");
      if (hasFailed) return "failed";

      return "completed";
    };

    // 완료 카운트
    const completedCount = queueItems.filter(
      (item) => item.status === "completed"
    ).length;
    const failedCount = queueItems.filter(
      (item) => item.status === "failed"
    ).length;

    return (
      <UploadPanel
        className={className}
        onFilesSelected={handleFilesSelected}
        accept={acceptedExtensions}
        maxFileSize={maxFileSize}
        multiple={multiple}
        queueItems={queueItems}
        status={getPanelStatus()}
        completedCount={completedCount}
        failedCount={failedCount}
        onCancelAll={onCancelAllUploads}
        onRetryFailed={onRetryFailedUploads}
        onItemPause={onPauseUpload}
        onItemResume={onResumeUpload}
        onItemCancel={onCancelUpload}
        onItemRetry={onRetryUpload}
        onComplete={onClose}
        onUploadMore={onReset}
      />
    );
  }
);

AssetUploader.displayName = "AssetUploader";
