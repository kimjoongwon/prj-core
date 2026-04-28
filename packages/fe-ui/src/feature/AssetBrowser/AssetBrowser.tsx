"use client";

import type {
	InputConfig,
	MetaDataGridColumnConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
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
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, type ChangeEvent, useRef, useState } from "react";
import { buildAssetTableColumns } from "../../columns";
import { EmptyState } from "../../display";
import { MetaDataGrid, MetaDataGridStateModel } from "../../data-grid";
import { Surface } from "../../surface";
import {
	AssetPreviewDialog,
	FolderTree,
	type FolderTreeItem,
	PageTitleBar,
} from "../../widget";

const searchInputConfig: InputConfig = {
	type: "search",
	id: "search",
	placeholder: "파일명 검색...",
};

const kindInputConfig: InputConfig = {
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
};

const statusInputConfig: InputConfig = {
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
};

const manageLeftInputs: InputConfig[] = [
	searchInputConfig,
	kindInputConfig,
	statusInputConfig,
];

const pickerLeftInputs: InputConfig[] = [searchInputConfig];

export const assetBrowserQueryInputs: InputConfig[] = [
	...manageLeftInputs,
	{
		type: "select",
		id: "folderId",
		placeholder: "폴더",
	},
];

export interface AssetBrowserQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	kind: string;
	status: string;
	folderId: string;
}

export type AssetBrowserSetQueryStates = MetaDataGridSetQueryStates;

export type AssetBrowserMode = "manage" | "picker";
export type AssetBrowserPresentation = "inline" | "modal";

export interface AssetBrowserAsset {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status: "UPLOADING" | "READY" | "FAILED";
	mimeType: string;
	sizeBytes: number;
	createdAt: string;
	publicUrl?: string | null;
}

export interface AssetBrowserProps {
	mode: AssetBrowserMode;
	presentation?: AssetBrowserPresentation;
	title: string;
	description: string;
	assets: AssetBrowserAsset[];
	totalCount: number;
	folders: FolderTreeItem[];
	queryStates: AssetBrowserQueryStates;
	setQueryStates: AssetBrowserSetQueryStates;
	isLoading: boolean;
	isStoreReady: boolean;
	hasSelectedSpace: boolean;
	isRemoving: boolean;
	isUploadingAsset: boolean;
	isCreatingFolder: boolean;
	isUpdatingFolder: boolean;
	isRemovingFolder: boolean;
	isOpen?: boolean;
	onClose?: () => void;
	selectedAssetId?: string;
	onSelectAsset?: (asset: AssetBrowserAsset) => void;
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

export function isUploadActionDisabled({
	isStoreReady,
	hasSelectedSpace,
	isUploadingAsset,
}: Pick<
	AssetBrowserProps,
	"isStoreReady" | "hasSelectedSpace" | "isUploadingAsset"
>) {
	return !isStoreReady || !hasSelectedSpace || isUploadingAsset;
}

export function getUploadRequirementMessage(
	selectedFolderId: string | null,
	folderCount: number,
) {
	if (selectedFolderId) {
		return null;
	}

	return folderCount > 0
		? "업로드할 폴더를 먼저 선택해주세요."
		: "업로드하려면 먼저 폴더를 생성해주세요.";
}

function AssetsGridFallback({
	queryStates,
	setQueryStates,
	columns,
	leftInputs,
}: {
	queryStates: AssetBrowserQueryStates;
	setQueryStates: AssetBrowserSetQueryStates;
	columns: MetaDataGridColumnConfig<AssetBrowserAsset>[];
	leftInputs: InputConfig[];
}) {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	return (
		<div className={assetsLayoutClassName}>
			<div className={assetsSidebarPanelClassName}>
				<FolderTree folders={[]} isLoading className="bg-transparent" />
			</div>
			<div className={assetsGridPanelClassName}>
				<MetaDataGrid
					config={{
						entity: "Asset",
						columns,
						leftInputs,
						emptyMessage: "등록된 에셋이 없습니다.",
					}}
	rows={[]}
	totalCount={0}
	isLoading={true}
	state={gridState}
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

export const AssetBrowser = observer(
	({
		mode,
		presentation = "inline",
		title,
		description,
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
		isOpen = false,
		onClose,
		selectedAssetId,
		onSelectAsset,
		onUploadAsset,
		onDeleteAsset,
		onCreateFolder,
		onRenameFolder,
		onDeleteFolder,
	}: AssetBrowserProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
		const fileInputRef = useRef<HTMLInputElement | null>(null);
		const createFolderModal = useDisclosure();
		const renameFolderModal = useDisclosure();
		const deleteFolderModal = useDisclosure();
		const selectedFolderId =
			typeof queryStates.folderId === "string" && queryStates.folderId
				? queryStates.folderId
				: null;
		const [activeFolder, setActiveFolder] = useState<FolderTreeItem | null>(
			null,
		);
		const [newFolderName, setNewFolderName] = useState("");
		const [newFolderNameError, setNewFolderNameError] = useState<string | null>(
			null,
		);
		const [renameFolderName, setRenameFolderName] = useState("");
		const [renameFolderNameError, setRenameFolderNameError] = useState<
			string | null
		>(null);
		const [uploadRequirementMessage, setUploadRequirementMessage] = useState<
			string | null
		>(null);
		const [previewingAsset, setPreviewingAsset] =
			useState<AssetBrowserAsset | null>(null);

		const visibleLeftInputs =
			mode === "picker" ? pickerLeftInputs : manageLeftInputs;

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
			setUploadRequirementMessage(null);
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
			if (!selectedFolderId) {
				setUploadRequirementMessage(
					getUploadRequirementMessage(selectedFolderId, folders.length),
				);
				return;
			}

			setUploadRequirementMessage(null);
			fileInputRef.current?.click();
		};

		const onChangeAssetFileInput = (event: ChangeEvent<HTMLInputElement>) => {
			const selectedFile = event.target.files?.[0];
			event.target.value = "";
			if (!selectedFile || !selectedFolderId) {
				return;
			}

			setUploadRequirementMessage(null);
			void onUploadAsset(selectedFile, selectedFolderId);
		};

		const onClickDeleteAssetButton = (assetId: string) => {
			if (previewingAsset?.id === assetId) {
				setPreviewingAsset(null);
			}

			void onDeleteAsset(assetId);
		};

		const onClickPreviewAssetButton = (asset: AssetBrowserAsset) => {
			setPreviewingAsset(asset);
		};

		const onClickSelectAssetButton = (asset: AssetBrowserAsset) => {
			void onSelectAsset?.(asset);
		};

		const onSelectFolder = (folder: FolderTreeItem | null) => {
			setUploadRequirementMessage(null);
			void setQueryStates({
				folderId: folder?.id ?? "",
				skip: 0,
			});
		};

		const columns = buildAssetTableColumns<AssetBrowserAsset>({
			isRemoving,
			onClickDeleteAssetButton,
			onClickPreviewAssetButton:
				mode === "manage" ? onClickPreviewAssetButton : undefined,
			mode,
			selectedAssetId,
			onClickSelectAssetButton,
		});
		const emptyMessage = getAssetEmptyMessage(folders, selectedFolderId);

		const browserContent = (
			<>
				<Surface className="overflow-hidden rounded-[1.75rem] border-divider/80 bg-content1/75">
					{!isStoreReady ? (
						<AssetsGridFallback
							queryStates={queryStates}
							setQueryStates={setQueryStates}
							columns={columns}
							leftInputs={visibleLeftInputs}
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
										columns,
										leftInputs: visibleLeftInputs,
										emptyMessage,
									}}
	rows={assets}
	totalCount={totalCount}
	isLoading={isLoading}
	state={gridState}
/>
							</div>
						</div>
					)}
				</Surface>

				<input
					ref={fileInputRef}
					type="file"
					className="hidden"
					onChange={onChangeAssetFileInput}
				/>
				<AssetPreviewDialog
					asset={previewingAsset}
					isOpen={Boolean(previewingAsset)}
					onClose={() => {
						setPreviewingAsset(null);
					}}
				/>
			</>
		);

		const overlayModals = (
			<>
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
							<div className="space-y-2">
								<p className="text-sm text-default-700">
									선택한 폴더를 삭제하시겠습니까?
								</p>
								<p className="text-sm text-default-500">
									하위 폴더와 에셋이 있는 경우 서버 정책에 따라 삭제가 거부될 수
									있습니다.
								</p>
								{activeFolder ? (
									<div className="rounded-lg bg-default-100 px-3 py-2 text-sm font-medium">
										{activeFolder.name}
									</div>
								) : null}
							</div>
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

		const uploadAction = (
			<div className="flex flex-col items-end gap-1">
				<Button
					variant="flat"
					color="primary"
					startContent={<Upload className="h-4 w-4" />}
					onPress={onClickUploadButton}
					isLoading={isUploadingAsset}
					isDisabled={isUploadActionDisabled({
						isStoreReady,
						hasSelectedSpace,
						isUploadingAsset,
					})}
				>
					업로드
				</Button>
				{uploadRequirementMessage ? (
					<p
						role="status"
						className="max-w-56 text-right text-xs text-default-500"
					>
						{uploadRequirementMessage}
					</p>
				) : null}
			</div>
		);

		if (presentation === "modal") {
			return (
				<>
					<Modal
						isOpen={isOpen}
						onClose={onClose}
						size="5xl"
						scrollBehavior="inside"
						classNames={{
							base: "max-w-[min(96vw,1200px)]",
						}}
					>
						<ModalContent>
							<ModalHeader className="flex-col items-stretch gap-0">
								<PageTitleBar
									title={title}
									description={description}
									actions={uploadAction}
								/>
							</ModalHeader>
							<ModalBody className="pt-0 pb-6">{browserContent}</ModalBody>
						</ModalContent>
					</Modal>
					{overlayModals}
				</>
			);
		}

		return (
			<>
				<div className="space-y-6 md:space-y-7">
					<PageTitleBar
						title={title}
						description={description}
						actions={uploadAction}
					/>
					{browserContent}
				</div>
				{overlayModals}
			</>
		);
	},
);
