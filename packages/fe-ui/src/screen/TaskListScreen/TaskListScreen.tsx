"use client";

import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTaskTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	type TaskTableRow,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

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
export interface TaskListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type TaskListScreenSetQueryStates = DataGridSetQueryStates;
export interface TaskListScreenProps {
	tasks: TaskTableRow[];
	totalCount: number;
	queryStates: TaskListScreenQueryStates;
	setQueryStates: TaskListScreenSetQueryStates;
	onClickTaskName: (taskId: string) => void;
	onDeleteTask: (taskId: string) => Promise<void>;
}
export const TaskListScreen = observer(
	({
		tasks,
		totalCount,
		queryStates,
		setQueryStates,
		onClickTaskName,
		onDeleteTask,
	}: TaskListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<TaskTableRow>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: tasks,
						columns: buildTaskTableColumns<TaskTableRow>({
							onClickTaskName,
							onClickDeleteButton: (taskId) => {
								void onDeleteTask(taskId);
							},
						}),
					},
				}),
			[
				tasks,
				totalCount,
				queryStates,
				setQueryStates,
				onClickTaskName,
				onDeleteTask,
			],
		);
		return (
			<VStack gap="page">
				<Screen.Header
					title="태스크 목록"
					description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid state={gridState} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
