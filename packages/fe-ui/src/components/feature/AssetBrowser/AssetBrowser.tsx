"use client";

import { useAssetStore } from "@cocrepo/store";
import type { AssetKind } from "@cocrepo/prisma";
import { cn, Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { FileX, Image, FileVideo, FileText, File } from "lucide-react";
import { useState, useEffect } from "react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import type { Asset } from "../AssetDetailHeader/types";

export { type Asset } from "../AssetDetailHeader/types";

export interface AssetBrowserProps {
	/** 초기 폴더 ID */
	initialFolderId?: string | null;
	/** 표시할 에셋 목록 */
	assets?: Asset[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** Picker 모드 여부 */
	pickerMode?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 에셋 클릭 핸들러 */
	onAssetClick?: (asset: Asset) => void;
	/** 에셋 선택 핸들러 (Picker 모드) */
	onAssetSelect?: (assets: Asset[]) => void;
	/** 더 많은 데이터 로드 핸들러 */
	onLoadMore?: () => void;
}

/**
 * AssetBrowser Feature 컴포넌트
 *
 * 에셋 목록을 그리드 또는 리스트 형태로 표시합니다.
 * AssetStore와 연결하여 뷰 모드, 선택 상태를 관리합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: AssetGridPanel, AssetList (순수 UI)
 * - Feature: AssetBrowser (Store 연결, API 호출, 무한 스크롤)
 *
 * @example
 * ```tsx
 * <AssetBrowser
 *   assets={assetList}
 *   isLoading={isLoading}
 *   onAssetClick={handleAssetClick}
 * />
 * ```
 */
export const AssetBrowser = observer(
	({
		initialFolderId,
		assets = [],
		isLoading = false,
		pickerMode = false,
		className,
		onAssetClick,
		onAssetSelect,
		onLoadMore,
	}: AssetBrowserProps) => {
		const assetStore = useAssetStore();
		const { viewMode, selectedAssetIds, currentFolderId } = assetStore;

		// 무한 스크롤을 위한 상태
		const [displayedAssets, setDisplayedAssets] = useState<Asset[]>([]);
		const [page, setPage] = useState(1);
		const itemsPerPage = 20;

		/**
		 * 에셋 타입별 아이콘 렌더링
		 */
		const renderAssetIcon = (kind: AssetKind) => {
			switch (kind) {
				case "IMAGE":
					return <Image className="size-6 text-blue-500" />;
				case "VIDEO":
					return <FileVideo className="size-6 text-purple-500" />;
				case "DOCUMENT":
					return <FileText className="size-6 text-orange-500" />;
				default:
					return <File className="size-6 text-gray-500" />;
			}
		};

		/**
		 * 파일 크기 포맷팅
		 */
		const formatFileSize = (bytes: number): string => {
			if (bytes === 0) return "0 B";
			const k = 1024;
			const sizes = ["B", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
		};

		/**
		 * 에셋 선택 토글
		 */
		const handleAssetToggle = (assetId: string) => {
			assetStore.toggleAssetSelection(assetId);
		};

		/**
		 * 에셋 클릭
		 */
		const handleAssetClick = (asset: Asset) => {
			if (pickerMode) {
				handleAssetToggle(asset.id);
			} else {
				onAssetClick?.(asset);
			}
		};

		/**
		 * 에셋이 선택되었는지 확인
		 */
		const isSelected = (assetId: string): boolean => {
			return selectedAssetIds.has(assetId);
		};

		/**
		 * 무한 스크롤 핸들러
		 */
		const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const target = e.target as HTMLDivElement;
			const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

			if (scrollBottom < 100 && !isLoading && displayedAssets.length < assets.length) {
				setPage((prev) => prev + 1);
				onLoadMore?.();
			}
		};

		/**
		 * 썸네일 URL 가져오기
		 */
		const getThumbnailUrl = (asset: Asset): string | undefined => {
			// metadata에 thumbnailUrl이 있으면 사용
			const metadata = asset.metadata as Record<string, unknown> | null;
			if (metadata?.thumbnailUrl) {
				return metadata.thumbnailUrl as string;
			}
			// 이미지 타입이면 원본 URL 사용
			if (asset.kind === "IMAGE") {
				return `/api/assets/${asset.id}/file`;
			}
			return undefined;
		};

		/**
		 * 날짜 포맷팅
		 */
		const formatDate = (date: Date | string): string => {
			const d = typeof date === "string" ? new Date(date) : date;
			return d.toLocaleDateString();
		};

		// 페이지 변경 시 표시할 에셋 업데이트
		useEffect(() => {
			setDisplayedAssets(assets.slice(0, page * itemsPerPage));
		}, [assets, page]);

		// 초기 폴더 설정
		useEffect(() => {
			if (initialFolderId !== undefined) {
				assetStore.setCurrentFolder(initialFolderId);
			}
		}, [initialFolderId, assetStore]);

		// 로딩 상태
		if (isLoading && displayedAssets.length === 0) {
			return (
				<VStack className={cn("h-full w-full", className)} alignItems="center" justifyContent="center">
					<Spinner size="lg" />
					<span className="text-sm text-foreground/60">에셋을 불러오는 중...</span>
				</VStack>
			);
		}

		// 빈 상태
		if (!isLoading && displayedAssets.length === 0) {
			return (
				<VStack className={cn("h-full w-full", className)} alignItems="center" justifyContent="center" gap={4}>
					<FileX className="size-16 text-foreground/30" />
					<VStack alignItems="center" gap={1}>
						<span className="text-lg font-medium text-foreground/70">에셋이 없습니다</span>
						<span className="text-sm text-foreground/50">
							새로운 에셋을 업로드해 보세요
						</span>
					</VStack>
				</VStack>
			);
		}

		// 그리드 뷰
		if (viewMode === "grid") {
			return (
				<div
					className={cn("flex h-full flex-col gap-4 overflow-y-auto", className)}
					onScroll={handleScroll}
				>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
						{displayedAssets.map((asset) => (
							<button
								key={asset.id}
								type="button"
								onClick={() => handleAssetClick(asset)}
								className={cn(
									"group relative overflow-hidden rounded-xl border bg-content1 transition-all hover:shadow-md",
									isSelected(asset.id)
										? "border-primary ring-2 ring-primary/30"
										: "border-divider hover:border-primary/30",
								)}
							>
								{/* 썸네일 영역 */}
								<div className="aspect-square bg-content2">
									{getThumbnailUrl(asset) ? (
										<img
											src={getThumbnailUrl(asset)}
											alt={asset.originalName}
											className="h-full w-full object-cover"
										/>
									) : (
										<VStack className="h-full w-full" alignItems="center" justifyContent="center">
											{renderAssetIcon(asset.kind)}
										</VStack>
									)}
								</div>

								{/* 파일명 */}
								<div className="p-2">
									<p className="truncate text-xs font-medium text-foreground/80">
										{asset.originalName}
									</p>
									<p className="text-[10px] text-foreground/50">
										{formatFileSize(asset.sizeBytes)}
									</p>
								</div>

								{/* 선택 표시 */}
								{isSelected(asset.id) && (
									<div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
										✓
									</div>
								)}
							</button>
						))}
					</div>

					{/* 더 로드 중 표시 */}
					{isLoading && displayedAssets.length > 0 && (
						<VStack alignItems="center" className="py-4">
							<Spinner size="sm" />
						</VStack>
					)}
				</div>
			);
		}

		// 리스트 뷰
		return (
			<div
				className={cn("flex h-full flex-col overflow-y-auto", className)}
				onScroll={handleScroll}
			>
				{/* 헤더 */}
				<HStack className="border-b border-divider bg-content2 px-4 py-2 text-xs font-medium text-foreground/60" fullWidth>
					<span className="w-8" /> {/* 체크박스 공간 */}
					<span className="w-12">미리보기</span>
					<span className="flex-1">파일명</span>
					<span className="w-20">타입</span>
					<span className="w-24">크기</span>
					<span className="w-24">날짜</span>
				</HStack>

				{/* 리스트 아이템 */}
				{displayedAssets.map((asset) => (
					<button
						key={asset.id}
						type="button"
						onClick={() => handleAssetClick(asset)}
						className={cn(
							"flex w-full items-center border-b border-divider px-4 py-3 text-left transition-colors hover:bg-content2",
							isSelected(asset.id) && "bg-primary/5",
						)}
					>
						{/* 선택 체크박스 */}
						<span className="w-8">
							{isSelected(asset.id) && (
								<span className="flex size-4 items-center justify-center rounded bg-primary text-[10px] text-primary-foreground">
									✓
								</span>
							)}
						</span>

						{/* 미리보기 */}
						<span className="w-12">
							{getThumbnailUrl(asset) ? (
								<img
									src={getThumbnailUrl(asset)}
									alt={asset.originalName}
									className="size-10 rounded object-cover"
								/>
							) : (
								<VStack className="size-10 rounded bg-content3" alignItems="center" justifyContent="center">
									{renderAssetIcon(asset.kind)}
								</VStack>
							)}
						</span>

						{/* 파일명 */}
						<span className="flex-1 truncate text-sm font-medium">{asset.originalName}</span>

						{/* 타입 */}
						<span className="w-20 text-xs text-foreground/60">{asset.kind}</span>

						{/* 크기 */}
						<span className="w-24 text-xs text-foreground/60">{formatFileSize(asset.sizeBytes)}</span>

						{/* 날짜 */}
						<span className="w-24 text-xs text-foreground/60">
							{formatDate(asset.createdAt)}
						</span>
					</button>
				))}

				{/* 더 로드 중 표시 */}
				{isLoading && displayedAssets.length > 0 && (
					<VStack alignItems="center" className="py-4">
						<Spinner size="sm" />
					</VStack>
				)}
			</div>
		);
	},
);

AssetBrowser.displayName = "AssetBrowser";
