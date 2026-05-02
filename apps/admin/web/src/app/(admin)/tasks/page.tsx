"use client";

import {
	getGetTasksQueryKey,
	useDeleteTask,
	useGetTasks,
} from "@cocrepo/api/core/tasks";
import { TaskListPage } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

interface TasksQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}

export default observer(function TasksPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		spaceScope: parseAsString.withDefault(""),
	});
	const taskParams = getTaskParams(queryStates);
	const { data: response, isLoading } = useGetTasks(taskParams);
	const deleteMutation = useDeleteTask();

	return (
		<TaskListPage
			tasks={response?.data}
			totalCount={response?.meta?.total ?? response?.data?.length ?? 0}
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

function getTaskParams(queryStates: TasksQueryStates) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}
