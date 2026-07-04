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
	Button,
	type RoutineActivityFormItem,
	RoutineEditScreen,
	type RoutineFormState,
	type RoutineTaskCandidate,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

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
	const persistStore = usePersistStore();
	const [isEmptyActivitiesWarningOpen, setIsEmptyActivitiesWarningOpen] =
		useState(false);
	const state = useLocalObservable<RoutineFormState>(() => ({
		name: "",
		label: "",
		exerciseQuery: "",
		activities: [],
		errors: {},
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
				toast.success("루틴 등록 성공", {
					description: "루틴이 성공적으로 등록되었습니다.",
				});
				const routineId = response?.data?.id;
				if (routineId) {
					router.push(`/routines/${routineId}` as Route);
				}
			},
			onError: (error) => {
				toast.danger("루틴 등록 실패", {
					description: error.message || "루틴 등록 중 오류가 발생했습니다.",
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
		const errors: RoutineFormState["errors"] = {};
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
		<RoutineEditScreen
			title="루틴 등록"
			description="새로운 운동 루틴을 등록합니다."
			state={state}
			contentLanguageCode={persistStore.contentLanguageCode}
			activities={activities}
			candidateTasks={candidateTasks}
			isTasksLoading={isTasksLoading}
			isSubmitting={isPending}
			isEmptyActivitiesWarningOpen={isEmptyActivitiesWarningOpen}
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/routines" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						onPress={onClickSaveButton}
					>
						저장
					</Button>
				</div>
			}
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
