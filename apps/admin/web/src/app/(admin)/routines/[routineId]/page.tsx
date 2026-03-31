"use client";

import type { AxiosError } from "axios";
import {
	getGetRoutinesQueryKey,
	useDeleteRoutine,
	useGetRoutine,
} from "@cocrepo/api/core/routines";
import {
	getAssetById,
	getGetAssetByIdQueryKey,
	type AssetDto,
} from "@cocrepo/api/assets";
import { AdminRoutinesRoutineIdPage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const AdminRoutinesDetailRoute = observer(() => {
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { data: response, error, isLoading, refetch } = useGetRoutine(routineId);
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
	const mappedRoutine = routine
		? {
				...routine,
				activities: [...(routine.activities ?? [])]
					.sort((left, right) => left.order - right.order)
					.map((activity) => ({
						id: activity.id,
						order: activity.order,
						repetitions: activity.repetitions,
						restTime: activity.restTime,
						notes: activity.notes,
						exerciseName: activity.task?.exercise?.name,
						imageAssetUrl: activity.task?.exercise?.imageFileId
							? (assetMap.get(activity.task.exercise.imageFileId)?.publicUrl ??
								undefined)
							: undefined,
						videoAssetUrl: activity.task?.exercise?.videoFileId
							? (assetMap.get(activity.task.exercise.videoFileId)?.publicUrl ??
								undefined)
							: undefined,
					})),
			}
		: undefined;
	const responseStatus = (error as AxiosError | null)?.response?.status;
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

	return (
		<AdminRoutinesRoutineIdPage
			routine={mappedRoutine}
			isLoading={isLoading}
			errorTitle={errorTitle}
			errorDescription={errorDescription}
			showRetryButton={Boolean(error && !isNotFound)}
			isDeleteModalOpen={isDeleteModalOpen}
			isDeleting={isDeleting}
			onClickBackButton={() => {
				router.push("/routines" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/routines/${routineId}/edit` as Route);
			}}
			onClickRetryButton={() => {
				void refetch();
			}}
			onClickOpenDeleteModal={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteRoutine(
					{ routineId },
					{
						onSuccess: () => {
							addToast({
								title: "삭제 성공",
								description: "루틴이 삭제되었습니다.",
								color: "success",
							});
							setIsDeleteModalOpen(false);
							queryClient.invalidateQueries({
								queryKey: getGetRoutinesQueryKey(),
							});
							router.push("/routines" as Route);
						},
						onError: (mutationError) => {
							addToast({
								title: "삭제 실패",
								description:
									mutationError.message ||
									"삭제 중 오류가 발생했습니다. 프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.",
								color: "danger",
							});
						},
					},
				);
			}}
		/>
	);
});

export default AdminRoutinesDetailRoute;
