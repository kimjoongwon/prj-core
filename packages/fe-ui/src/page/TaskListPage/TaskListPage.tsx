"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildTaskTableColumns,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "운동명으로 검색...",
		props: {
			placement: "column-header",
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

export const adminTasksPageQueryInputs = [...leftInputs];

export interface TaskListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type TaskListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface TaskListPageTask {
	id: string;
	name: string;
	isSchedulable: boolean;
	duration: number;
	count: number;
	description?: string;
	createdAt: string;
}

export interface TaskListPageProps {
	tasks: TaskListPageTask[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: TaskListPageQueryStates;
	setQueryStates: TaskListPageSetQueryStates;
	onClickCreateButton: () => void;
	onClickTaskName: (taskId: string) => void;
	onDeleteTask: (taskId: string) => Promise<void>;
}

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

export const TaskListPage = observer(({
	tasks,
	totalCount,
	isLoading,
	isDeleting,
	queryStates,
	setQueryStates,
	onClickCreateButton,
	onClickTaskName,
	onDeleteTask,
}: TaskListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const [deleteTarget, setDeleteTarget] = useState<TaskListPageTask | null>(
		null,
	);
	const deleteModal = useDisclosure();
	const onClickDeleteButton = (taskId: string) => {
		const targetTask = tasks.find((task) => task.id === taskId);
		if (!targetTask) {
			return;
		}
		setDeleteTarget(targetTask);
		deleteModal.onOpen();
	};
	const columns = buildTaskTableColumns<TaskListPageTask>({
		onClickTaskName,
		onClickDeleteButton,
	});

	if (isLoading) {
		return <TasksPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="태스크 목록"
				description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						태스크 등록
					</Button>
				}
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Task",
						columns,
						leftInputs,
						emptyMessage: "등록된 태스크가 없습니다.",
					}}
	rows={tasks}
	totalCount={totalCount}
	isLoading={false}
	state={gridState}
/>
			</Surface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>태스크 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{deleteTarget?.name}</strong> 운동 detail이 포함된
							태스크를 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							루틴에서 사용 중인 태스크는 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={() => {
								if (!deleteTarget) {
									return;
								}
								void onDeleteTask(deleteTarget.id).then(() => {
									deleteModal.onClose();
									setDeleteTarget(null);
								});
							}}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
});
