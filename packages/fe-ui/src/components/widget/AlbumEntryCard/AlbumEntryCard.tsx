"use client";

import { Button, Input } from "@heroui/react";
import { cn } from "@heroui/react";
import { GripVertical, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { AssetKind } from "../../ui/data-display/AssetKindBadge";
import { AssetThumbnail } from "../../ui/data-display/AssetThumbnail/AssetThumbnail";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * 앨범 엔트리용 에셋 타입
 */
export interface AlbumEntryAsset {
	id: string;
	name: string;
	kind: AssetKind;
	thumbnailUrl?: string | null;
}

/**
 * 앨범 엔트리 타입
 */
export interface AlbumEntryItem {
	id: string;
	albumId: string;
	assetId: string;
	position: number;
	caption?: string | null;
	asset?: AlbumEntryAsset;
}

export interface AlbumEntryCardProps {
	/** 앨범 엔트리 데이터 */
	entry: AlbumEntryItem;
	/** 썸네일 URL */
	thumbnailUrl?: string;
	/** 드래그 상태 */
	isDragging?: boolean;
	/** 편집 가능 여부 */
	isEditable?: boolean;
	/** 캡션 표시 여부 */
	showCaption?: boolean;
	/** 제거 버튼 표시 */
	showRemoveButton?: boolean;
	/** 캡션 변경 핸들러 */
	onCaptionChange?: (entryId: string, caption: string) => void;
	/** 제거 핸들러 */
	onRemove?: (entry: AlbumEntryItem) => void;
	/** 드래그 시작 핸들러 */
	onDragStart?: (entryId: string) => void;
	/** 드래그 종료 핸들러 */
	onDragEnd?: (entryId: string) => void;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AlbumEntryCard Widget 컴포넌트
 *
 * 앨범 내 개별 에셋 엔트리를 카드 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 드래그 핸들, 썸네일, 캡션, 제거 버튼을 제공합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AlbumEntryCard
 *   entry={entry}
 *   isEditable
 *   showCaption
 *   onCaptionChange={handleCaptionChange}
 *   onRemove={handleRemove}
 * />
 * ```
 */
export const AlbumEntryCard = observer(
	({
		entry,
		thumbnailUrl,
		isDragging = false,
		isEditable = false,
		showCaption = true,
		showRemoveButton = true,
		onCaptionChange,
		onRemove,
		className,
	}: AlbumEntryCardProps) => {
		const [isEditingCaption, setIsEditingCaption] = useState(false);
		const [captionValue, setCaptionValue] = useState(entry.caption ?? "");

		const asset = entry.asset;
		const displayThumbnailUrl = thumbnailUrl ?? asset?.thumbnailUrl;

		const handleCaptionSubmit = () => {
			if (onCaptionChange && captionValue !== entry.caption) {
				onCaptionChange(entry.id, captionValue);
			}
			setIsEditingCaption(false);
		};

		const handleRemove = () => {
			onRemove?.(entry);
		};

		return (
			<div
				className={cn(
					"flex items-center gap-2 rounded-lg border bg-content1 p-2",
					"transition-all duration-200",
					isDragging ? "shadow-lg opacity-80" : "hover:bg-content2",
					className,
				)}
				style={{ height: "80px" }}
			>
				{/* 드래그 핸들 */}
				{isEditable && (
					<div className="flex items-center justify-center w-6 cursor-grab active:cursor-grabbing">
						<GripVertical className="w-4 h-4 text-default-400" />
					</div>
				)}

				{/* 썸네일 */}
				<div className="shrink-0">
					{asset ? (
						<AssetThumbnail
							src={displayThumbnailUrl}
							alt={asset.name}
							kind={asset.kind}
							size="lg"
							className="rounded-md"
						/>
					) : (
						<div className="w-[60px] h-[60px] bg-content2 rounded-md" />
					)}
				</div>

				{/* 콘텐츠 영역 */}
				<VStack gap={1} className="flex-1 min-w-0">
					<span className="text-sm font-medium truncate">
						{asset?.name ?? "알 수 없는 에셋"}
					</span>

					{/* 캡션 영역 */}
					{showCaption && (
						<div className="min-h-[24px]">
							{isEditingCaption ? (
								<HStack gap={2}>
									<Input
										size="sm"
										value={captionValue}
										onChange={(e) => setCaptionValue(e.target.value)}
										onBlur={handleCaptionSubmit}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleCaptionSubmit();
											if (e.key === "Escape") {
												setCaptionValue(entry.caption ?? "");
												setIsEditingCaption(false);
											}
										}}
										className="flex-1"
										classNames={{ input: "text-xs" }}
									/>
									<Button size="sm" color="primary" onPress={handleCaptionSubmit}>
										완료
									</Button>
								</HStack>
							) : (
								<span
									className={cn(
										"text-xs text-default-500 truncate cursor-pointer",
										isEditable && "hover:text-primary",
									)}
									onClick={() => isEditable && setIsEditingCaption(true)}
								>
									{entry.caption ?? (isEditable ? "캡션 추가..." : "")}
								</span>
							)}
						</div>
					)}
				</VStack>

				{/* 제거 버튼 */}
				{showRemoveButton && isEditable && (
					<Button
						size="sm"
						variant="light"
						isIconOnly
						onPress={handleRemove}
						className="text-default-400 hover:text-danger"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				)}
			</div>
		);
	},
);

AlbumEntryCard.displayName = "AlbumEntryCard";
