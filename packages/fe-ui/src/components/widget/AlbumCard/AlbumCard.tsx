"use client";

import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@heroui/react";
import { cn } from "@heroui/react";
import { Check, FolderOpen, MoreVertical } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetKind } from "../../ui/data-display/AssetKindBadge";
import { AssetThumbnail } from "../../ui/data-display/AssetThumbnail/AssetThumbnail";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * AlbumCard용 커버 에셋 타입
 */
export interface AlbumCoverAsset {
	id: string;
	name: string;
	kind: AssetKind;
	thumbnailUrl?: string | null;
}

/**
 * AlbumCard용 앨범 타입
 */
export interface AlbumCardItem {
	id: string;
	name: string;
	description?: string | null;
	sortOrder: number;
	coverAssetId?: string | null;
}

export interface AlbumCardProps {
	/** 앨범 데이터 */
	album: AlbumCardItem;
	/** 에셋 수 (album.albumEntries?.length) */
	assetCount?: number;
	/** 커버 이미지 URL */
	coverUrl?: string;
	/** 커버용 에셋 목록 (그리드 표시용) */
	coverAssets?: AlbumCoverAsset[];
	/** 선택 상태 */
	isSelected?: boolean;
	/** 선택 가능 여부 */
	isSelectable?: boolean;
	/** 에셋 수 표시 */
	showAssetCount?: boolean;
	/** 설명 표시 */
	showDescription?: boolean;
	/** 클릭 핸들러 */
	onClick?: (album: AlbumCardItem) => void;
	/** 선택 핸들러 */
	onSelect?: (albumId: string) => void;
	/** 수정 핸들러 */
	onEdit?: (album: AlbumCardItem) => void;
	/** 삭제 핸들러 */
	onDelete?: (album: AlbumCardItem) => void;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AlbumCard Widget 컴포넌트
 *
 * 앨범 정보를 카드 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 커버 이미지, 앨범명, 에셋 수를 보여주며 선택 및 액션을 지원합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AlbumCard
 *   album={album}
 *   assetCount={24}
 *   coverUrl="/cover.jpg"
 *   onClick={handleClick}
 * />
 * ```
 */
export const AlbumCard = observer(
	({
		album,
		assetCount = 0,
		coverUrl,
		coverAssets,
		isSelected = false,
		showAssetCount = true,
		onClick,
		onEdit,
		onDelete,
		className,
	}: AlbumCardProps) => {
		const handleClick = () => {
			onClick?.(album);
		};

		const handleEdit = () => {
			onEdit?.(album);
		};

		const handleDelete = () => {
			onDelete?.(album);
		};

		/** 커버 렌더링 (2x2 그리드 또는 단일 이미지) */
		const renderCover = () => {
			// 2x2 그리드 커버
			if (coverAssets && coverAssets.length >= 4) {
				const gridAssets = coverAssets.slice(0, 4);
				return (
					<div className="grid grid-cols-2 grid-rows-2 w-full h-full">
						{gridAssets.map((asset, index) => (
							<div key={asset.id} className={cn(
								"overflow-hidden",
								index === 0 && "rounded-tl-lg",
								index === 1 && "rounded-tr-lg",
								index === 2 && "rounded-bl-lg",
								index === 3 && "rounded-br-lg",
							)}>
								<AssetThumbnail
									src={asset.thumbnailUrl}
									alt={asset.name}
									kind={asset.kind}
									size="lg"
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				);
			}

			// 단일 커버 이미지
			if (coverUrl || (coverAssets && coverAssets.length > 0)) {
				const displayUrl = coverUrl ?? coverAssets?.[0]?.thumbnailUrl;
				return (
					<Image
						src={displayUrl ?? undefined}
						alt={album.name}
						className="w-full h-full object-cover"
						removeWrapper
					/>
				);
			}

			// 커버 없음
			return (
				<div className="w-full h-full flex items-center justify-center bg-content2">
					<FolderOpen className="w-12 h-12 text-default-300" />
				</div>
			);
		};

		/** 드롭다운 메뉴 아이템들 */
		const dropdownItems = [
			onEdit && { key: "edit", label: "수정", handler: handleEdit },
			onDelete && { key: "delete", label: "삭제", handler: handleDelete, isDanger: true },
		].filter(Boolean) as { key: string; label: string; handler: () => void; isDanger?: boolean }[];

		return (
			<Card
				isPressable
				onPress={handleClick}
				className={cn(
					"group w-[200px] transition-all duration-200",
					"hover:scale-[1.02] hover:shadow-md",
					isSelected && "ring-2 ring-primary",
					className,
				)}
			>
				<CardBody className="p-0 overflow-hidden">
					<div className="relative aspect-[4/3]">
						{renderCover()}

						{/* 선택 표시 */}
						{isSelected && (
							<div className="absolute top-2 left-2 z-10">
								<div className="bg-primary text-white rounded-full p-1">
									<Check className="w-3 h-3" />
								</div>
							</div>
						)}

						{/* 액션 버튼 (호버 시 표시) */}
						{dropdownItems.length > 0 && (
							<div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
								<Dropdown>
									<DropdownTrigger>
										<Button
											size="sm"
											variant="flat"
											isIconOnly
											className="bg-content1/80 backdrop-blur-sm"
											onClick={(e) => e.stopPropagation()}
										>
											<MoreVertical className="w-4 h-4" />
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										items={dropdownItems}
										onAction={(key) => {
											const item = dropdownItems.find(i => i.key === key);
											item?.handler();
										}}
									>
										{(item) => (
											<DropdownItem
												key={item.key}
												className={item.isDanger ? "text-danger" : undefined}
												color={item.isDanger ? "danger" : "default"}
											>
												{item.label}
											</DropdownItem>
										)}
									</DropdownMenu>
								</Dropdown>
							</div>
						)}
					</div>
				</CardBody>

				<CardFooter className="p-3">
					<VStack gap={1} className="w-full">
						<span className="text-sm font-medium truncate w-full" title={album.name}>
							{album.name}
						</span>
						{showAssetCount && (
							<span className="text-xs text-default-500">
								{assetCount}개의 에셋
							</span>
						)}
					</VStack>
				</CardFooter>
			</Card>
		);
	},
);

AlbumCard.displayName = "AlbumCard";
