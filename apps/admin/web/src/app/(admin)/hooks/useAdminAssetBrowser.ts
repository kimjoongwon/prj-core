"use client";

import {
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
import type { AssetBrowserProps } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { usePersistStore } from "@/stores/AppStoreProvider";

export type AdminAssetBrowserBindings = Omit<
	AssetBrowserProps,
	| "mode"
	| "presentation"
	| "title"
	| "description"
	| "isOpen"
	| "onClose"
	| "selectedAssetId"
	| "onSelectAsset"
>;

interface UseAdminAssetBrowserOptions {
	enabled?: boolean;
	forcedKind?: AssetKind;
	forcedStatus?: AssetStatus;
	onDeleteAssetSuccess?: (assetId: string) => void;
}

export function useAdminAssetBrowser({
	enabled = true,
	forcedKind,
	forcedStatus,
	onDeleteAssetSuccess,
}: UseAdminAssetBrowserOptions = {}): AdminAssetBrowserBindings {
	const queryClient = useQueryClient();
	const persistStore = usePersistStore();
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
	const isStoreReady =
		persistStore.isHydrated && persistStore.isSpaceSelectionResolved;
	const hasSelectedSpace = Boolean(persistStore.spaceId);
	const isQueryEnabled = isStoreReady && hasSelectedSpace && enabled;

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
		folders: (foldersResponse?.data ?? []).map(mapFolder),
		queryStates,
		setQueryStates,
		isLoading: isLoadingAssets || isLoadingFolders,
		isStoreReady,
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
			addToast({
				title: "업로드 완료",
				description: "에셋이 업로드되었습니다.",
				color: "success",
			});
		},
		onDeleteAsset: async (assetId) => {
			await removeAssetMutation.mutateAsync({ assetId });
			await queryClient.invalidateQueries({
				queryKey: ["/api/v1/assets"],
			});
			onDeleteAssetSuccess?.(assetId);
			addToast({
				title: "삭제 완료",
				description: "에셋이 삭제되었습니다.",
				color: "success",
			});
		},
		onCreateFolder: async (input) => {
			const response = await createFolderMutation.mutateAsync({
				data: input,
			});
			await queryClient.invalidateQueries({
				queryKey: getGetFoldersQueryKey(),
			});
			addToast({
				title: "폴더 생성 완료",
				description: "새 폴더가 생성되었습니다.",
				color: "success",
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
			addToast({
				title: "폴더 수정 완료",
				description: "폴더가 수정되었습니다.",
				color: "success",
			});
		},
		onDeleteFolder: async (folderId) => {
			await removeFolderMutation.mutateAsync({ folderId });
			await queryClient.invalidateQueries({
				queryKey: getGetFoldersQueryKey(),
			});
			addToast({
				title: "폴더 삭제 완료",
				description: "폴더가 삭제되었습니다.",
				color: "success",
			});
		},
	};
}

function mapFolder(folder: FolderDto) {
	return {
		id: folder.id,
		name: folder.name,
		parentFolderId: folder.parentFolderId,
	};
}
