"use client";

import {
	getGetTasksQueryKey,
	type TaskDto,
	useDeleteTask,
	useGetTasks,
} from "@cocrepo/api/core/tasks";
import {
	adminTasksPageQueryInputs,
	AdminTasksPage,
	type AdminTasksPageTask,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function TasksPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminTasksPageQueryInputs,
	);
	const { data: response, isLoading } = useGetTasks(getTaskParams(queryStates));
	const deleteMutation = useDeleteTask();
	const tasks = (response?.data ?? []).map(mapTaskRow);

	return (
		<AdminTasksPage
			tasks={tasks}
			totalCount={response?.meta?.total ?? tasks.length}
			isLoading={isLoading}
			isDeleting={deleteMutation.isPending}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/tasks/new" as Route);
			}}
			onClickTaskName={(taskId) => {
				router.push(`/tasks/${taskId}/exercise` as Route);
			}}
			onDeleteTask={async (taskId) => {
				try {
					await deleteMutation.mutateAsync({ taskId });
					await queryClient.invalidateQueries({
						queryKey: getGetTasksQueryKey(),
					});
					addToast({
						title: "삭제 성공",
						description: "태스크와 운동 detail이 삭제되었습니다.",
						color: "success",
					});
				} catch (error) {
					addToast({
						title: "삭제 실패",
						description:
							error instanceof Error
								? error.message
								: "삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 태스크는 삭제할 수 없습니다.",
						color: "danger",
					});
					throw error;
				}
			}}
		/>
	);
});

function getTaskParams(
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0],
) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}

function mapTaskRow(task: TaskDto): AdminTasksPageTask {
	return {
		id: task.id,
		name: task.exercise.name,
		duration: task.exercise.duration,
		count: task.exercise.count,
		description: task.exercise.description,
		createdAt: task.createdAt,
	};
}
