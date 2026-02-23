"use client";

import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { AssetKind } from "../../ui/data-display/AssetKindBadge";
import { AssetKindBadge } from "../../ui/data-display/AssetKindBadge";
import { AssetStatusBadge } from "../../ui/data-display/AssetStatusBadge";
import type { AssetStatus } from "../../ui/data-display/AssetStatusBadge";
import { AssetThumbnail } from "../../ui/data-display/AssetThumbnail/AssetThumbnail";
import { SelectionCheckbox } from "../../ui/data-display/SelectionCheckbox/SelectionCheckbox";
import { SizeDisplay } from "../../ui/data-display/SizeDisplay/SizeDisplay";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * 에셋 카드용 에셋 타입
 */
export interface AssetCardItem {
	id: string;
	name: string;
	kind: AssetKind;
	status: AssetStatus;
	size: number;
	thumbnailUrl?: string | null;
	mimeType?: string;
	createdAt?: string | Date;
}

export interface AssetCardProps {
	/** 에셋 데이터 */
	asset: AssetCardItem;
	/** 선택 여부 */
	selected?: boolean;
	/** 선택 핸들러 */
	onSelect?: (assetId: string, selected: boolean) => void;
	/** 클릭 핸들러 */
	onClick?: (asset: AssetCardItem) => void;
	/** 썸네일 크기 */
	thumbnailSize?: "sm" | "md" | "lg";
	/** 추가 정보 표시 여부 */
	showMeta?: boolean;
	/** 선택 체크박스 표시 여부 */
	showCheckbox?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AssetCard Widget 컴포넌트
 *
 * 에셋을 카드 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 썸네일, 이름, 상태, 종류, 크기 정보를 표시합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetCard
 *   asset={asset}
 *   selected={isSelected}
 *   onSelect={handleSelect}
 *   onClick={handleClick}
 *   showCheckbox
 * />
 * ```
 */
export const AssetCard = observer(
	({
		asset,
		selected = false,
		onSelect,
		onClick,
		thumbnailSize = "lg",
		showMeta = true,
		showCheckbox = true,
		className,
	}: AssetCardProps) => {
		const handleSelectChange = (checked: boolean) => {
			onSelect?.(asset.id, checked);
		};

		const handleClick = () => {
			onClick?.(asset);
		};

		const handleCheckboxClick = (e: React.MouseEvent) => {
			e.stopPropagation();
		};

		return (
			<div
				className={cn(
					"group relative rounded-xl border bg-content1 overflow-hidden cursor-pointer",
					"transition-all duration-200 hover:shadow-md",
					selected ? "border-primary ring-2 ring-primary/20" : "border-divider",
					className,
				)}
				onClick={handleClick}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleClick();
				}}
			>
				{/* 썸네일 영역 */}
				<div className="relative aspect-square bg-content2">
					<AssetThumbnail
						src={asset.thumbnailUrl}
						alt={asset.name}
						kind={asset.kind}
						size={thumbnailSize}
						className="w-full h-full"
					/>

					{/* 선택 체크박스 */}
					{showCheckbox && (
						<div
							className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={handleCheckboxClick}
						>
							<SelectionCheckbox
								checked={selected}
								onChange={handleSelectChange}
							/>
						</div>
					)}

					{/* 상태 뱃지 */}
					<div className="absolute top-2 right-2">
						<AssetStatusBadge status={asset.status} />
					</div>
				</div>

				{/* 정보 영역 */}
				<VStack gap={2} className="p-3">
					{/* 파일명 */}
					<span className="text-sm font-medium truncate" title={asset.name}>
						{asset.name}
					</span>

					{/* 메타 정보 */}
					{showMeta && (
						<HStack justifyContent="between" alignItems="center" gap={2}>
							<AssetKindBadge kind={asset.kind} />
							<SizeDisplay bytes={asset.size} className="text-xs text-default-400" />
						</HStack>
					)}
				</VStack>
			</div>
		);
	},
);

AssetCard.displayName = "AssetCard";
