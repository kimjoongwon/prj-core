"use client";

import { useAlbumStore, useAssetStore } from "@cocrepo/store";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Textarea,
	cn,
	Spinner,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { AssetPicker, type Asset } from "../AssetPicker";
import type { FolderItem } from "../FolderNavigator";

/** 앨범 타입 */
export interface Album {
	id: string;
	name: string;
	description?: string;
	coverAssetId?: string;
	coverAsset?: Asset;
	entryCount: number;
	createdAt: string;
	updatedAt: string;
}

/** 앨범 엔트리 타입 */
export interface AlbumEntry {
	id: string;
	albumId: string;
	assetId: string;
	asset?: Asset;
	caption?: string;
	order: number;
	createdAt: string;
}

export interface AlbumManagerProps {
	/** 모드 */
	mode?: "list" | "detail";
	/** 상세 모드일 때 앨범 ID */
	albumId?: string | null;
	/** 생성 버튼 표시 */
	showCreateButton?: boolean;
	/** 수정 버튼 표시 */
	showEditButton?: boolean;
	/** 삭제 버튼 표시 */
	showDeleteButton?: boolean;
	/** 순서 편집 버튼 표시 */
	showReorderButton?: boolean;
	/** 앨범 목록 데이터 */
	albums?: Album[];
	/** 앨범 엔트리 데이터 (상세 모드) */
	entries?: AlbumEntry[];
	/** 폴더 트리 데이터 (AssetPicker용) */
	folders?: FolderItem[];
	/** 전체 에셋 목록 (AssetPicker용) */
	assets?: Asset[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 앨범 생성 핸들러 */
	onAlbumCreate?: (data: { name: string; description?: string; coverAssetId?: string }) => void;
	/** 앨범 수정 핸들러 */
	onAlbumUpdate?: (album: Album) => void;
	/** 앨범 삭제 핸들러 */
	onAlbumDelete?: (album: Album) => void;
	/** 앨범 선택 핸들러 */
	onAlbumSelect?: (album: Album) => void;
	/** 에셋 추가 핸들러 */
	onAddAssets?: (assetIds: string[]) => void;
	/** 엔트리 제거 핸들러 */
	onRemoveEntry?: (entryId: string) => void;
	/** 순서 변경 핸들러 */
	onReorderEntries?: (entryIds: string[]) => void;
	/** 뒤로가기 핸들러 */
	onBack?: () => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * AlbumManager Feature 컴포넌트
 *
 * 앨범 관리를 담당하는 컴포넌트입니다. 앨범 생성, 수정, 삭제, 에셋 추가/제거, 순서 변경을
 * AlbumStore와 연결하여 처리합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: AlbumCard, AlbumEntryCard (순수 UI)
 * - Feature: AlbumManager (Store 연결, API 호출)
 *
 * @example
 * ```tsx
 * <AlbumManager
 *   mode="list"
 *   albums={albumList}
 *   onAlbumSelect={handleAlbumSelect}
 *   onAlbumCreate={handleAlbumCreate}
 * />
 *
 * <AlbumManager
 *   mode="detail"
 *   albumId={selectedAlbumId}
 *   entries={albumEntries}
 *   onAddAssets={handleAddAssets}
 *   onBack={handleBack}
 * />
 * ```
 */
export const AlbumManager = observer(
	({
		mode = "list",
		albumId,
		showCreateButton = true,
		showEditButton = true,
		showDeleteButton = true,
		showReorderButton = true,
		albums = [],
		entries = [],
		folders = [],
		assets = [],
		isLoading = false,
		onAlbumCreate,
		onAlbumUpdate,
		onAlbumDelete,
		onAlbumSelect,
		onAddAssets,
		onRemoveEntry,
		onReorderEntries,
		onBack,
		className,
	}: AlbumManagerProps) => {
		const albumStore = useAlbumStore();
		const assetStore = useAssetStore();

		// 폼 상태
		const [createForm, setCreateForm] = useState({ name: "", description: "" });
		const [editForm, setEditForm] = useState({ name: "", description: "" });
		const [coverAssetId, setCoverAssetId] = useState<string | undefined>();

		// 현재 앨범
		const currentAlbum = albums.find((a) => a.id === albumId);

		/**
		 * 앨범 생성 모달 열기
		 */
		const handleOpenCreateModal = () => {
			setCreateForm({ name: "", description: "" });
			setCoverAssetId(undefined);
			albumStore.openEditAlbumModal();
		};

		/**
		 * 앨범 생성
		 */
		const handleCreateAlbum = () => {
			if (!createForm.name.trim()) return;
			onAlbumCreate?.({
				name: createForm.name,
				description: createForm.description || undefined,
				coverAssetId,
			});
			albumStore.closeEditAlbumModal();
		};

		/**
		 * 앨범 수정 모달 열기
		 */
		const handleOpenEditModal = () => {
			if (currentAlbum) {
				setEditForm({
					name: currentAlbum.name,
					description: currentAlbum.description || "",
				});
				setCoverAssetId(currentAlbum.coverAssetId);
				albumStore.openEditAlbumModal();
			}
		};

		/**
		 * 앨범 수정
		 */
		const handleUpdateAlbum = () => {
			if (!editForm.name.trim() || !currentAlbum) return;
			onAlbumUpdate?.({
				...currentAlbum,
				name: editForm.name,
				description: editForm.description || undefined,
				coverAssetId,
			});
			albumStore.closeEditAlbumModal();
		};

		/**
		 * 앨범 삭제
		 */
		const handleDeleteAlbum = (album: Album) => {
			onAlbumDelete?.(album);
		};

		/**
		 * 앨범 선택
		 */
		const handleSelectAlbum = (album: Album) => {
			albumStore.setCurrentAlbum(album.id);
			onAlbumSelect?.(album);
		};

		/**
		 * 에셋 추가 모달 열기
		 */
		const handleOpenAddAssetModal = () => {
			albumStore.openAddAssetModal();
		};

		/**
		 * 에셋 추가
		 */
		const handleAddAssets = (selectedAssets: Asset[]) => {
			const assetIds = selectedAssets.map((a) => a.id);
			onAddAssets?.(assetIds);
			albumStore.closeAddAssetModal();
		};

		/**
		 * 엔트리 제거
		 */
		const handleRemoveEntry = (entryId: string) => {
			onRemoveEntry?.(entryId);
		};

		/**
		 * 순서 편집 모드 토글
		 */
		const handleToggleReorderMode = () => {
			albumStore.toggleReorderMode();
		};

		/**
		 * 커버 이미지 선택
		 */
		const handleSelectCover = (selectedAssets: Asset[]) => {
			if (selectedAssets.length > 0) {
				setCoverAssetId(selectedAssets[0].id);
			}
			assetStore.exitPickerMode();
		};

		/**
		 * 목록 모드 렌더링
		 */
		const renderListView = () => (
			<VStack className={cn("h-full", className)} gap={4}>
				{/* 헤더 */}
				<HStack justifyContent="between" alignItems="center" fullWidth>
					<VStack gap={0}>
						<h2 className="text-lg font-semibold">앨범</h2>
						<p className="text-sm text-foreground/60">에셋 컬렉션을 관리합니다.</p>
					</VStack>
					{showCreateButton && (
						<Button
							color="primary"
							startContent={<Plus className="size-4" />}
							onPress={handleOpenCreateModal}
						>
							앨범 생성
						</Button>
					)}
				</HStack>

				{/* 앨범 그리드 */}
				{isLoading ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center">
						<Spinner size="lg" />
						<span className="text-sm text-foreground/60">앨범을 불러오는 중...</span>
					</VStack>
				) : albums.length === 0 ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center" gap={2}>
						<ImageIcon className="size-16 text-foreground/30" />
						<p className="text-foreground/60">앨범이 없습니다</p>
						{showCreateButton && (
							<Button color="primary" variant="flat" onPress={handleOpenCreateModal}>
								첫 앨범 만들기
							</Button>
						)}
					</VStack>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{albums.map((album) => (
							<button
								key={album.id}
								type="button"
								onClick={() => handleSelectAlbum(album)}
								className="group overflow-hidden rounded-xl border border-divider bg-content1 text-left transition-all hover:border-primary/30 hover:shadow-md"
							>
								{/* 커버 */}
								<div className="aspect-square bg-content2">
									{album.coverAsset ? (
										<img
											src={`/api/assets/${album.coverAsset.id}/file`}
											alt={album.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<VStack className="h-full w-full" alignItems="center" justifyContent="center">
											<ImageIcon className="size-12 text-foreground/30" />
										</VStack>
									)}
								</div>
								{/* 정보 */}
								<div className="p-3">
									<p className="truncate font-medium text-sm">{album.name}</p>
									<p className="text-xs text-foreground/50">{album.entryCount}개</p>
								</div>
							</button>
						))}
					</div>
				)}
			</VStack>
		);

		/**
		 * 상세 모드 렌더링
		 */
		const renderDetailView = () => (
			<VStack className={cn("h-full", className)} gap={4}>
				{/* 헤더 */}
				<HStack justifyContent="between" alignItems="center" fullWidth>
					<HStack gap={2} alignItems="center">
						{onBack && (
							<Button variant="ghost" size="sm" onPress={onBack}>
								← 목록
							</Button>
						)}
						<VStack gap={0}>
							<h2 className="text-lg font-semibold">{currentAlbum?.name || "앨범"}</h2>
							<p className="text-sm text-foreground/60">{entries.length}개의 에셋</p>
						</VStack>
					</HStack>
					<HStack gap={2}>
						<Button
							color="primary"
							variant="flat"
							startContent={<Plus className="size-4" />}
							onPress={handleOpenAddAssetModal}
						>
							에셋 추가
						</Button>
						{showReorderButton && (
							<Button
								variant="flat"
								onPress={handleToggleReorderMode}
								color={albumStore.isReorderMode ? "primary" : "default"}
							>
								{albumStore.isReorderMode ? "편집 완료" : "순서 편집"}
							</Button>
						)}
						{showEditButton && currentAlbum && (
							<Button variant="flat" onPress={handleOpenEditModal}>
								수정
							</Button>
						)}
					</HStack>
				</HStack>

				{/* 엔트리 목록 */}
				{isLoading ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center">
						<Spinner size="lg" />
					</VStack>
				) : entries.length === 0 ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center" gap={2}>
						<ImageIcon className="size-16 text-foreground/30" />
						<p className="text-foreground/60">에셋이 없습니다</p>
						<Button color="primary" variant="flat" onPress={handleOpenAddAssetModal}>
							에셋 추가
						</Button>
					</VStack>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{entries.map((entry) => (
							<div
								key={entry.id}
								className={cn(
									"group relative overflow-hidden rounded-xl border bg-content1",
									albumStore.isReorderMode ? "border-primary/30" : "border-divider",
								)}
							>
								{/* 드래그 핸들 */}
								{albumStore.isReorderMode && (
									<div className="absolute left-2 top-2 z-10 cursor-move rounded bg-background/80 p-1">
										<GripVertical className="size-4 text-foreground/60" />
									</div>
								)}

								{/* 미리보기 */}
								<div className="aspect-square bg-content2">
									{entry.asset ? (
										<img
											src={`/api/assets/${entry.asset.id}/file`}
											alt={entry.caption || ""}
											className="h-full w-full object-cover"
										/>
									) : (
										<VStack className="h-full w-full" alignItems="center" justifyContent="center">
											<ImageIcon className="size-8 text-foreground/30" />
										</VStack>
									)}
								</div>

								{/* 정보 */}
								<div className="p-2">
									<p className="truncate text-xs">{entry.caption || entry.asset?.originalName}</p>
								</div>

								{/* 삭제 버튼 */}
								{showDeleteButton && (
									<button
										type="button"
										onClick={() => handleRemoveEntry(entry.id)}
										className="absolute right-2 top-2 rounded bg-danger/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Trash2 className="size-3 text-white" />
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</VStack>
		);

		return (
			<>
				{mode === "list" ? renderListView() : renderDetailView()}

				{/* 앨범 생성/수정 모달 */}
				<Modal
					isOpen={albumStore.isEditAlbumModalOpen}
					onClose={() => albumStore.closeEditAlbumModal()}
					size="lg"
				>
					<ModalContent>
						<ModalHeader>
							{mode === "list" && !currentAlbum ? "앨범 생성" : "앨범 수정"}
						</ModalHeader>
						<ModalBody>
							<VStack gap={4}>
								<Input
									label="앨범명"
									placeholder="앨범명을 입력하세요"
									value={mode === "list" && !currentAlbum ? createForm.name : editForm.name}
									onValueChange={(v) =>
										mode === "list" && !currentAlbum
											? setCreateForm((p) => ({ ...p, name: v }))
											: setEditForm((p) => ({ ...p, name: v }))
									}
									isRequired
								/>
								<Textarea
									label="설명"
									placeholder="설명을 입력하세요"
									value={mode === "list" && !currentAlbum ? createForm.description : editForm.description}
									onValueChange={(v) =>
										mode === "list" && !currentAlbum
											? setCreateForm((p) => ({ ...p, description: v }))
											: setEditForm((p) => ({ ...p, description: v }))
									}
								/>
								<VStack gap={2}>
									<label className="text-sm font-medium">커버 이미지</label>
									<Button
										variant="bordered"
										startContent={<ImageIcon className="size-4" />}
										onPress={() => {
											assetStore.enterPickerMode({
												selectionMode: "single",
												allowedTypes: ["IMAGE"],
												onSelect: (ids) => {
													if (ids.length > 0) setCoverAssetId(ids[0]);
												},
											});
										}}
									>
										이미지 선택
									</Button>
								</VStack>
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={() => albumStore.closeEditAlbumModal()}>
								취소
							</Button>
							<Button
								color="primary"
								onPress={mode === "list" && !currentAlbum ? handleCreateAlbum : handleUpdateAlbum}
							>
								{mode === "list" && !currentAlbum ? "생성" : "수정"}
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{/* 에셋 추가 모달 */}
				<AssetPicker
					isOpen={albumStore.isAddAssetModalOpen}
					onClose={() => albumStore.closeAddAssetModal()}
					onSelect={handleAddAssets}
					selectionMode="multiple"
					allowedTypes={["IMAGE", "VIDEO"]}
					folders={folders}
					assets={assets}
					title="에셋 추가"
				/>
			</>
		);
	},
);

AlbumManager.displayName = "AlbumManager";
