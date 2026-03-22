"use client";

import {
	type AssetDto,
	type AssetKind,
	type AssetStatus,
	type FolderDto,
	getGetAssetsQueryKey,
	getGetFoldersQueryKey,
	useCreateFolder,
	useGetAssetsSuspense,
	useGetFoldersSuspense,
	useRemoveAsset,
	useRemoveFolder,
	useUpdateFolder,
	useUploadAsset,
} from "@cocrepo/api/assets";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	EmptyState,
	FolderTree,
	type FolderTreeItem,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import {
	type ChangeEvent,
	type ReactNode,
	Suspense,
	useRef,
	useState,
} from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

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

const getKindLabel = (kind: AssetKind) => {
	switch (kind) {
		case "IMAGE":
			return "이미지";
		case "VIDEO":
			return "비디오";
		case "DOCUMENT":
			return "문서";
		default:
			return kind;
	}
};

const getStatusColor = (
	status: AssetStatus,
): "success" | "warning" | "danger" => {
	switch (status) {
		case "READY":
			return "success";
		case "UPLOADING":
			return "warning";
		case "FAILED":
			return "danger";
		default:
			return "warning";
	}
};

const getStatusLabel = (status: AssetStatus) => {
	switch (status) {
		case "READY":
			return "완료";
		case "UPLOADING":
			return "업로드 중";
		case "FAILED":
			return "실패";
		default:
			return status;
	}
};

const formatBytes = (bytes: number) => {
	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
	const value = bytes / 1024 ** exponent;
	return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const getAssetEmptyMessage = (
	folders: FolderDto[],
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

function buildAssetColumns({
	isRemoving,
	onClickDeleteAssetButton,
}: {
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
}): MetaDataGridColumnConfig<AssetDto>[] {
	return [
		{
			field: "originalName",
			label: "파일명",
			size: 280,
			isRequired: true,
			cell: ({ row }) => (
				<Link
					href={`/assets/${(row.original as AssetDto).id}` as Route}
					className="text-primary hover:underline"
				>
					{(row.original as AssetDto).originalName}
				</Link>
			),
		},
		{
			field: "kind",
			label: "타입",
			size: 100,
			align: "center",
			cell: ({ row }) => {
				const kindValue = (row.original as AssetDto).kind;
				return (
					<Chip size="sm" variant="flat" color="secondary">
						{getKindLabel(kindValue)}
					</Chip>
				);
			},
		},
		{
			field: "status",
			label: "상태",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const statusValue = (row.original as AssetDto).status;
				return (
					<Chip size="sm" variant="flat" color={getStatusColor(statusValue)}>
						{getStatusLabel(statusValue)}
					</Chip>
				);
			},
		},
		{
			field: "mimeType",
			label: "MIME",
			size: 180,
			cell: ({ getValue }) => (
				<span className="font-mono text-xs">{getValue() as string}</span>
			),
		},
		{
			field: "sizeBytes",
			label: "크기",
			size: 120,
			align: "right",
			cell: ({ getValue }) => formatBytes(getValue() as number),
		},
		{
			field: "createdAt",
			label: "등록일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		},
		{
			field: "id",
			label: "액션",
			size: 100,
			align: "center",
			cell: ({ row }) => (
				<Button
					size="sm"
					variant="flat"
					color="danger"
					isLoading={isRemoving}
					startContent={<Trash2 className="h-4 w-4" />}
					onPress={() =>
						onClickDeleteAssetButton((row.original as AssetDto).id)
					}
				>
					삭제
				</Button>
			),
		},
	];
}

const AssetsPageContent = observer(function AssetsPageContent({
	queryStates,
	setQueryStates,
	isRemoving,
	onClickDeleteAssetButton,
	onClickCreateFolderButton,
	onClickRenameFolderButton,
	onClickDeleteFolderButton,
}: {
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0];
	setQueryStates: ReturnType<typeof useMetaDataGridQueryStates>[1];
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
	onClickCreateFolderButton: () => void;
	onClickRenameFolderButton: (folder: FolderTreeItem) => void;
	onClickDeleteFolderButton: (folder: FolderTreeItem) => void;
}) {
	const take = queryStates.take;
	const skip = queryStates.skip;
	const search = queryStates.search || undefined;
	const kind = (queryStates.kind || undefined) as AssetKind | undefined;
	const status = (queryStates.status || undefined) as AssetStatus | undefined;
	const selectedFolderId = queryStates.folderId || null;
	const folderId = selectedFolderId || undefined;

	const { data: response } = useGetAssetsSuspense({
		take,
		skip,
		search,
		kind,
		status,
		folderId,
	});
	const { data: folderResponse } = useGetFoldersSuspense();

	const assets = (response?.data ?? []) as AssetDto[];
	const totalCount = response?.meta?.total ?? 0;
	const folders = (folderResponse?.data ?? []) as FolderDto[];
	const columns = buildAssetColumns({
		isRemoving,
		onClickDeleteAssetButton,
	});
	const emptyMessage = getAssetEmptyMessage(folders, selectedFolderId);

	const onSelectFolder = (folder: FolderTreeItem | null) => {
		void setQueryStates({
			folderId: folder?.id ?? "",
			skip: 0,
		});
	};

	return (
		<div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
			<div className="border-b border-divider lg:border-b-0 lg:border-r">
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
			<div className="min-w-0">
				<MetaDataGrid
					config={{
						entity: "Asset",
						data: assets,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage,
					}}
				/>
			</div>
		</div>
	);
});

function AssetsPageShellFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="에셋 관리"
				description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

function AssetsGridFallback({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0];
	setQueryStates: ReturnType<typeof useMetaDataGridQueryStates>[1];
	columns: MetaDataGridColumnConfig<AssetDto>[];
}) {
	return (
		<div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
			<div className="border-b border-divider lg:border-b-0 lg:border-r">
				<FolderTree folders={[]} isLoading className="bg-transparent" />
			</div>
			<div className="min-w-0">
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
		<div className="p-6">
			<EmptyState
				title="Space를 선택하면 에셋을 조회할 수 있습니다"
				description="상단 Space 선택기를 통해 관리하려는 공간을 먼저 선택해주세요."
				statusLabel="Space 미선택"
			/>
		</div>
	);
}

const AssetsPageInner = observer(function AssetsPageInner() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] =
		useMetaDataGridQueryStates(queryStateInputs);
	const persistStore = usePersistStore();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const createFolderModal = useDisclosure();
	const renameFolderModal = useDisclosure();
	const deleteFolderModal = useDisclosure();
	const isPersistStoreHydrated = persistStore?.isHydrated ?? false;
	const hasSelectedSpace = Boolean(persistStore?.spaceId);
	const selectedFolderId = queryStates.folderId || null;
	const [activeFolder, setActiveFolder] = useState<FolderTreeItem | null>(null);
	const [newFolderName, setNewFolderName] = useState("");
	const [newFolderNameError, setNewFolderNameError] = useState<string | null>(
		null,
	);
	const [renameFolderName, setRenameFolderName] = useState("");
	const [renameFolderNameError, setRenameFolderNameError] = useState<
		string | null
	>(null);

	const { mutate: removeAsset, isPending: isRemoving } = useRemoveAsset({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetAssetsQueryKey(),
				});
				addToast({
					title: "삭제 완료",
					description: "에셋이 삭제되었습니다.",
					color: "success",
				});
			},
			onError: () => {
				addToast({
					title: "삭제 실패",
					description: "에셋 삭제 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const { mutate: uploadAsset, isPending: isUploadingAsset } = useUploadAsset({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetAssetsQueryKey(),
				});
				addToast({
					title: "업로드 완료",
					description: "에셋이 업로드되었습니다.",
					color: "success",
				});
			},
			onError: (error) => {
				addToast({
					title: "업로드 실패",
					description: error.message || "에셋 업로드 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const { mutate: createFolder, isPending: isCreatingFolder } = useCreateFolder(
		{
			mutation: {
				onSuccess: (response) => {
					queryClient.invalidateQueries({
						queryKey: getGetFoldersQueryKey(),
					});

					const createdFolderId = response?.data?.id;

					addToast({
						title: "폴더 생성 완료",
						description: "새 폴더가 생성되었습니다.",
						color: "success",
					});

					createFolderModal.onClose();
					onResetCreateFolderForm();

					if (createdFolderId) {
						void setQueryStates({
							folderId: createdFolderId,
							skip: 0,
						});
					}
				},
				onError: (error) => {
					addToast({
						title: "폴더 생성 실패",
						description: error.message || "폴더 생성 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		},
	);

	const { mutate: updateFolder, isPending: isUpdatingFolder } = useUpdateFolder(
		{
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetFoldersQueryKey(),
					});
					addToast({
						title: "폴더 수정 완료",
						description: "폴더가 수정되었습니다.",
						color: "success",
					});
					renameFolderModal.onClose();
					onResetRenameFolderForm();
				},
				onError: (error) => {
					addToast({
						title: "폴더 수정 실패",
						description: error.message || "폴더 수정 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		},
	);

	const { mutate: removeFolder, isPending: isRemovingFolder } = useRemoveFolder(
		{
			mutation: {
				onSuccess: () => {
					const deletedFolderParentId = activeFolder?.parentFolderId ?? "";
					queryClient.invalidateQueries({
						queryKey: getGetFoldersQueryKey(),
					});
					addToast({
						title: "폴더 삭제 완료",
						description: "폴더가 삭제되었습니다.",
						color: "success",
					});
					deleteFolderModal.onClose();
					setActiveFolder(null);
					void setQueryStates({
						folderId: deletedFolderParentId,
						skip: 0,
					});
				},
				onError: (error) => {
					addToast({
						title: "폴더 삭제 실패",
						description: error.message || "폴더 삭제 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		},
	);

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

	const onCloseRenameFolderModal = () => {
		if (isUpdatingFolder) {
			return;
		}

		renameFolderModal.onClose();
		onResetRenameFolderForm();
	};

	const onClickDeleteFolderButton = (folder: FolderTreeItem) => {
		setActiveFolder(folder);
		deleteFolderModal.onOpen();
	};

	const onCloseDeleteFolderModal = () => {
		if (isRemovingFolder) {
			return;
		}

		deleteFolderModal.onClose();
		setActiveFolder(null);
	};

	const onChangeFolderNameInput = (value: string) => {
		setNewFolderName(value);
		setNewFolderNameError(null);
	};

	const onChangeRenameFolderNameInput = (value: string) => {
		setRenameFolderName(value);
		setRenameFolderNameError(null);
	};

	const onClickCreateFolderSubmitButton = () => {
		const trimmedFolderName = newFolderName.trim();

		if (!trimmedFolderName) {
			setNewFolderNameError("폴더명을 입력해주세요.");
			return;
		}

		createFolder({
			data: {
				name: trimmedFolderName,
				...(selectedFolderId ? { parentFolderId: selectedFolderId } : {}),
			},
		});
	};

	const onClickRenameFolderSubmitButton = () => {
		const trimmedFolderName = renameFolderName.trim();

		if (!trimmedFolderName) {
			setRenameFolderNameError("폴더명을 입력해주세요.");
			return;
		}

		if (!activeFolder) {
			return;
		}

		updateFolder({
			folderId: activeFolder.id,
			data: {
				name: trimmedFolderName,
			},
		});
	};

	const onClickDeleteFolderConfirmButton = () => {
		if (!activeFolder) {
			return;
		}

		removeFolder({
			folderId: activeFolder.id,
		});
	};

	const onClickUploadButton = () => {
		if (!selectedFolderId) {
			addToast({
				title: "폴더 선택 필요",
				description: "업로드할 폴더를 먼저 선택해주세요.",
				color: "warning",
			});
			return;
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			fileInputRef.current.click();
		}
	};

	const onChangeAssetFileInput = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		event.target.value = "";

		if (!selectedFile || !selectedFolderId) {
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("folderId", selectedFolderId);
		uploadAsset({
			data: formData,
		});
	};

	const onClickDeleteAssetButton = (assetId: string) => {
		removeAsset({ assetId });
	};

	const columns = buildAssetColumns({
		isRemoving,
		onClickDeleteAssetButton,
	});

	const pageActions: ReactNode = (
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
	);

	return (
		<>
			<div className="space-y-5">
				<PageTitleBar
					title="에셋 관리"
					description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
					actions={pageActions}
				/>

				<Surface
					className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70"
					padding="none"
				>
					{!isPersistStoreHydrated ? (
						<AssetsGridFallback
							queryStates={queryStates}
							setQueryStates={setQueryStates}
							columns={columns}
						/>
					) : !hasSelectedSpace ? (
						<AssetsSpaceEmptyState />
					) : (
						<Suspense
							fallback={
								<AssetsGridFallback
									queryStates={queryStates}
									setQueryStates={setQueryStates}
									columns={columns}
								/>
							}
						>
							<AssetsPageContent
								queryStates={queryStates}
								setQueryStates={setQueryStates}
								isRemoving={isRemoving}
								onClickDeleteAssetButton={onClickDeleteAssetButton}
								onClickCreateFolderButton={onClickCreateFolderButton}
								onClickRenameFolderButton={onClickRenameFolderButton}
								onClickDeleteFolderButton={onClickDeleteFolderButton}
							/>
						</Suspense>
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
								onValueChange={onChangeFolderNameInput}
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
							onValueChange={onChangeRenameFolderNameInput}
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

export default observer(function AssetsPage() {
	return (
		<Suspense fallback={<AssetsPageShellFallback />}>
			<AssetsPageInner />
		</Suspense>
	);
});
