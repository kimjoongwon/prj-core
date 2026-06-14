"use client";

import type { TaskDto } from "@cocrepo/api/core/tasks";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	SectionSurface,
	buildTaskTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	useT,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button } from "../../action/Button/Button";
import { Modal, useOverlayState } from "@heroui/react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "운동명으로 검색...",
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

export interface TaskListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type TaskListScreenSetQueryStates = DataGridSetQueryStates;

export interface TaskListScreenProps {
	tasks?: TaskDto[];
	totalCount: number;
	isLoading: boolean;
	isDeleting: boolean;
	queryStates: TaskListScreenQueryStates;
	setQueryStates: TaskListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickTaskName: (taskId: string) => void;
	onDeleteTask: (taskId: string) => Promise<void>;
}

function TasksScreenFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="태스크 목록"
				description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface/70">
				{null}
			</SectionSurface>
		</div>
	);
}

export const TaskListScreen = observer(
	({
		tasks,
		totalCount,
		isLoading,
		isDeleting,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickTaskName,
		onDeleteTask,
	}: TaskListScreenProps) => {
		const t = useT();
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const taskRows = tasks ?? [];
		const [deleteTarget, setDeleteTarget] = useState<TaskDto | null>(null);
		const deleteModal = useOverlayState();
		const onClickDeleteButton = (taskId: string) => {
			const targetTask = taskRows.find((task) => task.id === taskId);
			if (!targetTask) {
				return;
			}
			setDeleteTarget(targetTask);
			deleteModal.open();
		};
		const columns = buildTaskTableColumns<TaskDto>({
			onClickTaskName,
			onClickDeleteButton,
		});

		if (isLoading) {
			return <TasksScreenFallback />;
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
							{t("태스크 등록")}
						</Button>
					}
				/>
				<SectionSurface className="overflow-hidden rounded-2xl border-border/80 bg-surface/70">
					<DataGrid
						config={{
							entity: "Task",
							columns,
							leftInputs,
							emptyMessage: "등록된 태스크가 없습니다.",
						}}
						rows={taskRows}
						totalCount={totalCount}
						state={gridState}
					/>
				</SectionSurface>
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>{t("태스크 삭제")}</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{deleteTarget?.exercise.name}</strong>{" "}
										{t("운동 detail이 포함된 태스크를 삭제하시겠습니까?")}
									</p>
									<p className="mt-2 text-sm text-danger">
										{t("루틴에서 사용 중인 태스크는 삭제할 수 없습니다.")}
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={deleteModal.close}
										isDisabled={isDeleting}
									>
										{t("취소")}
									</Button>
									<Button
										color="danger"
										onPress={() => {
											if (!deleteTarget) {
												return;
											}
											void onDeleteTask(deleteTarget.id).then(() => {
												deleteModal.close();
												setDeleteTarget(null);
											});
										}}
									>
										{t("삭제")}
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			</div>
		);
	},
);
