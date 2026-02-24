"use client";

import { Spinner } from "@heroui/react";
import { cn } from "@heroui/react";
import { FolderOpen } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AssetCard, type AssetCardItem } from "../AssetCard";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface AssetGridProps {
	/** 에셋 목록 */
	assets: AssetCardItem[];
	/** 선택된 에셋 ID (선택 모드) */
	selectedIds?: Set<string>;
	/** 단일 선택 핸들러 */
	onSelect?: (assetId: string) => void;
	/** 다중 선택 핸들러 */
	onMultipleSelect?: (assetIds: string[]) => void;
	/** 에셋 클릭 핸들러 */
	onAssetClick?: (asset: AssetCardItem) => void;
	/** 더 보기 핸들러 (무한 스크롤) */
	onLoadMore?: () => void;
	/** 더 불러올 데이터 존재 여부 */
	hasMore?: boolean;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 선택 모드 여부 */
	selectable?: boolean;
	/** 선택 모드 타입 */
	selectionMode?: "single" | "multiple";
	/** 허용 타입 필터 (UI 표시용, 필터링은 상위에서 처리) */
	allowedTypes?: ("IMAGE" | "VIDEO" | "DOCUMENT")[];
	/** 파일 크기 표시 여부 */
	showSize?: boolean;
	/** 타입 뱃지 표시 여부 */
	showType?: boolean;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AssetGrid Widget 컴포넌트
 *
 * 에셋 목록을 그리드 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 썸네일 카드 형태로 에셋을 보여주며, 선택 모드를 지원합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetGrid
 *   assets={assets}
 *   selectedIds={selectedIds}
 *   selectable
 *   onSelect={handleSelect}
 *   onAssetClick={handleClick}
 * />
 * ```
 */
export const AssetGrid = observer(
	({
		assets,
		selectedIds = new Set(),
		onSelect,
		onAssetClick,
		isLoading,
		selectable = false,
		selectionMode = "single",
		showSize = true,
		showType = true,
		emptyMessage = "업로드된 에셋이 없습니다",
		className,
	}: AssetGridProps) => {
		/** 로딩 상태 */
		if (isLoading) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-64" gap={4}>
					<Spinner size="lg" />
					<span className="text-default-500">로딩 중...</span>
				</VStack>
			);
		}

		/** 빈 상태 */
		if (assets.length === 0) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-64" gap={3}>
					<FolderOpen className="w-12 h-12 text-default-300" />
					<span className="text-default-500">{emptyMessage}</span>
				</VStack>
			);
		}

		const handleSelect = (assetId: string, selected: boolean) => {
			if (selectionMode === "single") {
				onSelect?.(assetId);
			} else {
				// 다중 선택 모드
				const newSet = new Set(selectedIds);
				if (selected) {
					newSet.add(assetId);
				} else {
					newSet.delete(assetId);
				}
				onSelect?.(assetId);
			}
		};

		return (
			<div className={cn("w-full", className)}>
				{/* 그리드 */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{assets.map((asset) => (
						<AssetCard
							key={asset.id}
							asset={asset}
							selected={selectedIds.has(asset.id)}
							onSelect={selectable ? handleSelect : undefined}
							onClick={onAssetClick}
							showMeta={showSize || showType}
							showCheckbox={selectable}
						/>
					))}
				</div>

				{/* 선택된 항목 수 표시 (선택 모드일 때만) */}
				{selectable && selectedIds.size > 0 && (
					<div className="mt-4 px-2">
						<span className="text-sm text-default-500">
							선택됨: {selectedIds.size}개
						</span>
					</div>
				)}
			</div>
		);
	},
);

AssetGrid.displayName = "AssetGrid";
