"use client";

import { Button, Spinner } from "@heroui/react";
import { Grid, List } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetCardItem } from "../AssetCard/AssetCard";
import { AssetCard } from "../AssetCard/AssetCard";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export type ViewMode = "grid" | "list";

export interface AssetGridPanelProps {
	/** 에셋 목록 */
	assets: AssetCardItem[];
	/** 뷰 모드 */
	viewMode?: ViewMode;
	/** 선택된 에셋 ID Set */
	selectedIds?: Set<string>;
	/** 에셋 선택 핸들러 */
	onSelect?: (assetId: string, selected: boolean) => void;
	/** 에셋 클릭 핸들러 */
	onClick?: (asset: AssetCardItem) => void;
	/** 뷰 모드 변경 핸들러 */
	onViewModeChange?: (mode: ViewMode) => void;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 그리드 컬럼 수 (grid 모드) */
	columns?: number;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AssetGridPanel Widget 컴포넌트
 *
 * 에셋 목록을 그리드 또는 리스트 형태로 표시하는 순수 UI 컴포넌트입니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetGridPanel
 *   assets={assets}
 *   viewMode="grid"
 *   selectedIds={selectedIds}
 *   onSelect={handleSelect}
 *   onClick={handleClick}
 *   onViewModeChange={setViewMode}
 * />
 * ```
 */
export const AssetGridPanel = observer(
	({
		assets,
		viewMode = "grid",
		selectedIds = new Set(),
		onSelect,
		onClick,
		onViewModeChange,
		isLoading = false,
		emptyMessage = "표시할 에셋이 없습니다",
		columns = 4,
		className,
	}: AssetGridPanelProps) => {
		const isAssetSelected = (assetId: string) => selectedIds.has(assetId);

		const gridCols = {
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
			5: "grid-cols-5",
			6: "grid-cols-6",
		}[columns] ?? "grid-cols-4";

		if (isLoading) {
			return (
				<div className={`flex items-center justify-center py-20 ${className ?? ""}`}>
					<Spinner size="lg" label="로딩 중..." />
				</div>
			);
		}

		if (assets.length === 0) {
			return (
				<VStack
					alignItems="center"
					justifyContent="center"
					className={`py-20 text-default-400 ${className ?? ""}`}
					gap={4}
				>
					<span className="text-sm">{emptyMessage}</span>
				</VStack>
			);
		}

		return (
			<div className={className}>
				{/* 뷰 모드 토글 */}
				{onViewModeChange && (
					<HStack justifyContent="end" className="mb-4">
						<HStack gap={1} className="bg-content2 p-1 rounded-lg">
							<Button
								size="sm"
								variant={viewMode === "grid" ? "solid" : "light"}
								onPress={() => onViewModeChange("grid")}
								isIconOnly
								aria-label="그리드 보기"
							>
								<Grid className="w-4 h-4" />
							</Button>
							<Button
								size="sm"
								variant={viewMode === "list" ? "solid" : "light"}
								onPress={() => onViewModeChange("list")}
								isIconOnly
								aria-label="리스트 보기"
							>
								<List className="w-4 h-4" />
							</Button>
						</HStack>
					</HStack>
				)}

				{/* 그리드 뷰 */}
				{viewMode === "grid" && (
					<div className={`grid ${gridCols} gap-4`}>
						{assets.map((asset) => (
							<AssetCard
								key={asset.id}
								asset={asset}
								selected={isAssetSelected(asset.id)}
								onSelect={onSelect}
								onClick={onClick}
								showCheckbox
							/>
						))}
					</div>
				)}

				{/* 리스트 뷰 */}
				{viewMode === "list" && (
					<VStack gap={2}>
						{assets.map((asset) => (
							<AssetCard
								key={asset.id}
								asset={asset}
								selected={isAssetSelected(asset.id)}
								onSelect={onSelect}
								onClick={onClick}
								showCheckbox
								thumbnailSize="sm"
								className="flex-row! w-full"
							/>
						))}
					</VStack>
				)}
			</div>
		);
	},
);

AssetGridPanel.displayName = "AssetGridPanel";
