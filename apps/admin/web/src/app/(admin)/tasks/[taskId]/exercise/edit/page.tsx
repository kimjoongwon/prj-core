"use client";

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
import { useEffect } from "react";

type TaskExerciseEditPageParams = {
	taskId: string;
};

const AdminTasksTaskIdExerciseEditRoute = observer(() => {
	const { taskId } = useParams<TaskExerciseEditPageParams>();
	const router = useRouter();
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
			onClickCancelButton={onClickCancelButton}
			onClickSaveButton={onClickSaveButton}
		/>
	);
});

export default AdminTasksTaskIdExerciseEditRoute;
