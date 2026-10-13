"use client";

import { type AssetDto, useGetAssetById } from "@cocrepo/api/assets";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import {
	type AssetBrowserNotify,
	type UseAssetBrowserOptions,
} from "./useAssetBrowser";
import { isWireId } from "./wire-id";

type TaskAssetSlot = "image" | "video" | null;

export interface UseTaskExerciseAssetBrowserProps {
	imageFileId: string;
	videoFileId: string;
	onChangeImageFileId: (value: string) => void;
	onChangeVideoFileId: (value: string) => void;
	onAssetBrowserNotify?: AssetBrowserNotify;
}

export interface UseTaskExerciseAssetBrowserReturn {
	activeAssetSlot: TaskAssetSlot;
	assetBrowserOptions: UseAssetBrowserOptions;
	assetBrowserTitle: string;
	assetBrowserDescription: string;
	selectedAssetId?: string;
	selectedImageAsset?: AssetDto;
	selectedVideoAsset?: AssetDto;
	onOpenAssetBrowser: (slot: Exclude<TaskAssetSlot, null>) => void;
	onCloseAssetBrowser: () => void;
	onSelectAsset: (asset: AssetDto) => void;
}

/**
 * Task exercise create/edit 화면의 image/video AssetBrowser 선택 상태를 관리합니다.
 */
export function useTaskExerciseAssetBrowser({
	imageFileId,
	videoFileId,
	onChangeImageFileId,
	onChangeVideoFileId,
	onAssetBrowserNotify,
}: UseTaskExerciseAssetBrowserProps): UseTaskExerciseAssetBrowserReturn {
	const [activeAssetSlot, setActiveAssetSlot] = useState<TaskAssetSlot>(null);
	const [, setAssetQueryStates] = useQueryStates({
		search: parseAsString.withDefault(""),
		skip: parseAsInteger.withDefault(0),
	});
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
	const assetBrowserOptions: UseAssetBrowserOptions = {
		forcedKind:
			activeAssetSlot === "image"
				? "IMAGE"
				: activeAssetSlot === "video"
					? "VIDEO"
					: undefined,
		forcedStatus: "READY",
		onDeleteAssetSuccess: (assetId) => {
			if (
				isWireId(imageFileId) &&
				isWireId(assetId) &&
				assetId === imageFileId
			) {
				onChangeImageFileId("");
			}
			if (
				isWireId(videoFileId) &&
				isWireId(assetId) &&
				assetId === videoFileId
			) {
				onChangeVideoFileId("");
			}
		},
		onNotify: onAssetBrowserNotify,
	};

	const onOpenAssetBrowser = (slot: Exclude<TaskAssetSlot, null>) => {
		setActiveAssetSlot(slot);
		void setAssetQueryStates({
			search: "",
			skip: 0,
		});
	};

	const onCloseAssetBrowser = () => {
		setActiveAssetSlot(null);
	};

	const onSelectAsset = (asset: AssetDto) => {
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
		assetBrowserOptions,
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
