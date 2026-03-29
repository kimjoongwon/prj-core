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
import { usePersistStore } from "@cocrepo/store";
import {
	adminAssetsPageQueryInputs,
	AdminAssetsPage,
	type AdminAssetsPageAsset,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export default observer(function AssetsPageRoute() {
	const queryClient = useQueryClient();
	const persistStore = usePersistStore();
	const [isClientMounted, setIsClientMounted] = useState(false);
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminAssetsPageQueryInputs,
	);
	const isStoreReady = isClientMounted && (persistStore?.isHydrated ?? false);
	const hasSelectedSpace = Boolean(persistStore?.spaceId);
	const selectedFolderId =
		typeof queryStates.folderId === "string" && queryStates.folderId
			? queryStates.folderId
			: undefined;

	useEffect(() => {
		setIsClientMounted(true);
	}, []);

	const { data: assetsResponse, isLoading: isLoadingAssets } = useGetAssets(
		{
			take: typeof queryStates.take === "number" ? queryStates.take : 20,
			skip: typeof queryStates.skip === "number" ? queryStates.skip : 0,
			search:
				typeof queryStates.search === "string" && queryStates.search.trim()
					? queryStates.search
					: undefined,
			kind:
				typeof queryStates.kind === "string" && queryStates.kind
					? (queryStates.kind as AssetKind)
					: undefined,
			status:
				typeof queryStates.status === "string" && queryStates.status
					? (queryStates.status as AssetStatus)
					: undefined,
			folderId: selectedFolderId,
		},
		{
			query: {
				enabled: isStoreReady && hasSelectedSpace,
			},
		},
	);
	const { data: foldersResponse, isLoading: isLoadingFolders } = useGetFolders({
		query: {
			enabled: isStoreReady && hasSelectedSpace,
		},
	});
	const removeAssetMutation = useRemoveAsset();
	const uploadAssetMutation = useUploadAsset();
	const createFolderMutation = useCreateFolder();
	const updateFolderMutation = useUpdateFolder();
	const removeFolderMutation = useRemoveFolder();

	return (
		<AdminAssetsPage
			assets={(assetsResponse?.data ?? []).map(mapAssetRow)}
			totalCount={assetsResponse?.meta?.total ?? 0}
			folders={(foldersResponse?.data ?? []).map(mapFolder)}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			isLoading={isLoadingAssets || isLoadingFolders}
			isStoreReady={isStoreReady}
			hasSelectedSpace={hasSelectedSpace}
			isRemoving={removeAssetMutation.isPending}
			isUploadingAsset={uploadAssetMutation.isPending}
			isCreatingFolder={createFolderMutation.isPending}
			isUpdatingFolder={updateFolderMutation.isPending}
			isRemovingFolder={removeFolderMutation.isPending}
			onUploadAsset={async (file, folderId) => {
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
			}}
			onDeleteAsset={async (assetId) => {
				await removeAssetMutation.mutateAsync({ assetId });
				await queryClient.invalidateQueries({
					queryKey: ["/api/v1/assets"],
				});
				addToast({
					title: "삭제 완료",
					description: "에셋이 삭제되었습니다.",
					color: "success",
				});
			}}
			onCreateFolder={async (input) => {
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
			}}
			onRenameFolder={async (input) => {
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
			}}
			onDeleteFolder={async (folderId) => {
				await removeFolderMutation.mutateAsync({ folderId });
				await queryClient.invalidateQueries({
					queryKey: getGetFoldersQueryKey(),
				});
				addToast({
					title: "폴더 삭제 완료",
					description: "폴더가 삭제되었습니다.",
					color: "success",
				});
			}}
		/>
	);
});

function mapAssetRow(asset: AssetDto): AdminAssetsPageAsset {
	return {
		id: asset.id,
		originalName: asset.originalName,
		kind: asset.kind,
		status: asset.status,
		mimeType: asset.mimeType,
		sizeBytes: asset.sizeBytes,
		createdAt: asset.createdAt,
	};
}

function mapFolder(folder: FolderDto) {
	return {
		id: folder.id,
		name: folder.name,
		parentFolderId: folder.parentFolderId,
	};
}
