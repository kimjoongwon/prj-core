"use client";

import { useAssetStore } from "@cocrepo/store";
import type { AssetKind } from "@cocrepo/prisma";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	cn,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { FolderNavigator, type FolderItem } from "../FolderNavigator";
import { AssetBrowser } from "../AssetBrowser";
import type { Asset } from "../AssetDetailHeader/types";

export { type Asset } from "../AssetDetailHeader/types";
export { type FolderItem } from "../FolderNavigator";

export interface AssetPickerProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 닫기 핸들러 */
	onClose: () => void;
	/** 선택 완료 핸들러 */
	onSelect: (assets: Asset[]) => void;
	/** 선택 모드 (기본: single) */
	selectionMode?: "single" | "multiple";
	/** 허용 타입 (예: ["IMAGE"]) */
	allowedTypes?: AssetKind[];
	/** 초기 폴더 ID */
	initialFolderId?: string | null;
	/** 초기 선택 ID */
	initialSelectedIds?: string[];
	/** 모달 제목 */
	title?: string;
	/** 폴더 트리 표시 여부 */
	showFolderTree?: boolean;
	/** 검색창 표시 여부 */
	showSearch?: boolean;
	/** 타입 필터 표시 여부 */
	showTypeFilter?: boolean;
	/** 최대 선택 수 (다중 모드) */
	maxSelection?: number;
	/** 폴더 트리 데이터 (외부 주입) */
	folders?: FolderItem[];
	/** 에셋 목록 데이터 (외부 주입) */
	assets?: Asset[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * AssetPicker Feature 컴포넌트
 *
 * 에셋 선택을 위한 모달 컴포넌트입니다.
 * 단일/다중 선택 모드, 타입 필터링, 폴더 탐색을 지원합니다.
 *
 * **컴포넌트 계층:**
 * - Feature: FolderNavigator, AssetBrowser
 * - UI: Modal, Button
 * - Feature: AssetPicker (Store 연결, Picker 로직)
 *
 * @example
 * ```tsx
 * // 단일 이미지 선택
 * <AssetPicker
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSelect={(assets) => console.log(assets)}
 *   selectionMode="single"
 *   allowedTypes={["IMAGE"]}
 *   folders={folderData}
 *   assets={assetData}
 * />
 *
 * // 다중 선택
 * <AssetPicker
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSelect={(assets) => console.log(assets)}
 *   selectionMode="multiple"
 *   maxSelection={5}
 *   folders={folderData}
 *   assets={assetData}
 * />
 * ```
 */
export const AssetPicker = observer(
	({
		isOpen,
		onClose,
		onSelect,
		selectionMode = "single",
		allowedTypes = [],
		initialFolderId = null,
		initialSelectedIds = [],
		title = "에셋 선택",
		showFolderTree = true,
		showSearch = true,
		showTypeFilter = true,
		maxSelection,
		folders = [],
		assets = [],
		isLoading = false,
		className,
	}: AssetPickerProps) => {
		const assetStore = useAssetStore();

		// 내부 상태
		const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

		// Picker 모드 진입/종료
		useEffect(() => {
			if (isOpen) {
				assetStore.enterPickerMode({
					selectionMode,
					allowedTypes,
					initialSelection: initialSelectedIds,
					onSelect: (assetIds) => {
						// 선택된 ID에 해당하는 에셋 찾기
						const selected = assets.filter((a) => assetIds.includes(a.id));
						onSelect(selected);
					},
					onClose,
				});
			} else {
				assetStore.exitPickerMode();
				setSelectedAssets([]);
			}
		}, [isOpen, selectionMode, allowedTypes, initialSelectedIds, assetStore, onClose, onSelect, assets]);

		// 선택된 에셋 업데이트
		useEffect(() => {
			const selected = assets.filter((a) => assetStore.selectedAssetIds.has(a.id));
			setSelectedAssets(selected);
		}, [assetStore.selectedAssetIds, assets]);

		/**
		 * 선택 완료
		 */
		const handleConfirm = () => {
			assetStore.confirmSelection();
		};

		/**
		 * 취소
		 */
		const handleCancel = () => {
			assetStore.cancelPicker();
		};

		/**
		 * 에셋 클릭 핸들러
		 */
		const handleAssetClick = (asset: Asset) => {
			// 최대 선택 수 체크
			if (maxSelection && assetStore.selectionCount >= maxSelection) {
				// 이미 선택된 항목이면 해제 허용
				if (!assetStore.selectedAssetIds.has(asset.id)) {
					return;
				}
			}
		};

		/**
		 * 선택 수 텍스트
		 */
		const getSelectionText = () => {
			if (selectionMode === "single") {
				const selected = selectedAssets[0];
				return selected ? selected.originalName : "선택된 항목 없음";
			}

			const count = assetStore.selectionCount;
			if (maxSelection) {
				return `${count}개 선택됨 (최대 ${maxSelection}개)`;
			}
			return `${count}개 선택됨`;
		};

		/**
		 * 확인 버튼 비활성화 여부
		 */
		const isConfirmDisabled = () => {
			return assetStore.selectionCount === 0;
		};

		return (
			<Modal
				isOpen={isOpen}
				onClose={handleCancel}
				size="5xl"
				scrollBehavior="inside"
				className={className}
			>
				<ModalContent>
					<ModalHeader className="flex items-center justify-between">
						<span>{title}</span>
						<span className="text-sm font-normal text-foreground/60">
							{selectionMode === "multiple" ? "여러 개 선택 가능" : "하나만 선택"}
						</span>
					</ModalHeader>

					<ModalBody className="p-0">
						<HStack className="h-[500px] w-full" gap={0}>
							{/* 폴더 트리 */}
							{showFolderTree && (
								<div className="h-full w-64 border-r border-divider bg-content1">
									<FolderNavigator
										folders={folders}
										onFolderSelect={() => {
											// 폴더 변경 시 에셋 로드는 외부에서 처리
										}}
									/>
								</div>
							)}

							{/* 에셋 브라우저 */}
							<div className="flex-1 overflow-hidden">
								<AssetBrowser
									assets={assets}
									isLoading={isLoading}
									pickerMode
									initialFolderId={initialFolderId}
									onAssetClick={handleAssetClick}
								/>
							</div>
						</HStack>
					</ModalBody>

					<ModalFooter className="flex items-center justify-between">
						{/* 선택된 항목 정보 */}
						<span className="text-sm text-foreground/60">{getSelectionText()}</span>

						{/* 버튼 */}
						<HStack gap={2}>
							<Button variant="flat" onPress={handleCancel}>
								취소
							</Button>
							<Button
								color="primary"
								onPress={handleConfirm}
								isDisabled={isConfirmDisabled()}
							>
								{selectionMode === "single" ? "선택" : `선택 완료 (${assetStore.selectionCount})`}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	},
);

AssetPicker.displayName = "AssetPicker";
