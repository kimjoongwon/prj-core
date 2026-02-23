"use client";

import { useAssetStore } from "@cocrepo/store";
import { Button, cn, Tabs, Tab } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { FolderOpen, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { SearchFilterBar } from "../../widget/SearchFilterBar/SearchFilterBar";
import { FolderNavigator, type FolderItem } from "../FolderNavigator";
import { AssetBrowser, type Asset } from "../AssetBrowser";

export interface AssetManagerProps {
	/** 초기 폴더 ID */
	initialFolderId?: string | null;
	/** 폴더 트리 표시 여부 */
	showFolderTree?: boolean;
	/** 검색창 표시 여부 */
	showSearch?: boolean;
	/** 타입 필터 표시 여부 */
	showTypeFilter?: boolean;
	/** 뷰 토글 표시 여부 */
	showViewToggle?: boolean;
	/** 업로드 버튼 표시 여부 */
	showUploadButton?: boolean;
	/** 폴더 생성 버튼 표시 여부 */
	showFolderCreateButton?: boolean;
	/** 폴더 트리 데이터 (외부에서 주입) */
	folders?: FolderItem[];
	/** 에셋 목록 데이터 (외부에서 주입) */
	assets?: Asset[];
	/** 에셋 로딩 상태 */
	isLoading?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 폴더 변경 핸들러 */
	onFolderChange?: (folderId: string | null) => void;
	/** 업로드 버튼 클릭 핸들러 */
	onUploadClick?: () => void;
	/** 폴더 생성 버튼 클릭 핸들러 */
	onFolderCreateClick?: () => void;
	/** 에셋 클릭 핸들러 */
	onAssetClick?: (asset: Asset) => void;
	/** 더 많은 데이터 로드 핸들러 */
	onLoadMore?: () => void;
}

/**
 * AssetManager Feature 컴포넌트
 *
 * 에셋 관리를 위한 메인 레이아웃 컴포넌트입니다.
 * AssetStore와 연결하여 좌측 폴더 트리와 우측 에셋 그리드/리스트를 조합합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: SearchFilterBar, FolderTreePanel, AssetGridPanel (순수 UI)
 * - Feature: FolderNavigator, AssetBrowser (Store 연결)
 * - Feature: AssetManager (레이아웃 조합, 상태 관리)
 *
 * @example
 * ```tsx
 * <PageSurface title="에셋 관리">
 *   <AssetManager
 *     showFolderTree
 *     showSearch
 *     showUploadButton
 *     folders={folderData}
 *     assets={assetData}
 *     onUploadClick={handleUpload}
 *   />
 * </PageSurface>
 * ```
 */
export const AssetManager = observer(
	({
		initialFolderId = null,
		showFolderTree = true,
		showSearch = true,
		showTypeFilter = true,
		showViewToggle = true,
		showUploadButton = true,
		showFolderCreateButton = true,
		folders = [],
		assets = [],
		isLoading = false,
		className,
		onFolderChange,
		onUploadClick,
		onFolderCreateClick,
		onAssetClick,
		onLoadMore,
	}: AssetManagerProps) => {
		const assetStore = useAssetStore();
		const [filterPanelOpen, setFilterPanelOpen] = useState(false);

		// Store의 현재 상태
		const { searchKeyword, selectedKind, viewMode, hasSelection, selectionCount } = assetStore;

		// 필터 카운트 계산
		const filterCount = selectedKind ? 1 : 0;

		// 초기 폴더 설정
		useEffect(() => {
			if (initialFolderId !== undefined && initialFolderId !== null) {
				assetStore.setCurrentFolder(initialFolderId);
			}
		}, [initialFolderId, assetStore]);

		// 검색어 변경 핸들러
		const handleSearchChange = (value: string) => {
			assetStore.setSearchKeyword(value);
		};

		// 검색 실행 핸들러
		const handleSearch = () => {
			// 검색 API 호출는 외부에서 assets prop으로 처리
		};

		// 필터 패널 토글
		const handleFilterToggle = () => {
			setFilterPanelOpen(!filterPanelOpen);
		};

		// 뷰 모드 변경
		const handleViewModeChange = (mode: "grid" | "list") => {
			assetStore.setViewMode(mode);
		};

		// 폴더 변경 핸들러
		const handleFolderChange = (folderId: string | null) => {
			assetStore.setCurrentFolder(folderId);
			assetStore.clearSelection();
			onFolderChange?.(folderId);
		};

		// 업로드 버튼 클릭
		const handleUploadClick = () => {
			onUploadClick?.();
		};

		// 폴더 생성 버튼 클릭
		const handleFolderCreateClick = () => {
			onFolderCreateClick?.();
		};

		// 에셋 클릭 핸들러
		const handleAssetClick = (asset: Asset) => {
			onAssetClick?.(asset);
		};

		// 전체 선택
		const handleSelectAll = () => {
			const allAssetIds = assets.map((a) => a.id);
			assetStore.selectAllAssets(allAssetIds);
		};

		// 선택 삭제 (외부에서 처리)
		const handleDeleteSelected = () => {
			// 삭제 로직는 외부에서 처리
		};

		// 선택 이동 (외부에서 처리)
		const handleMoveSelected = () => {
			// 이동 로직는 외부에서 처리
		};

		return (
			<VStack className={cn("h-full", className)} gap={0}>
				{/* 툴바 영역 */}
				<HStack className="border-b border-divider p-4" fullWidth justifyContent="between">
					{showSearch && (
						<SearchFilterBar
							searchValue={searchKeyword}
							onSearchChange={handleSearchChange}
							onSearch={handleSearch}
							onFilterToggle={showTypeFilter ? handleFilterToggle : undefined}
							isFilterOpen={filterPanelOpen}
							filterCount={filterCount}
							placeholder="에셋 검색..."
							showFilterButton={showTypeFilter}
							className="flex-1"
						/>
					)}

					<HStack gap={2}>
						{showViewToggle && (
							<Tabs
								selectedKey={viewMode}
								onSelectionChange={(key) => handleViewModeChange(key as "grid" | "list")}
								size="sm"
								variant="solid"
							>
								<Tab key="grid" title="그리드" />
								<Tab key="list" title="리스트" />
							</Tabs>
						)}

						{showFolderCreateButton && (
							<Button
								variant="flat"
								startContent={<FolderOpen className="size-4" />}
								onPress={handleFolderCreateClick}
							>
								폴더 생성
							</Button>
						)}

						{showUploadButton && (
							<Button
								color="primary"
								startContent={<Upload className="size-4" />}
								onPress={handleUploadClick}
							>
								업로드
							</Button>
						)}
					</HStack>
				</HStack>

				{/* 메인 콘텐츠 영역 */}
				<HStack className="flex-1 overflow-hidden" fullWidth gap={0}>
					{/* 폴더 트리 영역 */}
					{showFolderTree && (
						<div className="h-full w-64 border-r border-divider bg-content1">
							<FolderNavigator
								folders={folders}
								showCreateButton={showFolderCreateButton}
								onFolderSelect={handleFolderChange}
								onCreateFolder={onFolderCreateClick}
							/>
						</div>
					)}

					{/* 에셋 브라우저 영역 */}
					<div className="h-full flex-1 overflow-auto p-4">
						<AssetBrowser
							initialFolderId={initialFolderId}
							assets={assets}
							isLoading={isLoading}
							onAssetClick={handleAssetClick}
							onLoadMore={onLoadMore}
						/>
					</div>
				</HStack>

				{/* 선택 액션 바 (선택된 항목이 있을 때) */}
				{hasSelection && (
					<HStack className="border-t border-divider bg-content2 p-4" fullWidth justifyContent="between">
						<HStack gap={2}>
							<span className="text-sm text-foreground/60">
								{selectionCount}개 선택됨
							</span>
							<Button size="sm" variant="light" onPress={handleSelectAll}>
								전체 선택
							</Button>
						</HStack>
						<HStack gap={2}>
							<Button size="sm" variant="flat" color="danger" onPress={handleDeleteSelected}>
								삭제
							</Button>
							<Button size="sm" variant="flat" onPress={handleMoveSelected}>
								이동
							</Button>
						</HStack>
					</HStack>
				)}
			</VStack>
		);
	},
);

AssetManager.displayName = "AssetManager";
