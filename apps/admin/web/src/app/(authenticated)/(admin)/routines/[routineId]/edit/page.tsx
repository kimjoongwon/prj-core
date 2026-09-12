"use client";

import {
	type AssetDto,
	getAssetById,
	getGetAssetByIdQueryKey,
} from "@cocrepo/api/assets";
import {
	type CreateRoutineActivityItemDto,
	getGetRoutineQueryKey,
	useGetRoutine,
	useUpdateRoutine,
} from "@cocrepo/api/core/routines";
import { type TaskDto, useGetTasks } from "@cocrepo/api/core/tasks";
import { useApp } from "@cocrepo/store";
import {
	Button,
	type RoutineActivityFormItem,
	RoutineEditScreen,
	type RoutineFormState,
	type RoutineTaskCandidate,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

const AdminRoutinesEditRoute = observer(() => {
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const app = useApp();
	const queryClient = useQueryClient();
	const state = useLocalObservable<
		RoutineFormState & { isInitialized: boolean }
	>(() => ({
		name: "",
		label: "",
		exerciseQuery: "",
		activities: [],
		errors: {},
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetRoutine(routineId);
	const routine = response?.data;
	const { data: tasksResponse, isLoading: isTasksLoading } = useGetTasks({
		take: 30,
		skip: 0,
		search: state.exerciseQuery.trim() || undefined,
		spaceScope: "INCLUDE_ANCESTORS",
	});
	const tasks = tasksResponse?.data ?? [];
	const assetIds = Array.from(
		new Set([
			...tasks.flatMap((task) =>
				[task.exercise?.imageFileId, task.exercise?.videoFileId].filter(
					(value): value is string => Boolean(value),
				),
			),
			...((routine?.activities ?? []).flatMap((activity) =>
				[
					activity.task?.exercise?.imageFileId,
					activity.task?.exercise?.videoFileId,
				].filter((value): value is string => Boolean(value)),
			) ?? []),
		]),
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

	useEffect(() => {
		if (!routine || state.isInitialized) {
			return;
		}
		state.name = routine.name;
		state.label = routine.label;
		state.activities = (routine.activities ?? []).map((activity) => ({
			taskId: String(activity.taskId),
			exerciseName:
				activity.task?.exercise?.name ?? String(activity.taskId).slice(-6),
			isSchedulable: Boolean(activity.task?.exercise?.videoFileId),
			imageFileId: activity.task?.exercise?.imageFileId ?? undefined,
			videoFileId: activity.task?.exercise?.videoFileId ?? undefined,
			repetitions: String(activity.repetitions ?? 1),
			restTime: String(activity.restTime ?? 0),
			notes: activity.notes ?? "",
		}));
		state.isInitialized = true;
	}, [routine, state]);

	const candidateTasks = tasks
		.filter((task) => Boolean(task.exercise?.videoFileId))
		.map((task) => mapRoutineTaskCandidate(task, assetMap));
	const activities = state.activities.map((activity) =>
		mapRoutineActivityFormItem(activity, assetMap),
	);

	const { mutate: updateRoutine, isPending } = useUpdateRoutine({
		mutation: {
			onSuccess: () => {
				toast.success("루틴 수정 성공", {
					description: "루틴이 성공적으로 수정되었습니다.",
				});
				queryClient.invalidateQueries({
					queryKey: getGetRoutineQueryKey(routineId),
				});
				router.push(`/routines/${routineId}` as Route);
			},
			onError: (error) => {
				toast.danger("루틴 수정 실패", {
					description: error.message || "루틴 수정 중 오류가 발생했습니다.",
				});
			},
		},
	});

	const submitRoutine = () => {
		const routineActivities: CreateRoutineActivityItemDto[] = [];
		for (const [index, activity] of state.activities.entries()) {
			const taskId = parsePositiveBigInt(activity.taskId);
			if (taskId === undefined) {
				state.errors.activities = "유효한 운동을 선택해주세요.";
				return;
			}
			routineActivities.push({
				taskId,
				order: index + 1,
				repetitions: toPositiveNumberOr(activity.repetitions, 1),
				restTime: toNonNegativeNumberOr(activity.restTime, 0),
				notes: activity.notes.trim() || undefined,
			});
		}
		updateRoutine({
			routineId,
			data: {
				name: state.name.trim(),
				label: state.label.trim(),
				activities: routineActivities,
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
		submitRoutine();
	};

	return (
		<RoutineEditScreen
			title="루틴 수정"
			description={
				routine?.name
					? `${routine.name} 루틴을 수정합니다.`
					: "루틴을 수정합니다."
			}
			state={state}
			contentLanguageCode={app.contentLanguageCode}
			activities={activities}
			candidateTasks={candidateTasks}
			isLoading={isLoading}
			notFound={!isLoading && !routine}
			isTasksLoading={isTasksLoading}
			actions={
				<div className="flex gap-2">
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(`/routines/${routineId}` as Route);
						}}
					>
						상세로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						isLoading={isPending}
						onPress={onClickSaveButton}
					>
						저장
					</Button>
				</div>
			}
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
		id: String(task.id),
		exerciseName: task.exercise.name,
		exerciseCount: task.exercise.count || 1,
		imageFileId: task.exercise.imageFileId ?? undefined,
		videoFileId: task.exercise.videoFileId ?? undefined,
		imageAssetUrl: imageAssetUrl ?? undefined,
		videoAssetUrl: videoAssetUrl ?? undefined,
		isSchedulable: Boolean(task.exercise.videoFileId),
	};
}

function parsePositiveBigInt(value: string): bigint | undefined {
	const trimmedValue = value.trim();
	return /^[1-9]\d*$/.test(trimmedValue) ? BigInt(trimmedValue) : undefined;
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

export default AdminRoutinesEditRoute;
