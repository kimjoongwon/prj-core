"use client";

import type { AssetDto } from "@cocrepo/api/assets";
import type {
	DataGridColumnConfig,
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import { Modal, useOverlayState } from "@heroui/react";
import { Upload } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { AssetPreviewDialog } from "../../data-display/AssetPreview";
import {
	buildAssetTableColumns,
	DataGrid,
	DataGridState,
} from "../../data-grid";
import { EmptyState } from "../../feedback";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { TextField } from "../../input/TextField/TextField";
import { Screen } from "../../layout/Screen";
import { Surface } from "../../surface";
import { FolderTree, type FolderTreeItem } from "./FolderTree";

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
			{
				label: "전체",
				value: "",
			},
			{
				label: "이미지",
				value: "IMAGE",
			},
			{
				label: "비디오",
				value: "VIDEO",
			},
			{
				label: "문서",
				value: "DOCUMENT",
			},
		],
	},
};
const statusInputConfig: InputConfig = {
	type: "select",
	id: "status",
	placeholder: "상태",
	props: {
		options: [
			{
				label: "전체",
				value: "",
			},
			{
				label: "업로드 중",
				value: "UPLOADING",
			},
			{
				label: "완료",
				value: "READY",
			},
			{
				label: "실패",
				value: "FAILED",
			},
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
export interface AssetBrowserQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	kind: string;
	status: string;
	folderId: string;
}
export type AssetBrowserSetQueryStates = DataGridSetQueryStates;
export type AssetBrowserMode = "manage" | "picker";
export type AssetBrowserPresentation = "inline" | "modal";
export type AssetBrowserAsset = AssetDto;
export interface AssetBrowserProps {
	mode: AssetBrowserMode;
	presentation?: AssetBrowserPresentation;
	title: string;
	description: string;
	assets?: AssetBrowserAsset[];
	totalCount: number;
	folders: FolderTreeItem[];
	queryStates: AssetBrowserQueryStates;
	setQueryStates: AssetBrowserSetQueryStates;
	isLoading: boolean;
	isSpaceReady: boolean;
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
	"overflow-hidden rounded-[1.25rem] border border-border/70 bg-default/70 shadow-sm";
const assetsGridPanelClassName =
	"min-w-0 rounded-[1.25rem] border border-border/70 bg-surface/85 px-4 py-4 shadow-sm sm:px-5 sm:py-5";
const getAssetEmptyMessage = (
	folders: FolderTreeItem[],
	selectedFolderId: string | null,
	t: (key: string) => string,
) => {
	if (!selectedFolderId) {
		return t("등록된 에셋이 없습니다.");
	}
	const selectedFolder = folders.find(
		(folder) => folder.id === selectedFolderId,
	);
	if (!selectedFolder) {
		return t("선택한 폴더에 등록된 에셋이 없습니다.");
	}
	return `${selectedFolder.name} ${t("폴더에 등록된 에셋이 없습니다.")}`;
};
export function isUploadActionDisabled({
	isSpaceReady,
	hasSelectedSpace,
	isUploadingAsset,
}: Pick<
	AssetBrowserProps,
	"isSpaceReady" | "hasSelectedSpace" | "isUploadingAsset"
>) {
	return !isSpaceReady || !hasSelectedSpace || isUploadingAsset;
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
	columns: DataGridColumnConfig<AssetBrowserAsset>[];
	leftInputs: InputConfig[];
}) {
	const gridState = useLocalObservable(
		() =>
			new DataGridState({
				queryStates,
				setQueryStates,
			}),
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
				<DataGrid
					config={{
						entity: "Asset",
						columns,
						leftInputs,
						emptyMessage: "등록된 에셋이 없습니다.",
					}}
					rows={[]}
					totalCount={0}
					state={gridState}
				/>
			</div>
		</div>
	);
}
function AssetsSpaceEmptyState() {
	return (
		<div className="rounded-[1.25rem] border border-dashed border-border/70 bg-default/60 p-8 md:p-10">
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
		assets = [],
		totalCount,
		folders,
		queryStates,
		setQueryStates,
		isLoading,
		isSpaceReady,
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
		const t = useT();
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const fileInputRef = useRef<HTMLInputElement | null>(null);
		const createFolderModal = useOverlayState();
		const renameFolderModal = useOverlayState();
		const browserModalState = useOverlayState({
			isOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClose?.();
				}
			},
		});
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
			createFolderModal.close();
			onResetCreateFolderForm();
		};
		const onCloseRenameFolderModal = () => {
			if (isUpdatingFolder) {
				return;
			}
			renameFolderModal.close();
			onResetRenameFolderForm();
		};
		const onClickCreateFolderButton = () => {
			setUploadRequirementMessage(null);
			onResetCreateFolderForm();
			createFolderModal.open();
		};
		const onClickRenameFolderButton = (folder: FolderTreeItem) => {
			setActiveFolder(folder);
			setRenameFolderName(folder.name);
			setRenameFolderNameError(null);
			renameFolderModal.open();
		};
		const onClickDeleteFolderButton = async (folder: FolderTreeItem) => {
			if (isRemovingFolder) {
				return;
			}
			try {
				await onDeleteFolder(folder.id);
				void setQueryStates({
					folderId: folder.parentFolderId ?? "",
					skip: 0,
				});
			} catch {
				return;
			}
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
					...(selectedFolderId
						? {
								parentFolderId: selectedFolderId,
							}
						: {}),
				});
				createFolderModal.close();
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
				renameFolderModal.close();
				onResetRenameFolderForm();
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
		const emptyMessage = getAssetEmptyMessage(folders, selectedFolderId, t);
		const browserContent = (
			<>
				<Surface className="overflow-hidden rounded-[1.75rem] border-border/80 bg-surface/75">
					{!isSpaceReady ? (
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
									className="bg-transparent"
								/>
							</div>
							<div className={assetsGridPanelClassName}>
								<DataGrid
									config={{
										entity: "Asset",
										columns,
										leftInputs: visibleLeftInputs,
										emptyMessage,
									}}
									rows={assets}
									totalCount={totalCount}
									state={gridState}
									isLoading={isLoading}
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
				<Modal state={createFolderModal}>
					<Modal.Backdrop>
						<Modal.Container size="md">
							<Modal.Dialog>
								<Modal.Header>{t("폴더 생성")}</Modal.Header>
								<Modal.Body>
									<div className="flex flex-col gap-3">
										<p className="text-sm text-muted">
											{selectedFolderId
												? t("현재 선택한 폴더 아래에 새 폴더를 생성합니다.")
												: t("루트 폴더에 새 폴더를 생성합니다.")}
										</p>
										<TextField
											label="폴더명"
											placeholder="새 폴더명을 입력하세요"
											value={newFolderName}
											onValueChange={(value: string) => {
												setNewFolderName(value);
												setNewFolderNameError(null);
											}}
											isRequired
											autoFocus
											isInvalid={Boolean(newFolderNameError)}
											errorMessage={newFolderNameError ?? undefined}
										/>
									</div>
								</Modal.Body>
								<Modal.Footer>
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
										isDisabled={!newFolderName.trim()}
									>
										생성
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>

				<Modal state={renameFolderModal}>
					<Modal.Backdrop>
						<Modal.Container size="md">
							<Modal.Dialog>
								<Modal.Header>{t("폴더 이름 변경")}</Modal.Header>
								<Modal.Body>
									<TextField
										label="폴더명"
										placeholder="변경할 폴더명을 입력하세요"
										value={renameFolderName}
										onValueChange={(value: string) => {
											setRenameFolderName(value);
											setRenameFolderNameError(null);
										}}
										isRequired
										autoFocus
										isInvalid={Boolean(renameFolderNameError)}
										errorMessage={renameFolderNameError ?? undefined}
									/>
								</Modal.Body>
								<Modal.Footer>
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
										isDisabled={!renameFolderName.trim()}
									>
										저장
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
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
					isDisabled={isUploadActionDisabled({
						isSpaceReady,
						hasSelectedSpace,
						isUploadingAsset,
					})}
				>
					{t("업로드")}
				</Button>
				{uploadRequirementMessage ? (
					<output className="max-w-56 text-right text-xs text-muted">
						{t(uploadRequirementMessage)}
					</output>
				) : null}
			</div>
		);
		if (presentation === "modal") {
			return (
				<>
					<Modal state={browserModalState}>
						<Modal.Backdrop>
							<Modal.Container size="full" scroll="inside">
								<Modal.Dialog>
									<Modal.Header className="flex-col items-stretch gap-0">
										<Screen.Header
											title={title}
											description={description}
											actions={uploadAction}
										/>
									</Modal.Header>
									<Modal.Body className="pt-0 pb-6">
										{browserContent}
									</Modal.Body>
								</Modal.Dialog>
							</Modal.Container>
						</Modal.Backdrop>
					</Modal>
					{overlayModals}
				</>
			);
		}
		return (
			<>
				<div className="space-y-6 md:space-y-7">
					<Screen.Header
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
