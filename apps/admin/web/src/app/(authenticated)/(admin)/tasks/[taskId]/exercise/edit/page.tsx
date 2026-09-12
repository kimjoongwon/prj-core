"use client";

import {
	type ExerciseDto,
	useGetTaskExercise,
	useUpdateTaskExercise,
} from "@cocrepo/api/core/tasks";
import { useTaskExerciseAssetBrowser } from "@cocrepo/hook";
import { useApp } from "@cocrepo/store";
import {
	TaskExerciseEditScreen,
	type TaskExerciseFormState,
	useT,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type TaskExerciseEditScreenParams = {
	taskId: string;
};

const AdminTasksTaskIdExerciseEditRoute = observer(() => {
	const t = useT();
	const { taskId } = useParams<TaskExerciseEditScreenParams>();
	const router = useRouter();
	const app = useApp();
	const state = useLocalObservable<TaskExerciseFormState>(() => ({
		name: "",
		durationMin: 0,
		durationSec: 0,
		count: 1,
		description: "",
		imageFileId: "",
		videoFileId: "",
		errors: {},
	}));
	const routeState = useLocalObservable(() => ({
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetTaskExercise(taskId);
	const exercise = response?.data as ExerciseDto | undefined;
	const {
		activeAssetSlot,
		assetBrowser,
		assetBrowserTitle,
		assetBrowserDescription,
		selectedAssetId,
		selectedImageAsset,
		selectedVideoAsset,
		onOpenAssetBrowser,
		onCloseAssetBrowser,
		onSelectAsset,
	} = useTaskExerciseAssetBrowser({
		imageFileId: state.imageFileId,
		videoFileId: state.videoFileId,
		onChangeImageFileId: (value) => {
			state.imageFileId = value;
		},
		onChangeVideoFileId: (value) => {
			state.videoFileId = value;
		},
		onAssetBrowserNotify: ({ title, description }) => {
			toast.success(title, { description });
		},
	});

	useEffect(() => {
		if (exercise && !routeState.isInitialized) {
			state.name = exercise.name;
			state.durationMin = Math.floor(exercise.duration / 60);
			state.durationSec = exercise.duration % 60;
			state.count = exercise.count;
			state.description = exercise.description || "";
			state.imageFileId = exercise.imageFileId || "";
			state.videoFileId = exercise.videoFileId || "";
			routeState.isInitialized = true;
		}
	}, [exercise, routeState, state]);

	const { mutate: updateTaskExercise, isPending } = useUpdateTaskExercise({
		mutation: {
			onSuccess: () => {
				toast.success(t("운동 정보 수정 성공"), {
					description: t("운동 detail이 성공적으로 수정되었습니다."),
				});
				router.push(`/tasks/${taskId}/exercise` as Route);
			},
			onError: (error) => {
				toast.danger(t("운동 정보 수정 실패"), {
					description:
						error.message || t("운동 detail 수정 중 오류가 발생했습니다."),
				});
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/tasks/${taskId}/exercise` as Route);
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
		<TaskExerciseEditScreen
			title="운동 정보 수정"
			description={
				exercise?.name
					? `${exercise.name} 운동 detail을 수정합니다.`
					: "운동 detail을 수정합니다."
			}
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			selectedImageAsset={selectedImageAsset}
			selectedVideoAsset={selectedVideoAsset}
			assetBrowserProps={assetBrowser}
			assetBrowserTitle={assetBrowserTitle}
			assetBrowserDescription={assetBrowserDescription}
			assetBrowserSelectedAssetId={selectedAssetId}
			isAssetBrowserOpen={activeAssetSlot !== null}
			isLoading={isLoading}
			isNotFound={!isLoading && !exercise}
			isSubmitPending={isPending}
			onOpenImagePicker={() => {
				onOpenAssetBrowser("image");
			}}
			onOpenVideoPicker={() => {
				onOpenAssetBrowser("video");
			}}
			onCloseAssetBrowser={onCloseAssetBrowser}
			onSelectAssetFromBrowser={onSelectAsset}
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
