"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { observer } from "mobx-react-lite";
import { cva, type VariantProps } from "class-variance-authority";

const dropZoneStyles = cva(
  "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-divider bg-content1",
        compact: "border-divider bg-content1 p-4",
        card: "border-divider bg-content1 shadow-sm",
      },
      size: {
        sm: "min-h-[120px] p-4",
        md: "min-h-[200px] p-6",
        lg: "min-h-[300px] p-8",
      },
      state: {
        idle: "",
        dragOver: "border-solid border-primary bg-primary/10",
        disabled: "opacity-50 cursor-not-allowed",
        error: "border-danger bg-danger/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "idle",
    },
  }
);

export type DropZoneVariant = VariantProps<typeof dropZoneStyles>["variant"];
export type DropZoneSize = VariantProps<typeof dropZoneStyles>["size"];

export interface DropZoneProps {
  /** 파일 드롭 핸들러 */
  onDrop: (files: File[]) => void;
  /** 드래그 진입 핸들러 */
  onDragOver?: () => void;
  /** 드래그 이탈 핸들러 */
  onDragLeave?: () => void;
  /** 허용 파일 타입 (예: ["image/*", ".pdf"]) */
  accept?: string[];
  /** 최대 파일 크기 (bytes) */
  maxFileSize?: number;
  /** 다중 파일 허용 여부 */
  multiple?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 메시지 제목 */
  title?: string;
  /** 보조 메시지 */
  description?: string;
  /** 에러 메시지 */
  error?: string;
  /** 컴포넌트 변형 */
  variant?: DropZoneVariant;
  /** 컴포넌트 크기 */
  size?: DropZoneSize;
  /** 추가 클래스 */
  className?: string;
}

const DEFAULT_TITLE = "파일을 드래그하여 업로드하세요";
const DEFAULT_DESCRIPTION = "또는";
const ACCEPTED_FORMATS_TEXT =
  "지원 포맷: JPG, PNG, GIF, MP4, PDF (최대 100MB)";

/**
 * 파일 드래그앤드롭 영역을 제공하는 컴포넌트
 */
export const DropZone = observer(
  ({
    onDrop,
    onDragOver,
    onDragLeave,
    accept,
    maxFileSize,
    multiple = true,
    disabled = false,
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    error,
    variant = "default",
    size = "md",
    className,
  }: DropZoneProps) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFiles = useCallback(
      (files: File[]): File[] => {
        const validFiles: File[] = [];

        for (const file of files) {
          // 파일 크기 검증
          if (maxFileSize && file.size > maxFileSize) {
            continue;
          }

          // 파일 타입 검증
          if (accept && accept.length > 0) {
            const isAccepted = accept.some((type) => {
              if (type.startsWith(".")) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              if (type.endsWith("/*")) {
                return file.type.startsWith(type.replace("/*", "/"));
              }
              return file.type === type;
            });
            if (!isAccepted) {
              continue;
            }
          }

          validFiles.push(file);
        }

        return validFiles;
      },
      [accept, maxFileSize]
    );

    const handleDragEnter = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        setIsDragOver(true);
        onDragOver?.();
      },
      [disabled, onDragOver]
    );

    const handleDragLeave = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        setIsDragOver(false);
        onDragLeave?.();
      },
      [disabled, onDragLeave]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        const validFiles = validateFiles(files);

        if (validFiles.length > 0) {
          onDrop(multiple ? validFiles : [validFiles[0]]);
        }
      },
      [disabled, multiple, onDrop, validateFiles]
    );

    const handleClick = useCallback(() => {
      if (disabled) return;
      inputRef.current?.click();
    }, [disabled]);

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = validateFiles(files);

        if (validFiles.length > 0) {
          onDrop(multiple ? validFiles : [validFiles[0]]);
        }

        // input 초기화
        e.target.value = "";
      },
      [multiple, onDrop, validateFiles]
    );

    const getState = () => {
      if (disabled) return "disabled";
      if (error) return "error";
      if (isDragOver) return "dragOver";
      return "idle";
    };

    const state = getState();

    return (
      <div
        className={dropZoneStyles({ variant, size, state, className })}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="파일 업로드 영역"
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept?.join(",")}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {isDragOver ? (
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-primary animate-bounce" />
            <p className="text-lg font-medium text-primary">여기에 놓으세요!</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload
              className={`w-12 h-12 mx-auto mb-3 ${
                error ? "text-danger" : "text-default-400"
              }`}
            />
            <p
              className={`text-lg font-medium ${
                error ? "text-danger" : "text-default-600"
              }`}
            >
              {error || title}
            </p>
            {!error && (
              <>
                <p className="mt-1 text-sm text-default-400">{description}</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  파일 선택
                </button>
                <p className="mt-4 text-xs text-default-400">
                  {ACCEPTED_FORMATS_TEXT}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

DropZone.displayName = "DropZone";
