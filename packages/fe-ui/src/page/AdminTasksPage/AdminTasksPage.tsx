"use client";

import {
	getGetTasksQueryKey,
	type TaskDto,
	useDeleteTask,
	useGetTasksSuspense,
} from "@cocrepo/api/core/tasks";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	buildTaskTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "운동명으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
	{
		type: "select",
		id: "spaceScope",
		placeholder: "Space 범위",
		props: {
			options: [
				{ label: "현재 Space만", value: "CURRENT" },
				{ label: "상위 Space 포함", value: "INCLUDE_ANCESTORS" },
			],
		},
	},
];

type TasksQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetTasksQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function buildTaskRows(tasks: TaskDto[]) {
	return tasks.map((task) => ({
		id: task.id,
		name: task.exercise.name,
		duration: task.exercise.duration,
		count: task.exercise.count,
		description: task.exercise.description,
		createdAt: task.createdAt,
		task,
	}));
}

function getTaskParams(queryStates: TasksQueryStates) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}

const TasksPageContent = observer(function TasksPageContent({
	queryStates,
	setQueryStates,
	columns,
}: {
	queryStates: TasksQueryStates;
	setQueryStates: SetTasksQueryStates;
	columns: MetaDataGridColumnConfig<ReturnType<typeof buildTaskRows>[number]>[];
}) {
	const { data: response } = useGetTasksSuspense(getTaskParams(queryStates));
	const tasks = (response?.data ?? []) as TaskDto[];
	const rows = buildTaskRows(tasks);
	const totalCount = response?.meta?.total ?? rows.length;

	return (
		<MetaDataGrid
			config={{
				entity: "Task",
				data: rows,
				totalCount,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns,
				leftInputs,
				emptyMessage: "등록된 태스크가 없습니다.",
			}}
		/>
	);
});

function TasksPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="태스크 목록"
				description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

const TasksPageInner = observer(function TasksPageInner() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const state = useLocalObservable(() => ({
		deleteTarget: null as TaskDto | null,
	}));
	const deleteModal = useDisclosure();
	const deleteMutation = useDeleteTask();

	const onClickTaskName = (taskId: string) => {
		router.push(`/tasks/${taskId}/exercise` as Route);
	};

	const onClickDeleteButton = (task: TaskDto) => {
		state.deleteTarget = task;
		deleteModal.onOpen();
	};

	const onClickDeleteConfirm = () => {
		const target = state.deleteTarget;
		if (!target) {
			return;
		}

		deleteMutation.mutate(
			{ taskId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "태스크와 운동 detail이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					state.deleteTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetTasksQueryKey(),
					});
				},
				onError: (error) => {
					addToast({
						title: "삭제 실패",
						description:
							error.message ||
							"삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 태스크는 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const columns = buildTaskTableColumns<
		ReturnType<typeof buildTaskRows>[number]
	>({
		onClickTaskName,
		onClickDeleteButton,
	});

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="태스크 목록"
				description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
				actions={
					<Button
						as={Link}
						href={"/tasks/new" as Route}
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
					>
						태스크 등록
					</Button>
				}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Task",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns,
								leftInputs,
								emptyMessage: "등록된 태스크가 없습니다.",
							}}
						/>
					}
				>
					<TasksPageContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						columns={columns}
					/>
				</Suspense>
			</Surface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>태스크 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteTarget?.exercise.name}</strong> 운동 detail이
							포함된 태스크를 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							루틴에서 사용 중인 태스크는 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={deleteMutation.isPending}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={deleteMutation.isPending}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
});

export const AdminTasksPage = observer(function TasksPage() {
	return (
		<Suspense fallback={<TasksPageFallback />}>
			<TasksPageInner />
		</Suspense>
	);
});

export default AdminTasksPage;
