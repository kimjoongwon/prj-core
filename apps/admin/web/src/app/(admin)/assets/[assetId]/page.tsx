"use client";

import {
	type AssetDto,
	type FolderDto,
	getGetAssetByIdQueryKey,
	getGetFoldersQueryKey,
	useGetAssetById,
	useGetFolders,
	useMoveAsset,
	useRemoveAsset,
} from "@cocrepo/api/assets";
import {
	AdminAssetsAssetIdPage,
	type AdminAssetsAssetIdPageAsset,
	type AdminAssetsAssetIdPageFolder,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default observer(function AssetDetailPageRoute() {
	const assetId = useParams<{ assetId: string }>().assetId;
	const router = useRouter();
	const queryClient = useQueryClient();
	const [targetFolderId, setTargetFolderId] = useState("");
	const [targetFolderError, setTargetFolderError] = useState<string>();
	const { data: response, isLoading } = useGetAssetById(assetId);
	const { data: folderResponse } = useGetFolders();
	const removeAssetMutation = useRemoveAsset();
	const moveAssetMutation = useMoveAsset();

	return (
		<AdminAssetsAssetIdPage
			asset={response?.data ? mapAssetDetail(response.data) : undefined}
			folders={(folderResponse?.data ?? []).map(mapFolder)}
			targetFolderId={targetFolderId}
			targetFolderError={targetFolderError}
			isLoading={isLoading}
			isRemoving={removeAssetMutation.isPending}
			isMoving={moveAssetMutation.isPending}
			onClickBackButton={() => {
				router.push("/assets" as Route);
			}}
			onClickDeleteAssetButton={async () => {
				await removeAssetMutation.mutateAsync({ assetId });
				await queryClient.invalidateQueries({
					queryKey: ["/api/v1/assets"],
				});
				addToast({
					title: "삭제 완료",
					description: "에셋이 삭제되었습니다.",
					color: "success",
				});
				router.push("/assets" as Route);
			}}
			onChangeTargetFolderSelection={(nextTargetFolderId) => {
				setTargetFolderId(nextTargetFolderId);
				setTargetFolderError(undefined);
			}}
			onClickMoveAssetButton={async () => {
				if (!targetFolderId) {
					setTargetFolderError("이동할 폴더를 선택해주세요.");
					return;
				}

				await moveAssetMutation.mutateAsync({
					assetId,
					data: { targetFolderId },
				});
				await queryClient.invalidateQueries({
					queryKey: ["/api/v1/assets"],
				});
				await queryClient.invalidateQueries({
					queryKey: getGetAssetByIdQueryKey(assetId),
				});
				await queryClient.invalidateQueries({
					queryKey: getGetFoldersQueryKey(),
				});
				addToast({
					title: "이동 완료",
					description: "에셋 폴더가 변경되었습니다.",
					color: "success",
				});
				setTargetFolderError(undefined);
			}}
		/>
	);
});

function mapAssetDetail(asset: AssetDto): AdminAssetsAssetIdPageAsset {
	return {
		id: asset.id,
		originalName: asset.originalName,
		kind: asset.kind,
		status: asset.status,
		mimeType: asset.mimeType,
		sizeBytes: asset.sizeBytes,
		folderId: asset.folderId,
		createdAt: asset.createdAt,
		storageKey: asset.storageKey,
		checksum: asset.checksum,
	};
}

function mapFolder(folder: FolderDto): AdminAssetsAssetIdPageFolder {
	return {
		id: folder.id,
		name: folder.name,
	};
}
