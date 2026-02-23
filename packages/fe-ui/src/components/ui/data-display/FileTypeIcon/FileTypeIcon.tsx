"use client";

import { File, FileText, Image, Music, Video } from "lucide-react";
import { observer } from "mobx-react-lite";

export type FileTypeIconSize = "sm" | "md" | "lg";

export interface FileTypeIconProps {
	/** MIME 타입 (예: image/png, video/mp4, application/pdf) */
	mimeType: string;
	/** 아이콘 크기 */
	size?: FileTypeIconSize;
	/** 추가 클래스명 */
	className?: string;
}

const SIZE_CONFIG: Record<
	FileTypeIconSize,
	{ iconSize: number; className: string }
> = {
	sm: { iconSize: 16, className: "w-4 h-4" },
	md: { iconSize: 20, className: "w-5 h-5" },
	lg: { iconSize: 24, className: "w-6 h-6" },
};

/**
 * MIME 타입에 따른 파일 타입 아이콘을 반환
 */
const getFileTypeConfig = (mimeType: string) => {
	const type = mimeType.toLowerCase();

	if (type.startsWith("image/")) {
		return { icon: Image, colorClass: "text-primary" };
	}
	if (type.startsWith("video/")) {
		return { icon: Video, colorClass: "text-secondary" };
	}
	if (type.startsWith("audio/")) {
		return { icon: Music, colorClass: "text-warning" };
	}
	if (
		type.startsWith("application/pdf") ||
		type.startsWith("application/msword") ||
		type.startsWith("application/vnd.") ||
		type.startsWith("text/")
	) {
		return { icon: FileText, colorClass: "text-default-500" };
	}

	return { icon: File, colorClass: "text-default-400" };
};

/**
 * MIME 타입에 따른 파일 타입 아이콘을 표시하는 컴포넌트
 */
export const FileTypeIcon = observer(
	({ mimeType, size = "md", className }: FileTypeIconProps) => {
		const sizeConfig = SIZE_CONFIG[size];
		const { icon: IconComponent, colorClass } = getFileTypeConfig(mimeType);

		return (
			<IconComponent
				size={sizeConfig.iconSize}
				className={`${sizeConfig.className} ${colorClass} ${className ?? ""}`}
			/>
		);
	},
);
