"use client";

import {
	type ExerciseDto,
	useDeleteTask,
	useGetTaskExercise,
	useGetTaskRoutines,
} from "@cocrepo/api/core/tasks";
import { Button, TaskExerciseEditScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

type TaskExerciseRouteParams = {
	taskId: string;
};

const AdminTasksTaskIdExerciseRoute = observer(() => {
	const { taskId } = useParams<TaskExerciseRouteParams>();
	const router = useRouter();

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

	const onClickDeleteButton = () => {
		deleteTask(
			{ taskId },
			{
				onSuccess: () => {
					toast.success("태스크 삭제 성공", {
						description: "태스크와 운동 detail이 삭제되었습니다.",
					});
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
		<TaskExerciseEditScreen
			title={exercise?.name ?? "운동 정보"}
			description="태스크에 연결된 운동 detail입니다."
			state={
				exercise
					? {
							name: exercise.name,
							durationMin: Math.floor(exercise.duration / 60),
							durationSec: exercise.duration % 60,
							count: exercise.count,
							description: exercise.description ?? "",
							imageFileId: exercise.imageFileId ?? "",
							videoFileId: exercise.videoFileId ?? "",
							errors: {},
						}
					: (undefined as never)
			}
			readOnly
			metadata={
				exercise
					? {
							taskId: exercise.taskId,
							spaceId: exercise.task.spaceId,
							createdAt: exercise.createdAt,
							updatedAt: exercise.updatedAt,
							routines,
						}
					: undefined
			}
			isLoading={isLoading}
			isNotFound={!isLoading && !exercise}
			isSubmitPending={false}
			actions={
				<div className="flex gap-2">
					<Button
						variant="tertiary"
						startContent={<Pencil className="size-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
					<Button


						variant="tertiary"
						startContent={<Trash2 className="size-4" />}
						onPress={onClickDeleteButton}
						isDisabled={routines.length > 0 || isDeleting}
						isLoading={isDeleting}
					>
						삭제
					</Button>
				</div>
			}
			onClickCancelButton={onClickBackButton}
		/>
	);
});

export default AdminTasksTaskIdExerciseRoute;
