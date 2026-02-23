"use client";

import { Image } from "@heroui/react";
import { FileText, Image as ImageIcon, Video } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetKind } from "../AssetKindBadge";

export type AssetThumbnailSize = "sm" | "md" | "lg";

export interface AssetThumbnailProps {
	/** 썸네일 이미지 URL */
	src?: string | null;
	/** 대체 텍스트 */
	alt?: string;
	/** 에셋 종류 */
	kind: AssetKind;
	/** 썸네일 크기 */
	size?: AssetThumbnailSize;
	/** 추가 클래스명 */
	className?: string;
}

const SIZE_CONFIG: Record<
	AssetThumbnailSize,
	{ width: number; height: number; iconSize: number }
> = {
	sm: { width: 32, height: 32, iconSize: 16 },
	md: { width: 48, height: 48, iconSize: 24 },
	lg: { width: 64, height: 64, iconSize: 32 },
};

const KIND_ICON_CONFIG: Record<
	AssetKind,
	{ icon: typeof ImageIcon; bgClass: string; iconClass: string }
> = {
	IMAGE: {
		icon: ImageIcon,
		bgClass: "bg-primary/10",
		iconClass: "text-primary",
	},
	VIDEO: {
		icon: Video,
		bgClass: "bg-secondary/10",
		iconClass: "text-secondary",
	},
	DOCUMENT: {
		icon: FileText,
		bgClass: "bg-default-100",
		iconClass: "text-default-500",
	},
};

/**
 * 에셋 종류에 따른 썸네일을 표시하는 컴포넌트
 * - 이미지: 실제 썸네일 이미지 표시
 * - 비디오/문서: 종류에 맞는 아이콘 표시
 */
export const AssetThumbnail = observer(
	({ src, alt, kind, size = "md", className }: AssetThumbnailProps) => {
		const sizeConfig = SIZE_CONFIG[size];
		const iconConfig = KIND_ICON_CONFIG[kind];
		const IconComponent = iconConfig.icon;

		// 이미지이고 src가 있으면 실제 이미지 표시
		if (kind === "IMAGE" && src) {
			return (
				<Image
					src={src}
					alt={alt ?? "썸네일"}
					width={sizeConfig.width}
					height={sizeConfig.height}
					className={`object-cover rounded ${className ?? ""}`}
					removeWrapper
				/>
			);
		}

		// 그 외는 아이콘 표시
		return (
			<div
				className={`flex items-center justify-center rounded ${iconConfig.bgClass} ${className ?? ""}`}
				style={{ width: sizeConfig.width, height: sizeConfig.height }}
			>
				<IconComponent
					size={sizeConfig.iconSize}
					className={iconConfig.iconClass}
				/>
			</div>
		);
	},
);
