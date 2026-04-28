"use client";

import {
	type AssetDto,
	getAssetById,
	getGetAssetByIdQueryKey,
} from "@cocrepo/api/assets";
import {
	type CreateRoutineActivityItemDto,
	useCreateRoutine,
} from "@cocrepo/api/core/routines";
import { type TaskDto, useGetTasks } from "@cocrepo/api/core/tasks";
import {
	type RoutineActivityFormItem,
	RoutineCreatePage,
	type RoutineTaskCandidate,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueries } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

const toPositiveNumberOr = (value: string, defaultValue: number) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 1) {
		return defaultValue;
	}
	return Math.floor(parsed);
};

const toNonNegativeNumberOr = (value: string, defaultValue: number) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		return defaultValue;
	}
	return Math.floor(parsed);
};

const AdminRoutinesNewRoute = observer(() => {
	const router = useRouter();
	const [isEmptyActivitiesWarningOpen, setIsEmptyActivitiesWarningOpen] =
		useState(false);
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		exerciseQuery: "",
		activities: [] as RoutineActivityFormItem[],
		errors: {} as Record<string, string>,
	}));

	const { data: tasksResponse, isLoading: isTasksLoading } = useGetTasks({
		take: 30,
		skip: 0,
		search: state.exerciseQuery.trim() || undefined,
		spaceScope: "INCLUDE_ANCESTORS",
	});
	const tasks = (tasksResponse?.data ?? []) as TaskDto[];
	const assetIds = Array.from(
		new Set(
			tasks.flatMap((task) =>
				[task.exercise?.imageFileId, task.exercise?.videoFileId].filter(
					(value): value is string => Boolean(value),
				),
			),
		),
	);
	const assetQueries = useQueries({
		queries: assetIds.map((assetId) => ({
			queryKey: getGetAssetByIdQueryKey(assetId),
			queryFn: ({ signal }: { signal: AbortSignal }) =>
				getAssetById(assetId, undefined, signal),
			enabled: Boolean(assetId),
		})),
	});
	const assetMap = new Map<string, AssetDto>();
	assetIds.forEach((assetId, index) => {
		const asset = assetQueries[index]?.data?.data;
		if (asset) {
			assetMap.set(assetId, asset);
		}
	});
	const candidateTasks = tasks
		.filter((task) => Boolean(task.exercise?.videoFileId))
		.map((task) => mapRoutineTaskCandidate(task, assetMap));
	const activities = state.activities.map((activity) =>
		mapRoutineActivityFormItem(activity, assetMap),
	);

	const { mutate: createRoutine, isPending } = useCreateRoutine({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "루틴 등록 성공",
					description: "루틴이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const routineId = response?.data?.id;
				if (routineId) {
					router.push(`/routines/${routineId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "루틴 등록 실패",
					description: error.message || "루틴 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const submitRoutine = () => {
		createRoutine({
			data: {
				name: state.name.trim(),
				label: state.label.trim(),
				activities: state.activities.map((activity, index) => ({
					taskId: activity.taskId,
					order: index + 1,
					repetitions: toPositiveNumberOr(activity.repetitions, 1),
					restTime: toNonNegativeNumberOr(activity.restTime, 0),
					notes: activity.notes.trim() || undefined,
				})) as unknown as CreateRoutineActivityItemDto,
			},
		});
	};

	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};
		if (!state.name.trim()) {
			errors.name = "루틴 이름을 입력해주세요.";
		}
		if (!state.label.trim()) {
			errors.label = "단축 라벨을 입력해주세요.";
		}
		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}
		if (state.activities.some((activity) => !activity.isSchedulable)) {
			state.errors.activities =
				"영상이 없는 운동이 포함되어 있어 루틴을 저장할 수 없습니다.";
			return;
		}
		if (state.activities.length === 0) {
			setIsEmptyActivitiesWarningOpen(true);
			return;
		}
		submitRoutine();
	};

	return (
		<RoutineCreatePage
			name={state.name}
			label={state.label}
			exerciseQuery={state.exerciseQuery}
			activities={activities}
			candidateTasks={candidateTasks}
			nameError={state.errors.name}
			labelError={state.errors.label}
			activitiesError={state.errors.activities}
			isTasksLoading={isTasksLoading}
			isSubmitting={isPending}
			isEmptyActivitiesWarningOpen={isEmptyActivitiesWarningOpen}
			onChangeNameInput={(value) => {
				state.name = value;
				delete state.errors.name;
			}}
			onChangeLabelInput={(value) => {
				state.label = value;
				delete state.errors.label;
			}}
			onChangeExerciseQueryInput={(value) => {
				state.exerciseQuery = value;
			}}
			onClickAddActivityButton={(taskId) => {
				const task = tasks.find((item) => item.id === taskId);
				if (!task?.exercise?.videoFileId) {
					addToast({
						title: "편성 불가 운동",
						description: "영상이 등록된 운동만 루틴에 추가할 수 있습니다.",
						color: "warning",
					});
					return;
				}
				if (state.activities.some((activity) => activity.taskId === task.id)) {
					addToast({
						title: "중복 운동",
						description: "이미 추가된 운동입니다.",
						color: "warning",
					});
					return;
				}
				state.activities.push({
					taskId: task.id,
					exerciseName: task.exercise.name,
					isSchedulable: true,
					imageFileId: task.exercise.imageFileId,
					videoFileId: task.exercise.videoFileId,
					repetitions: String(task.exercise.count || 1),
					restTime: "0",
					notes: "",
				});
				delete state.errors.activities;
			}}
			onChangeActivityInput={(taskId, field, value) => {
				const activity = state.activities.find(
					(item) => item.taskId === taskId,
				);
				if (!activity) {
					return;
				}
				activity[field] = value;
			}}
			onClickRemoveActivityButton={(taskId) => {
				state.activities = state.activities.filter(
					(activity) => activity.taskId !== taskId,
				);
				delete state.errors.activities;
			}}
			onReorderActivities={(fromIndex, toIndex) => {
				const nextActivities = state.activities.slice();
				const [movedActivity] = nextActivities.splice(fromIndex, 1);
				if (!movedActivity) {
					return;
				}
				nextActivities.splice(toIndex, 0, movedActivity);
				state.activities = nextActivities;
			}}
			onClickCancelButton={() => {
				router.push("/routines" as Route);
			}}
			onClickSaveButton={onClickSaveButton}
			onCloseEmptyActivitiesWarningModal={() => {
				setIsEmptyActivitiesWarningOpen(false);
			}}
			onClickConfirmEmptyActivitiesWarningButton={() => {
				setIsEmptyActivitiesWarningOpen(false);
				submitRoutine();
			}}
		/>
	);
});

function mapRoutineTaskCandidate(
	task: TaskDto,
	assetMap: Map<string, AssetDto>,
): RoutineTaskCandidate {
	const imageAssetUrl = task.exercise.imageFileId
		? assetMap.get(task.exercise.imageFileId)?.publicUrl
		: undefined;
	const videoAssetUrl = task.exercise.videoFileId
		? assetMap.get(task.exercise.videoFileId)?.publicUrl
		: undefined;

	return {
		id: task.id,
		exerciseName: task.exercise.name,
		exerciseCount: task.exercise.count || 1,
		imageFileId: task.exercise.imageFileId,
		videoFileId: task.exercise.videoFileId,
		imageAssetUrl: imageAssetUrl ?? undefined,
		videoAssetUrl: videoAssetUrl ?? undefined,
		isSchedulable: Boolean(task.exercise.videoFileId),
	};
}

function mapRoutineActivityFormItem(
	activity: RoutineActivityFormItem,
	assetMap: Map<string, AssetDto>,
): RoutineActivityFormItem {
	const imageAssetUrl = activity.imageFileId
		? assetMap.get(activity.imageFileId)?.publicUrl
		: undefined;
	const videoAssetUrl = activity.videoFileId
		? assetMap.get(activity.videoFileId)?.publicUrl
		: undefined;

	return {
		...activity,
		imageAssetUrl: imageAssetUrl ?? undefined,
		videoAssetUrl: videoAssetUrl ?? undefined,
	};
}

export default AdminRoutinesNewRoute;
