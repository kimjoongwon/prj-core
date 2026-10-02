"use client";

import {
	type AssetDto,
	getAssetById,
	getGetAssetByIdQueryKey,
} from "@cocrepo/api/assets";
import type { ApiClientError } from "@cocrepo/api/core/client";
import {
	getGetRoutinesQueryKey,
	useDeleteRoutine,
	useGetRoutine,
} from "@cocrepo/api/core/routines";
import {
	Button,
	HStack,
	type RoutineActivityFormItem,
	RoutineEditScreen,
	type RoutineFormState,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

const AdminRoutinesDetailRoute = observer(() => {
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		data: response,
		error,
		isLoading,
		refetch,
	} = useGetRoutine(routineId);
	const routine = response?.data;
	const assetIds = Array.from(
		new Set(
			(routine?.activities ?? []).flatMap((activity) =>
				[
					activity.task?.exercise?.imageFileId,
					activity.task?.exercise?.videoFileId,
				].filter((value): value is string => Boolean(value)),
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
	const routineActivities: RoutineActivityFormItem[] = [
		...(routine?.activities ?? []),
	]
		.sort((left, right) => left.order - right.order)
		.map((activity) => ({
			taskId: String(activity.taskId),
			exerciseName:
				activity.task?.exercise?.name ?? String(activity.taskId).slice(-6),
			isSchedulable: Boolean(activity.task?.exercise?.videoFileId),
			imageFileId: activity.task?.exercise?.imageFileId ?? undefined,
			videoFileId: activity.task?.exercise?.videoFileId ?? undefined,
			imageAssetUrl: activity.task?.exercise?.imageFileId
				? (assetMap.get(activity.task.exercise.imageFileId)?.publicUrl ??
					undefined)
				: undefined,
			videoAssetUrl: activity.task?.exercise?.videoFileId
				? (assetMap.get(activity.task.exercise.videoFileId)?.publicUrl ??
					undefined)
				: undefined,
			repetitions: String(activity.repetitions ?? 1),
			restTime: String(activity.restTime ?? 0),
			notes: activity.notes ?? "",
		}));
	const routineState: RoutineFormState | undefined = routine
		? {
				name: routine.name,
				label: routine.label,
				exerciseQuery: "",
				activities: routineActivities,
				errors: {},
			}
		: undefined;
	const responseStatus = (error as ApiClientError | null)?.status;
	const isNotFound = responseStatus === 404;
	const errorTitle = error
		? isNotFound
			? "루틴을 찾을 수 없습니다."
			: "루틴을 불러오지 못했습니다."
		: undefined;
	const errorDescription = error
		? isNotFound
			? "현재 Space에서 접근 가능한 루틴이 아니거나 삭제되었습니다."
			: "잠시 후 다시 시도해주세요."
		: undefined;

	const { mutate: deleteRoutine, isPending: isDeleting } = useDeleteRoutine();
	const onClickDeleteButton = () => {
		deleteRoutine(
			{ routineId },
			{
				onSuccess: () => {
					toast.success("삭제 성공", { description: "루틴이 삭제되었습니다." });
					queryClient.invalidateQueries({
						queryKey: getGetRoutinesQueryKey(),
					});
					router.push("/routines" as Route);
				},
				onError: (mutationError) => {
					toast.danger("삭제 실패", {
						description:
							mutationError.message ||
							"삭제 중 오류가 발생했습니다. 프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.",
					});
				},
			},
		);
	};

	return (
		<RoutineEditScreen
			title={routine?.name || "루틴 상세"}
			description={errorDescription || "루틴의 상세 정보입니다."}
			state={routineState}
			activities={routineActivities}
			programs={routine?.programs ?? []}
			metadata={
				routine
					? {
							createdAt: routine.createdAt,
							updatedAt: routine.updatedAt,
						}
					: undefined
			}
			readOnly
			isLoading={isLoading}
			notFound={Boolean(errorTitle) || (!isLoading && !routine)}
			notFoundMessage={errorTitle ?? "루틴을 찾을 수 없습니다."}
			notFoundAction={
				<HStack>
					{error && !isNotFound ? (
						<Button
							variant="tertiary"
							onPress={() => {
								void refetch();
							}}
						>
							다시 시도
						</Button>
					) : null}
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/routines" as Route);
						}}
					>
						목록으로
					</Button>
				</HStack>
			}
			actions={
				<HStack className="flex-wrap">
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/routines" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="tertiary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={() => {
							router.push(`/routines/${routineId}/edit` as Route);
						}}
					>
						수정
					</Button>
					<Button
						variant="tertiary"
						startContent={<Trash2 className="h-4 w-4" />}
						isLoading={isDeleting}
						onPress={onClickDeleteButton}
					>
						삭제
					</Button>
				</HStack>
			}
		/>
	);
});

export default AdminRoutinesDetailRoute;
