"use client";

import type { TaskDto } from "@cocrepo/api/core/tasks";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTaskTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	useT,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "../../input/Button/Button";

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
				{
					label: "현재 Space만",
					value: "CURRENT",
				},
				{
					label: "상위 Space 포함",
					value: "INCLUDE_ANCESTORS",
				},
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
	queryStates: TaskListScreenQueryStates;
	setQueryStates: TaskListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickTaskName: (taskId: string) => void;
	onDeleteTask: (taskId: string) => Promise<void>;
}
function TasksScreenFallback() {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="태스크 목록"
				description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface/70">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
}
export const TaskListScreen = observer(
	({
		tasks,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickTaskName,
		onDeleteTask,
	}: TaskListScreenProps) => {
		const t = useT();
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const taskRows = tasks ?? [];
		const onClickDeleteButton = (taskId: string) => {
			void onDeleteTask(taskId);
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
				<Screen.Header
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
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
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
						</Section.Body>
					</Section>
				</SectionSurface>
			</div>
		);
	},
);
