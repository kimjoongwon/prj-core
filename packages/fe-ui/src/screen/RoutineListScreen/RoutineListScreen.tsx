"use client";

import type { RoutineDto } from "@cocrepo/api/core/routines";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildRoutineTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Button } from "../../input/Button/Button";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "루틴명으로 검색...",
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
export const adminRoutinesPageQueryInputs = [...leftInputs];
export interface RoutineListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}
export type RoutineListScreenSetQueryStates = DataGridSetQueryStates;
export interface RoutineListScreenProps {
	routines: RoutineDto[];
	totalCount: number;
	queryStates: RoutineListScreenQueryStates;
	setQueryStates: RoutineListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onClickRoutineName: (routineId: bigint) => void;
	onDeleteRoutine: (routineId: bigint) => Promise<void>;
}
export const RoutineListScreen = observer(
	({
		routines,
		totalCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onClickRoutineName,
		onDeleteRoutine,
	}: RoutineListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<RoutineDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: routines,
						columns: buildRoutineTableColumns<RoutineDto>({
							onClickRoutineName,
							onClickDeleteButton: (routineId) => {
								void onDeleteRoutine(routineId);
							},
						}),
					},
				}),
			[
				routines,
				totalCount,
				queryStates,
				setQueryStates,
				onClickRoutineName,
				onDeleteRoutine,
			],
		);
		return (
			<VStack gap="page">
				<Screen.Header
					title="루틴"
					description="운동 루틴(커리큘럼)을 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							루틴 등록
						</Button>
					}
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
