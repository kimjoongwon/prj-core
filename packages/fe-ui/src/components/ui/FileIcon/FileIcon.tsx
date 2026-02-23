"use client";

import {
  File,
  FileText,
  Image,
  Music,
  Video,
  FileSpreadsheet,
  FileCode,
  Archive,
  Presentation,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

const fileIconStyles = cva("inline-flex items-center justify-center", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    },
    color: {
      auto: "",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      default: "text-default-500",
    },
  },
  defaultVariants: {
    size: "md",
    color: "auto",
  },
});

export type FileIconSize = VariantProps<typeof fileIconStyles>["size"];
export type FileIconColor = VariantProps<typeof fileIconStyles>["color"];

export interface FileIconProps {
  /** MIME 타입 (예: "image/png") */
  mimeType?: string;
  /** 파일 확장자 (예: ".jpg") */
  extension?: string;
  /** 파일명 (확장자 추출용) */
  fileName?: string;
  /** 아이콘 크기 */
  size?: FileIconSize;
  /** 색상 */
  color?: FileIconColor;
  /** 타입 라벨 표시 여부 */
  showLabel?: boolean;
  /** 추가 클래스 */
  className?: string;
}

type FileTypeCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "excel"
  | "word"
  | "ppt"
  | "archive"
  | "code"
  | "document"
  | "unknown";

interface FileTypeConfig {
  icon: LucideIcon;
  colorClass: string;
  label: string;
}

const FILE_TYPE_CONFIG: Record<FileTypeCategory, FileTypeConfig> = {
  image: { icon: Image, colorClass: "text-primary", label: "이미지" },
  video: { icon: Video, colorClass: "text-secondary", label: "비디오" },
  audio: { icon: Music, colorClass: "text-warning", label: "오디오" },
  pdf: { icon: FileText, colorClass: "text-danger", label: "PDF" },
  excel: { icon: FileSpreadsheet, colorClass: "text-success", label: "엑셀" },
  word: { icon: FileText, colorClass: "text-primary", label: "워드" },
  ppt: { icon: Presentation, colorClass: "text-warning", label: "프레젠테이션" },
  archive: { icon: Archive, colorClass: "text-default-500", label: "압축파일" },
  code: { icon: FileCode, colorClass: "text-primary", label: "코드" },
  document: { icon: FileText, colorClass: "text-default-500", label: "문서" },
  unknown: { icon: File, colorClass: "text-default-400", label: "파일" },
};

const MIME_TYPE_MAP: Record<string, FileTypeCategory> = {
  "image/": "image",
  "video/": "video",
  "audio/": "audio",
  "application/pdf": "pdf",
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "text/csv": "excel",
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "word",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "ppt",
};

const EXTENSION_MAP: Record<string, FileTypeCategory> = {
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".gif": "image",
  ".webp": "image",
  ".svg": "image",
  ".bmp": "image",
  ".mp4": "video",
  ".mov": "video",
  ".avi": "video",
  ".webm": "video",
  ".mkv": "video",
  ".mp3": "audio",
  ".wav": "audio",
  ".ogg": "audio",
  ".flac": "audio",
  ".m4a": "audio",
  ".pdf": "pdf",
  ".xls": "excel",
  ".xlsx": "excel",
  ".csv": "excel",
  ".doc": "word",
  ".docx": "word",
  ".ppt": "ppt",
  ".pptx": "ppt",
  ".zip": "archive",
  ".rar": "archive",
  ".7z": "archive",
  ".tar": "archive",
  ".gz": "archive",
  ".js": "code",
  ".ts": "code",
  ".jsx": "code",
  ".tsx": "code",
  ".py": "code",
  ".java": "code",
  ".go": "code",
  ".rs": "code",
  ".c": "code",
  ".cpp": "code",
  ".h": "code",
  ".css": "code",
  ".scss": "code",
  ".html": "code",
  ".json": "code",
  ".xml": "code",
  ".yaml": "code",
  ".yml": "code",
  ".md": "document",
  ".txt": "document",
  ".rtf": "document",
};

const getFileType = (
  mimeType?: string,
  extension?: string,
  fileName?: string
): FileTypeCategory => {
  // MIME 타입으로 확인
  if (mimeType) {
    const normalizedMime = mimeType.toLowerCase();
    for (const [key, category] of Object.entries(MIME_TYPE_MAP)) {
      if (normalizedMime.startsWith(key) || normalizedMime === key) {
        return category;
      }
    }
    // application/* 나머지는 document
    if (normalizedMime.startsWith("application/")) {
      return "document";
    }
  }

  // 확장자로 확인
  const ext =
    extension || (fileName ? `.${fileName.split(".").pop()?.toLowerCase()}` : null);

  if (ext) {
    const normalizedExt = ext.toLowerCase();
    if (EXTENSION_MAP[normalizedExt]) {
      return EXTENSION_MAP[normalizedExt];
    }
  }

  return "unknown";
};

/**
 * 파일 타입에 따른 아이콘을 표시하는 컴포넌트
 */
export const FileIcon = observer(
  ({
    mimeType,
    extension,
    fileName,
    size = "md",
    color = "auto",
    showLabel = false,
    className,
  }: FileIconProps) => {
    const fileType = getFileType(mimeType, extension, fileName);
    const config = FILE_TYPE_CONFIG[fileType];
    const IconComponent = config.icon;

    const colorClass = color === "auto" ? config.colorClass : "";

    return (
      <span
        className={fileIconStyles({ size, className })}
        aria-label={config.label}
      >
        <IconComponent
          className={`w-full h-full ${colorClass}`}
          aria-hidden="true"
        />
        {showLabel && (
          <span className="ml-1 text-xs text-default-500">{config.label}</span>
        )}
      </span>
    );
  }
);

FileIcon.displayName = "FileIcon";
