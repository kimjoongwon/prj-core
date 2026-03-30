"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	buildAssetTableColumns,
	EmptyState,
	FolderTree,
	type FolderTreeItem,
	MetaDataGrid,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Upload } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, useRef, useState } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "파일명 검색...",
		props: {
			debounceMs: 300,
		},
	},
	{
		type: "select",
		id: "kind",
		placeholder: "타입",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "이미지", value: "IMAGE" },
				{ label: "비디오", value: "VIDEO" },
				{ label: "문서", value: "DOCUMENT" },
			],
		},
	},
	{
		type: "select",
		id: "status",
		placeholder: "상태",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "업로드 중", value: "UPLOADING" },
				{ label: "완료", value: "READY" },
				{ label: "실패", value: "FAILED" },
			],
		},
	},
];

const queryStateInputs: InputConfig[] = [
	...leftInputs,
	{
		type: "select",
		id: "folderId",
		placeholder: "폴더",
	},
];

export const adminAssetsPageQueryInputs = [...queryStateInputs];

export type AdminAssetsPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminAssetsPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminAssetsPageAsset {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status: "UPLOADING" | "READY" | "FAILED";
	mimeType: string;
	sizeBytes: number;
	createdAt: string;
}

export interface AdminAssetsPageProps {
	assets: AdminAssetsPageAsset[];
	totalCount: number;
	folders: FolderTreeItem[];
	queryStates: AdminAssetsPageQueryStates;
	setQueryStates: AdminAssetsPageSetQueryStates;
	isLoading: boolean;
	isStoreReady: boolean;
	hasSelectedSpace: boolean;
	isRemoving: boolean;
	isUploadingAsset: boolean;
	isCreatingFolder: boolean;
	isUpdatingFolder: boolean;
	isRemovingFolder: boolean;
	onUploadAsset: (file: File, folderId: string) => Promise<void>;
	onDeleteAsset: (assetId: string) => Promise<void>;
	onCreateFolder: (input: {
		name: string;
		parentFolderId?: string;
	}) => Promise<void>;
	onRenameFolder: (input: { folderId: string; name: string }) => Promise<void>;
	onDeleteFolder: (folderId: string) => Promise<void>;
}

const assetsLayoutClassName =
	"grid min-h-[520px] grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6";

const assetsSidebarPanelClassName =
	"overflow-hidden rounded-[1.25rem] border border-divider/70 bg-default-50/70 shadow-sm";

const assetsGridPanelClassName =
	"min-w-0 rounded-[1.25rem] border border-divider/70 bg-content1/85 px-4 py-4 shadow-sm sm:px-5 sm:py-5";

const getAssetEmptyMessage = (
	folders: FolderTreeItem[],
	selectedFolderId: string | null,
) => {
	if (!selectedFolderId) {
		return "등록된 에셋이 없습니다.";
	}

	const selectedFolder = folders.find(
		(folder) => folder.id === selectedFolderId,
	);
	if (!selectedFolder) {
		return "선택한 폴더에 등록된 에셋이 없습니다.";
	}

	return `${selectedFolder.name} 폴더에 등록된 에셋이 없습니다.`;
};

function AssetsGridFallback({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: AdminAssetsPageQueryStates;
	setQueryStates: AdminAssetsPageSetQueryStates;
	columns: MetaDataGridColumnConfig<AdminAssetsPageAsset>[];
}) {
	return (
		<div className={assetsLayoutClassName}>
			<div className={assetsSidebarPanelClassName}>
				<FolderTree folders={[]} isLoading className="bg-transparent" />
			</div>
			<div className={assetsGridPanelClassName}>
				<MetaDataGrid
					config={{
						entity: "Asset",
						data: [],
						totalCount: 0,
						isLoading: true,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 에셋이 없습니다.",
					}}
				/>
			</div>
		</div>
	);
}

function AssetsSpaceEmptyState() {
	return (
		<div className="rounded-[1.25rem] border border-dashed border-divider/70 bg-default-50/60 p-8 md:p-10">
			<EmptyState
				title="Space를 선택하면 에셋을 조회할 수 있습니다"
				description="상단 Space 선택기를 통해 관리하려는 공간을 먼저 선택해주세요."
				statusLabel="Space 미선택"
			/>
		</div>
	);
}

export const AdminAssetsPage = observer(({
	assets,
	totalCount,
	folders,
	queryStates,
	setQueryStates,
	isLoading,
	isStoreReady,
	hasSelectedSpace,
	isRemoving,
	isUploadingAsset,
	isCreatingFolder,
	isUpdatingFolder,
	isRemovingFolder,
	onUploadAsset,
	onDeleteAsset,
	onCreateFolder,
	onRenameFolder,
	onDeleteFolder,
}: AdminAssetsPageProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const createFolderModal = useDisclosure();
	const renameFolderModal = useDisclosure();
	const deleteFolderModal = useDisclosure();
	const selectedFolderId =
		typeof queryStates.folderId === "string" && queryStates.folderId
			? queryStates.folderId
			: null;
	const [activeFolder, setActiveFolder] = useState<FolderTreeItem | null>(null);
	const [newFolderName, setNewFolderName] = useState("");
	const [newFolderNameError, setNewFolderNameError] = useState<string | null>(
		null,
	);
	const [renameFolderName, setRenameFolderName] = useState("");
	const [renameFolderNameError, setRenameFolderNameError] = useState<
		string | null
	>(null);

	const onResetCreateFolderForm = () => {
		setNewFolderName("");
		setNewFolderNameError(null);
	};

	const onResetRenameFolderForm = () => {
		setRenameFolderName("");
		setRenameFolderNameError(null);
		setActiveFolder(null);
	};

	const onCloseCreateFolderModal = () => {
		if (isCreatingFolder) {
			return;
		}

		createFolderModal.onClose();
		onResetCreateFolderForm();
	};

	const onCloseRenameFolderModal = () => {
		if (isUpdatingFolder) {
			return;
		}

		renameFolderModal.onClose();
		onResetRenameFolderForm();
	};

	const onCloseDeleteFolderModal = () => {
		if (isRemovingFolder) {
			return;
		}

		deleteFolderModal.onClose();
		setActiveFolder(null);
	};

	const onClickCreateFolderButton = () => {
		onResetCreateFolderForm();
		createFolderModal.onOpen();
	};

	const onClickRenameFolderButton = (folder: FolderTreeItem) => {
		setActiveFolder(folder);
		setRenameFolderName(folder.name);
		setRenameFolderNameError(null);
		renameFolderModal.onOpen();
	};

	const onClickDeleteFolderButton = (folder: FolderTreeItem) => {
		setActiveFolder(folder);
		deleteFolderModal.onOpen();
	};

	const onClickCreateFolderSubmitButton = async () => {
		const trimmedFolderName = newFolderName.trim();
		if (!trimmedFolderName) {
			setNewFolderNameError("폴더명을 입력해주세요.");
			return;
		}

		try {
			await onCreateFolder({
				name: trimmedFolderName,
				...(selectedFolderId ? { parentFolderId: selectedFolderId } : {}),
			});
			createFolderModal.onClose();
			onResetCreateFolderForm();
		} catch {
			return;
		}
	};

	const onClickRenameFolderSubmitButton = async () => {
		const trimmedFolderName = renameFolderName.trim();
		if (!trimmedFolderName) {
			setRenameFolderNameError("폴더명을 입력해주세요.");
			return;
		}

		if (!activeFolder) {
			return;
		}

		try {
			await onRenameFolder({
				folderId: activeFolder.id,
				name: trimmedFolderName,
			});
			renameFolderModal.onClose();
			onResetRenameFolderForm();
		} catch {
			return;
		}
	};

	const onClickDeleteFolderConfirmButton = async () => {
		if (!activeFolder) {
			return;
		}

		try {
			await onDeleteFolder(activeFolder.id);
			deleteFolderModal.onClose();
			setActiveFolder(null);
			void setQueryStates({
				folderId: activeFolder.parentFolderId ?? "",
				skip: 0,
			});
		} catch {
			return;
		}
	};

	const onClickUploadButton = () => {
		if (selectedFolderId) {
			fileInputRef.current?.click();
		}
	};

	const onChangeAssetFileInput = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		event.target.value = "";
		if (!selectedFile || !selectedFolderId) {
			return;
		}

		void onUploadAsset(selectedFile, selectedFolderId);
	};

	const onClickDeleteAssetButton = (assetId: string) => {
		void onDeleteAsset(assetId);
	};

	const onSelectFolder = (folder: FolderTreeItem | null) => {
		void setQueryStates({
			folderId: folder?.id ?? "",
			skip: 0,
		});
	};

	const columns = buildAssetTableColumns<AdminAssetsPageAsset>({
		isRemoving,
		onClickDeleteAssetButton,
	});
	const emptyMessage = getAssetEmptyMessage(folders, selectedFolderId);

	return (
		<>
			<div className="space-y-6 md:space-y-7">
				<PageTitleBar
					title="에셋 관리"
					description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
					actions={
						<Button
							variant="flat"
							color="primary"
							startContent={<Upload className="h-4 w-4" />}
							onPress={onClickUploadButton}
							isLoading={isUploadingAsset}
							isDisabled={!selectedFolderId || isUploadingAsset}
						>
							업로드
						</Button>
					}
				/>

				<Surface className="overflow-hidden rounded-[1.75rem] border-divider/80 bg-content1/75">
					{!isStoreReady ? (
						<AssetsGridFallback
							queryStates={queryStates}
							setQueryStates={setQueryStates}
							columns={columns}
						/>
					) : !hasSelectedSpace ? (
						<AssetsSpaceEmptyState />
					) : (
						<div className={assetsLayoutClassName}>
							<div className={assetsSidebarPanelClassName}>
								<FolderTree
									folders={folders}
									selectedFolderId={selectedFolderId}
									showCreateButton
									showRenameButton
									showDeleteButton
									onSelect={onSelectFolder}
									onCreate={onClickCreateFolderButton}
									onRename={onClickRenameFolderButton}
									onDelete={onClickDeleteFolderButton}
									isLoading={isLoading}
									className="bg-transparent"
								/>
							</div>
							<div className={assetsGridPanelClassName}>
								<MetaDataGrid
									config={{
										entity: "Asset",
										data: assets,
										totalCount,
										isLoading,
										queryStates,
										setQueryStates,
										columns,
										leftInputs,
										emptyMessage,
									}}
								/>
							</div>
						</div>
					)}
				</Surface>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				onChange={onChangeAssetFileInput}
			/>

			<Modal
				isOpen={createFolderModal.isOpen}
				onClose={onCloseCreateFolderModal}
				size="md"
			>
				<ModalContent>
					<ModalHeader>폴더 생성</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-3">
							<p className="text-sm text-default-500">
								{selectedFolderId
									? "현재 선택한 폴더 아래에 새 폴더를 생성합니다."
									: "루트 폴더에 새 폴더를 생성합니다."}
							</p>
							<Input
								label="폴더명"
								placeholder="새 폴더명을 입력하세요"
								value={newFolderName}
								onValueChange={(value) => {
									setNewFolderName(value);
									setNewFolderNameError(null);
								}}
								isRequired
								autoFocus
								isInvalid={Boolean(newFolderNameError)}
								errorMessage={newFolderNameError ?? undefined}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={onCloseCreateFolderModal}
							isDisabled={isCreatingFolder}
						>
							취소
						</Button>
						<Button
							color="primary"
							onPress={onClickCreateFolderSubmitButton}
							isLoading={isCreatingFolder}
							isDisabled={!newFolderName.trim()}
						>
							생성
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={renameFolderModal.isOpen}
				onClose={onCloseRenameFolderModal}
				size="md"
			>
				<ModalContent>
					<ModalHeader>폴더 이름 변경</ModalHeader>
					<ModalBody>
						<Input
							label="폴더명"
							placeholder="변경할 폴더명을 입력하세요"
							value={renameFolderName}
							onValueChange={(value) => {
								setRenameFolderName(value);
								setRenameFolderNameError(null);
							}}
							isRequired
							autoFocus
							isInvalid={Boolean(renameFolderNameError)}
							errorMessage={renameFolderNameError ?? undefined}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={onCloseRenameFolderModal}
							isDisabled={isUpdatingFolder}
						>
							취소
						</Button>
						<Button
							color="primary"
							onPress={onClickRenameFolderSubmitButton}
							isLoading={isUpdatingFolder}
							isDisabled={!renameFolderName.trim()}
						>
							저장
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={deleteFolderModal.isOpen}
				onClose={onCloseDeleteFolderModal}
				size="md"
			>
				<ModalContent>
					<ModalHeader>폴더 삭제</ModalHeader>
					<ModalBody>
						<p className="text-sm text-default-600">
							{activeFolder
								? `${activeFolder.name} 폴더를 삭제합니다.`
								: "선택한 폴더를 삭제합니다."}
						</p>
						<p className="text-sm text-danger">
							하위 폴더나 에셋이 남아 있으면 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={onCloseDeleteFolderModal}
							isDisabled={isRemovingFolder}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteFolderConfirmButton}
							isLoading={isRemovingFolder}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});
