"use client";

import { useGetAssetById, useGetAssets } from "@cocrepo/api/assets";
import {
	type ExerciseDto,
	useGetTaskExercise,
	useUpdateTaskExercise,
} from "@cocrepo/api/core/tasks";
import { AdminTasksTaskIdExerciseEditPage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TaskExerciseEditPageParams = {
	taskId: string;
};

const AdminTasksTaskIdExerciseEditRoute = observer(() => {
	const { taskId } = useParams<TaskExerciseEditPageParams>();
	const router = useRouter();
	const [assetPickerKind, setAssetPickerKind] = useState<"image" | "video" | null>(
		null,
	);
	const [assetSearchQuery, setAssetSearchQuery] = useState("");
	const state = useLocalObservable(() => ({
		name: "",
		durationMin: 0,
		durationSec: 0,
		count: 1,
		description: "",
		imageFileId: "",
		videoFileId: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetTaskExercise(taskId);
	const exercise = response?.data as ExerciseDto | undefined;
	const { data: selectedImageAssetResponse } = useGetAssetById(state.imageFileId, {
		query: {
			enabled: state.imageFileId.trim().length > 0,
		},
	});
	const { data: selectedVideoAssetResponse } = useGetAssetById(state.videoFileId, {
		query: {
			enabled: state.videoFileId.trim().length > 0,
		},
	});
	const { data: imageAssetsResponse, isLoading: isImageAssetsLoading } = useGetAssets(
		{
			take: 18,
			skip: 0,
			search: assetSearchQuery.trim() || undefined,
			kind: "IMAGE",
			status: "READY",
		},
		{
			query: {
				enabled: assetPickerKind === "image",
			},
		},
	);
	const { data: videoAssetsResponse, isLoading: isVideoAssetsLoading } = useGetAssets(
		{
			take: 18,
			skip: 0,
			search: assetSearchQuery.trim() || undefined,
			kind: "VIDEO",
			status: "READY",
		},
		{
			query: {
				enabled: assetPickerKind === "video",
			},
		},
	);

	useEffect(() => {
		if (exercise && !state.isInitialized) {
			state.name = exercise.name;
			state.durationMin = Math.floor(exercise.duration / 60);
			state.durationSec = exercise.duration % 60;
			state.count = exercise.count;
			state.description = exercise.description || "";
			state.imageFileId = exercise.imageFileId || "";
			state.videoFileId = exercise.videoFileId || "";
			state.isInitialized = true;
		}
	}, [exercise, state]);

	const { mutate: updateTaskExercise, isPending } = useUpdateTaskExercise({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "운동 정보 수정 성공",
					description: "운동 detail이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/tasks/${taskId}/exercise` as Route);
			},
			onError: (error) => {
				addToast({
					title: "운동 정보 수정 실패",
					description:
						error.message || "운동 detail 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/tasks/${taskId}/exercise` as Route);
	};

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeDurationMinInput = (value: string) => {
		state.durationMin = Number(value) || 0;
		delete state.errors.duration;
	};

	const onChangeDurationSecInput = (value: string) => {
		state.durationSec = Number(value) || 0;
		delete state.errors.duration;
	};

	const onChangeCountInput = (value: string) => {
		state.count = Number(value) || 1;
		delete state.errors.count;
	};

	const onChangeDescriptionTextarea = (value: string) => {
		state.description = value;
	};

	const onChangeImageFileIdInput = (value: string) => {
		state.imageFileId = value;
	};

	const onChangeVideoFileIdInput = (value: string) => {
		state.videoFileId = value;
	};

	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "운동명을 입력해주세요.";
		}

		const duration = state.durationMin * 60 + state.durationSec;
		if (duration < 1) {
			errors.duration = "지속시간은 1초 이상이어야 합니다.";
		}

		if (state.count < 1) {
			errors.count = "반복횟수는 1회 이상이어야 합니다.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateTaskExercise({
			taskId,
			data: {
				name: state.name.trim(),
				duration,
				count: state.count,
				description: state.description.trim() || undefined,
				imageFileId: state.imageFileId.trim() || undefined,
				videoFileId: state.videoFileId.trim() || undefined,
			},
		});
	};

	return (
		<AdminTasksTaskIdExerciseEditPage
			exerciseName={exercise?.name}
			name={state.name}
			durationMin={state.durationMin}
			durationSec={state.durationSec}
			count={state.count}
			description={state.description}
			imageFileId={state.imageFileId}
			videoFileId={state.videoFileId}
			selectedImageAsset={selectedImageAssetResponse?.data}
			selectedVideoAsset={selectedVideoAssetResponse?.data}
			imageAssets={imageAssetsResponse?.data ?? []}
			videoAssets={videoAssetsResponse?.data ?? []}
			assetSearchQuery={assetSearchQuery}
			isImagePickerOpen={assetPickerKind === "image"}
			isVideoPickerOpen={assetPickerKind === "video"}
			isImageAssetsLoading={isImageAssetsLoading}
			isVideoAssetsLoading={isVideoAssetsLoading}
			errors={state.errors}
			isSchedulable={state.videoFileId.trim().length > 0}
			isLoading={isLoading}
			isNotFound={!isLoading && !exercise}
			isSubmitPending={isPending}
			onChangeNameInput={onChangeNameInput}
			onChangeDurationMinInput={onChangeDurationMinInput}
			onChangeDurationSecInput={onChangeDurationSecInput}
			onChangeCountInput={onChangeCountInput}
			onChangeDescriptionTextarea={onChangeDescriptionTextarea}
			onChangeImageFileIdInput={onChangeImageFileIdInput}
			onChangeVideoFileIdInput={onChangeVideoFileIdInput}
			onChangeAssetSearchQuery={setAssetSearchQuery}
			onOpenImagePicker={() => {
				setAssetSearchQuery("");
				setAssetPickerKind("image");
			}}
			onCloseImagePicker={() => {
				setAssetPickerKind((current) => (current === "image" ? null : current));
			}}
			onOpenVideoPicker={() => {
				setAssetSearchQuery("");
				setAssetPickerKind("video");
			}}
			onCloseVideoPicker={() => {
				setAssetPickerKind((current) => (current === "video" ? null : current));
			}}
			onSelectImageAsset={(asset) => {
				state.imageFileId = asset.id;
				setAssetPickerKind(null);
			}}
			onSelectVideoAsset={(asset) => {
				state.videoFileId = asset.id;
				setAssetPickerKind(null);
			}}
			onClickClearImageAssetButton={() => {
				state.imageFileId = "";
			}}
			onClickClearVideoAssetButton={() => {
				state.videoFileId = "";
			}}
			onClickCancelButton={onClickCancelButton}
			onClickSaveButton={onClickSaveButton}
		/>
	);
});

export default AdminTasksTaskIdExerciseEditRoute;
