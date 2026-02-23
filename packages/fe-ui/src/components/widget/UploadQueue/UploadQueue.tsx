"use client";

import { observer } from "mobx-react-lite";
import { ScrollShadow } from "@heroui/react";
import { UploadQueueItem, type UploadStatus } from "../../ui/UploadQueueItem";
import { Button } from "../../inputs/Button/Button";

export interface UploadQueueItemData {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  progress?: number;
  status: UploadStatus;
  errorMessage?: string;
}

export interface UploadQueueProps {
  /** 업로드 항목 목록 */
  items: UploadQueueItemData[];
  /** 전체 취소 핸들러 */
  onCancelAll?: () => void;
  /** 실패 항목 재시도 핸들러 */
  onRetryFailed?: () => void;
  /** 개별 일시정지 핸들러 */
  onItemPause?: (id: string) => void;
  /** 개별 재개 핸들러 */
  onItemResume?: (id: string) => void;
  /** 개별 취소 핸들러 */
  onItemCancel?: (id: string) => void;
  /** 개별 재시도 핸들러 */
  onItemRetry?: (id: string) => void;
  /** 최대 높이 */
  maxHeight?: string | number;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 추가 클래스 */
  className?: string;
}

const DEFAULT_EMPTY_MESSAGE = "업로드할 파일이 없습니다";

/**
 * 업로드 중인 파일들의 목록을 관리하고 표시하는 위젯
 */
export const UploadQueue = observer(
  ({
    items,
    onCancelAll,
    onRetryFailed,
    onItemPause,
    onItemResume,
    onItemCancel,
    onItemRetry,
    maxHeight = 400,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
    className,
  }: UploadQueueProps) => {
    const uploadingCount = items.filter(
      (item) => item.status === "uploading" || item.status === "paused"
    ).length;
    const completedCount = items.filter(
      (item) => item.status === "completed"
    ).length;
    const failedCount = items.filter((item) => item.status === "failed").length;
    const hasFailedItems = failedCount > 0;

    const getTitle = () => {
      if (completedCount === items.length && items.length > 0) {
        return `업로드 완료 (${completedCount}개)`;
      }
      if (hasFailedItems && completedCount > 0) {
        return `업로드 완료 (${completedCount}/${items.length})`;
      }
      return `업로드 큐 (${items.length}개 파일)`;
    };

    if (items.length === 0) {
      return (
        <div
          className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
        >
          <p className="text-default-400">{emptyMessage}</p>
          <p className="mt-1 text-sm text-default-300">
            파일을 드래그하거나 선택해주세요
          </p>
        </div>
      );
    }

    return (
      <div className={className}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-default-600">{getTitle()}</h3>
          <div className="flex items-center gap-2">
            {hasFailedItems && onRetryFailed && (
              <Button size="sm" variant="flat" color="warning" onClick={onRetryFailed}>
                실패 재시도
              </Button>
            )}
            {uploadingCount > 0 && onCancelAll && (
              <Button size="sm" variant="light" color="danger" onClick={onCancelAll}>
                전체 취소
              </Button>
            )}
          </div>
        </div>

        {/* 아이템 목록 */}
        <ScrollShadow style={{ maxHeight }} className="space-y-2">
          {items.map((item) => (
            <UploadQueueItem
              key={item.id}
              {...item}
              onPause={
                onItemPause ? () => onItemPause(item.id) : undefined
              }
              onResume={
                onItemResume ? () => onItemResume(item.id) : undefined
              }
              onCancel={
                onItemCancel ? () => onItemCancel(item.id) : undefined
              }
              onRetry={onItemRetry ? () => onItemRetry(item.id) : undefined}
            />
          ))}
        </ScrollShadow>
      </div>
    );
  }
);

UploadQueue.displayName = "UploadQueue";
