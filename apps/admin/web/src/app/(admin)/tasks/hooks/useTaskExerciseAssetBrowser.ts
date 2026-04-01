"use client";

import { useGetAssetById } from "@cocrepo/api/assets";
import type { AssetBrowserAsset } from "@cocrepo/ui";
import { useState } from "react";
import {
	type AdminAssetBrowserBindings,
	useAdminAssetBrowser,
} from "../../hooks/useAdminAssetBrowser";

type TaskAssetSlot = "image" | "video" | null;

interface UseTaskExerciseAssetBrowserProps {
	imageFileId: string;
	videoFileId: string;
	onChangeImageFileId: (value: string) => void;
	onChangeVideoFileId: (value: string) => void;
}

interface UseTaskExerciseAssetBrowserReturn {
	activeAssetSlot: TaskAssetSlot;
	assetBrowser: AdminAssetBrowserBindings;
	assetBrowserTitle: string;
	assetBrowserDescription: string;
	selectedAssetId?: string;
	selectedImageAsset?: AssetBrowserAsset;
	selectedVideoAsset?: AssetBrowserAsset;
	onOpenAssetBrowser: (slot: Exclude<TaskAssetSlot, null>) => void;
	onCloseAssetBrowser: () => void;
	onSelectAsset: (asset: AssetBrowserAsset) => void;
}

export function useTaskExerciseAssetBrowser({
	imageFileId,
	videoFileId,
	onChangeImageFileId,
	onChangeVideoFileId,
}: UseTaskExerciseAssetBrowserProps): UseTaskExerciseAssetBrowserReturn {
	const [activeAssetSlot, setActiveAssetSlot] = useState<TaskAssetSlot>(null);
	const { data: selectedImageAssetResponse } = useGetAssetById(imageFileId, {
		query: {
			enabled: imageFileId.trim().length > 0,
		},
	});
	const { data: selectedVideoAssetResponse } = useGetAssetById(videoFileId, {
		query: {
			enabled: videoFileId.trim().length > 0,
		},
	});
	const assetBrowser = useAdminAssetBrowser({
		enabled: activeAssetSlot !== null,
		forcedKind:
			activeAssetSlot === "image"
				? "IMAGE"
				: activeAssetSlot === "video"
					? "VIDEO"
					: undefined,
		forcedStatus: "READY",
		onDeleteAssetSuccess: (assetId) => {
			if (assetId === imageFileId) {
				onChangeImageFileId("");
			}
			if (assetId === videoFileId) {
				onChangeVideoFileId("");
			}
		},
	});

	const onOpenAssetBrowser = (slot: Exclude<TaskAssetSlot, null>) => {
		setActiveAssetSlot(slot);
		void assetBrowser.setQueryStates({
			search: "",
			skip: 0,
		});
	};

	const onCloseAssetBrowser = () => {
		setActiveAssetSlot(null);
	};

	const onSelectAsset = (asset: AssetBrowserAsset) => {
		if (activeAssetSlot === "image") {
			onChangeImageFileId(asset.id);
		}

		if (activeAssetSlot === "video") {
			onChangeVideoFileId(asset.id);
		}

		setActiveAssetSlot(null);
	};

	return {
		activeAssetSlot,
		assetBrowser,
		assetBrowserTitle:
			activeAssetSlot === "image"
				? "이미지 에셋 선택"
				: activeAssetSlot === "video"
					? "영상 에셋 선택"
					: "에셋 선택",
		assetBrowserDescription:
			activeAssetSlot === "image"
				? "대표 이미지로 사용할 에셋을 선택하거나 업로드하고 폴더를 정리할 수 있습니다."
				: activeAssetSlot === "video"
					? "운동 영상으로 사용할 에셋을 선택하거나 업로드하고 폴더를 정리할 수 있습니다."
					: "에셋을 선택하거나 업로드하고 폴더를 정리할 수 있습니다.",
		selectedAssetId:
			activeAssetSlot === "image"
				? imageFileId || undefined
				: activeAssetSlot === "video"
					? videoFileId || undefined
					: undefined,
		selectedImageAsset: selectedImageAssetResponse?.data,
		selectedVideoAsset: selectedVideoAssetResponse?.data,
		onOpenAssetBrowser,
		onCloseAssetBrowser,
		onSelectAsset,
	};
}
