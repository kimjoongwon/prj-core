"use client";

import {
	type AssetDto,
	type AssetKind,
	type AssetStatus,
	type FolderDto,
	getGetFoldersQueryKey,
	useCreateFolder,
	useGetAssets,
	useGetFolders,
	useRemoveAsset,
	useRemoveFolder,
	useUpdateFolder,
	useUploadAsset,
} from "@cocrepo/api/assets";
import { useApp } from "@cocrepo/store";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import { useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export interface AssetBrowserFolder {
	id: string;
	name: string;
	parentFolderId?: string | null;
}

export interface AssetBrowserQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	kind: string;
	status: string;
	folderId: string;
}

/**
 * AssetBrowser mutation 성공 알림을 구분하는 키입니다.
 */
export type AssetBrowserNotificationKind =
	| "assetUploadSuccess"
	| "assetDeleteSuccess"
	| "folderCreateSuccess"
	| "folderRenameSuccess"
	| "folderDeleteSuccess";

/**
 * AssetBrowser가 UI adapter에 전달하는 알림 payload입니다.
 */
export interface AssetBrowserNotification {
	kind: AssetBrowserNotificationKind;
	title: string;
	description: string;
}

/**
 * AssetBrowser 알림을 실제 UI 구현으로 연결하는 adapter입니다.
 */
export type AssetBrowserNotify = (
	notification: AssetBrowserNotification,
) => void;

export interface AssetBrowserBindings {
	assets?: AssetDto[];
	totalCount: number;
	folders: AssetBrowserFolder[];
	queryStates: AssetBrowserQueryStates;
	setQueryStates: DataGridSetQueryStates;
	isLoading: boolean;
	isSpaceReady: boolean;
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

export interface UseAssetBrowserOptions {
	enabled?: boolean;
	forcedKind?: AssetKind;
	forcedStatus?: AssetStatus;
	onDeleteAssetSuccess?: (assetId: string) => void;
	onNotify?: AssetBrowserNotify;
}

/**
 * AssetBrowser feature에 필요한 조회, mutation, query-state binding을 제공합니다.
 */
export function useAssetBrowser({
	enabled = true,
	forcedKind,
	forcedStatus,
	onDeleteAssetSuccess,
	onNotify,
}: UseAssetBrowserOptions = {}): AssetBrowserBindings {
	const queryClient = useQueryClient();
	const app = useApp();
	const space = app.space;
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		kind: parseAsString.withDefault(""),
		status: parseAsString.withDefault(""),
		folderId: parseAsString.withDefault(""),
	});
	const selectedFolderId =
		typeof queryStates.folderId === "string" && queryStates.folderId
			? queryStates.folderId
			: undefined;
	const searchValue =
		typeof queryStates.search === "string" && queryStates.search.trim()
			? queryStates.search
			: undefined;
	const resolvedKind =
		forcedKind ??
		(typeof queryStates.kind === "string" && queryStates.kind
			? (queryStates.kind as AssetKind)
			: undefined);
	const resolvedStatus =
		forcedStatus ??
		(typeof queryStates.status === "string" && queryStates.status
			? (queryStates.status as AssetStatus)
			: undefined);
	const assetParams = {
		take: typeof queryStates.take === "number" ? queryStates.take : 20,
		skip: typeof queryStates.skip === "number" ? queryStates.skip : 0,
		search: searchValue,
		kind: resolvedKind,
		status: resolvedStatus,
		folderId: selectedFolderId,
	};
	const isSpaceReady = space.isHydrated && space.isSpaceSelectionResolved;
	const hasSelectedSpace = Boolean(space.tenantId);
	const isQueryEnabled = isSpaceReady && hasSelectedSpace && enabled;

	const { data: assetsResponse, isLoading: isLoadingAssets } = useGetAssets(
		assetParams,
		{
			query: {
				enabled: isQueryEnabled,
			},
		},
	);
	const { data: foldersResponse, isLoading: isLoadingFolders } = useGetFolders({
		query: {
			enabled: isQueryEnabled,
		},
	});
	const removeAssetMutation = useRemoveAsset();
	const uploadAssetMutation = useUploadAsset();
	const createFolderMutation = useCreateFolder();
	const updateFolderMutation = useUpdateFolder();
	const removeFolderMutation = useRemoveFolder();

	return {
		assets: assetsResponse?.data,
		totalCount: assetsResponse?.meta?.total ?? 0,
		folders: (foldersResponse?.data ?? []).map(mapAssetBrowserFolder),
		queryStates,
		setQueryStates,
		isLoading: isLoadingAssets || isLoadingFolders,
		isSpaceReady,
		hasSelectedSpace,
		isRemoving: removeAssetMutation.isPending,
		isUploadingAsset: uploadAssetMutation.isPending,
		isCreatingFolder: createFolderMutation.isPending,
		isUpdatingFolder: updateFolderMutation.isPending,
		isRemovingFolder: removeFolderMutation.isPending,
		onUploadAsset: async (file, folderId) => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folderId", folderId);
			await uploadAssetMutation.mutateAsync({ data: formData });
			await queryClient.invalidateQueries({
				queryKey: ["/api/v1/assets"],
			});
			onNotify?.({
				kind: "assetUploadSuccess",
				title: "업로드 완료",
				description: "에셋이 업로드되었습니다.",
			});
		},
		onDeleteAsset: async (assetId) => {
			await removeAssetMutation.mutateAsync({ assetId });
			await queryClient.invalidateQueries({
				queryKey: ["/api/v1/assets"],
			});
			onDeleteAssetSuccess?.(assetId);
			onNotify?.({
				kind: "assetDeleteSuccess",
				title: "삭제 완료",
				description: "에셋이 삭제되었습니다.",
			});
		},
		onCreateFolder: async (input) => {
			const response = await createFolderMutation.mutateAsync({
				data: input,
			});
			await queryClient.invalidateQueries({
				queryKey: getGetFoldersQueryKey(),
			});
			onNotify?.({
				kind: "folderCreateSuccess",
				title: "폴더 생성 완료",
				description: "새 폴더가 생성되었습니다.",
			});

			const createdFolderId = response?.data?.id;
			if (createdFolderId) {
				await setQueryStates({
					folderId: createdFolderId,
					skip: 0,
				});
			}
		},
		onRenameFolder: async (input) => {
			await updateFolderMutation.mutateAsync({
				folderId: input.folderId,
				data: {
					name: input.name,
				},
			});
			await queryClient.invalidateQueries({
				queryKey: getGetFoldersQueryKey(),
			});
			onNotify?.({
				kind: "folderRenameSuccess",
				title: "폴더 수정 완료",
				description: "폴더가 수정되었습니다.",
			});
		},
		onDeleteFolder: async (folderId) => {
			await removeFolderMutation.mutateAsync({ folderId });
			await queryClient.invalidateQueries({
				queryKey: getGetFoldersQueryKey(),
			});
			onNotify?.({
				kind: "folderDeleteSuccess",
				title: "폴더 삭제 완료",
				description: "폴더가 삭제되었습니다.",
			});
		},
	};
}

/**
 * API Folder DTO를 AssetBrowser가 쓰는 folder tree item으로 변환합니다.
 */
function mapAssetBrowserFolder(folder: FolderDto): AssetBrowserFolder {
	return {
		id: folder.id,
		name: folder.name,
		parentFolderId: folder.parentFolderId,
	};
}
