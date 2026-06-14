"use client";

import {
	type ExerciseDto,
	useDeleteTask,
	useGetTaskExercise,
	useGetTaskRoutines,
} from "@cocrepo/api/core/tasks";
import { TaskExerciseDetailScreen } from "@cocrepo/ui";
import { toast, useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type TaskExerciseDetailScreenParams = {
	taskId: string;
};

const AdminTasksTaskIdExerciseRoute = observer(() => {
	const { taskId } = useParams<TaskExerciseDetailScreenParams>();
	const router = useRouter();
	const deleteModal = useOverlayState();

	const { data: response, isLoading } = useGetTaskExercise(taskId);
	const exercise = response?.data as ExerciseDto | undefined;
	const { data: routinesResponse } = useGetTaskRoutines(taskId);
	const routines = routinesResponse?.data ?? [];
	const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

	const onClickBackButton = () => {
		router.push("/tasks" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/tasks/${taskId}/exercise/edit` as Route);
	};

	const onClickDeleteConfirmButton = () => {
		deleteTask(
			{ taskId },
			{
				onSuccess: () => {
					toast.success("태스크 삭제 성공", {
						description: "태스크와 운동 detail이 삭제되었습니다.",
					});
					deleteModal.close();
					router.push("/tasks" as Route);
				},
				onError: (error) => {
					toast.danger("태스크 삭제 실패", {
						description:
							error.message ||
							"삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 태스크는 삭제할 수 없습니다.",
					});
				},
			},
		);
	};

	return (
		<>
			<TaskExerciseDetailScreen
				taskId={taskId}
				exercise={
					exercise
						? {
								name: exercise.name,
								duration: exercise.duration,
								count: exercise.count,
								description: exercise.description,
								imageFileId: exercise.imageFileId,
								imageAssetHref: exercise.imageFileId
									? (`/assets/${exercise.imageFileId}` as Route)
									: undefined,
								videoFileId: exercise.videoFileId,
								videoAssetHref: exercise.videoFileId
									? (`/assets/${exercise.videoFileId}` as Route)
									: undefined,
								createdAt: exercise.createdAt,
								updatedAt: exercise.updatedAt,
								spaceId: exercise.task?.spaceId,
							}
						: undefined
				}
				routines={routines}
				isSchedulable={Boolean(exercise?.videoFileId)}
				isLoading={isLoading}
				isNotFound={!isLoading && !exercise}
				isDeleteModalOpen={deleteModal.isOpen}
				isDeletePending={isDeleting}
				onClickBackButton={onClickBackButton}
				onClickEditButton={onClickEditButton}
				onClickDeleteButton={deleteModal.open}
				onClickDeleteConfirmButton={onClickDeleteConfirmButton}
				onClickDeleteCancelButton={deleteModal.close}
			/>
		</>
	);
});

export default AdminTasksTaskIdExerciseRoute;
