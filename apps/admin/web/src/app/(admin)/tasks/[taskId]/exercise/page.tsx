"use client";

import {
	type ExerciseDto,
	useDeleteTask,
	useGetTaskExercise,
	useGetTaskRoutines,
} from "@cocrepo/api/core/tasks";
import { Button, TaskExerciseEditScreen } from "@cocrepo/ui";
import { Modal, toast, useOverlayState } from "@heroui/react";
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
			<TaskExerciseEditScreen
				title={exercise?.name ?? "운동 정보"}
				description="태스크에 연결된 운동 detail입니다."
				state={{
					name: exercise?.name ?? "",
					durationMin: Math.floor((exercise?.duration ?? 0) / 60),
					durationSec: (exercise?.duration ?? 0) % 60,
					count: exercise?.count ?? 1,
					description: exercise?.description ?? "",
					imageFileId: exercise?.imageFileId ?? "",
					videoFileId: exercise?.videoFileId ?? "",
					errors: {},
				}}
				readOnly
				metadata={{
					taskId,
					tenantId: exercise?.task?.tenantId,
					createdAt: exercise?.createdAt,
					updatedAt: exercise?.updatedAt,
					routines,
				}}
				isLoading={isLoading}
				isNotFound={!isLoading && !exercise}
				isSubmitPending={false}
				actions={
					<div className="flex gap-2">
						<Button
							variant="flat"
							startContent={<Pencil className="size-4" />}
							onPress={onClickEditButton}
						>
							수정
						</Button>
						<Button
							color="danger"
							variant="flat"
							startContent={<Trash2 className="size-4" />}
							onPress={deleteModal.open}
							isDisabled={routines.length > 0}
						>
							삭제
						</Button>
					</div>
				}
				onClickCancelButton={onClickBackButton}
			/>
			<Modal state={deleteModal}>
				<Modal.Backdrop>
					<Modal.Container>
						<Modal.Dialog>
							<Modal.Header>태스크 삭제</Modal.Header>
							<Modal.Body>
								<p>
									<strong>{exercise?.name ?? "운동"}</strong> 운동 detail이
									포함된 태스크를 삭제하시겠습니까?
								</p>
								<p className="mt-2 text-sm text-danger">
									이 작업은 되돌릴 수 없습니다.
								</p>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="flat"
									onPress={deleteModal.close}
									isDisabled={isDeleting}
								>
									취소
								</Button>
								<Button
									color="danger"
									onPress={onClickDeleteConfirmButton}
									isLoading={isDeleting}
								>
									삭제
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>
		</>
	);
});

export default AdminTasksTaskIdExerciseRoute;
