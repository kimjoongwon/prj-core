"use client";

import type { TimelineDto } from "@cocrepo/api/core/timelines";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTimelineTableColumns,
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
		placeholder: "타임라인 이름으로 검색...",
	},
];
export const adminTimelinesPageQueryInputs = [...leftInputs];
export interface TimelineListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
}
export type TimelineListScreenSetQueryStates = DataGridSetQueryStates;
export interface TimelineListScreenProps {
	timelines: TimelineDto[];
	totalCount: number;
	queryStates: TimelineListScreenQueryStates;
	setQueryStates: TimelineListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onDeleteTimeline: (timelineId: bigint) => Promise<void>;
}
export const TimelineListScreen = observer(
	({
		timelines,
		totalCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onDeleteTimeline,
	}: TimelineListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<TimelineDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: timelines,
						columns: buildTimelineTableColumns<TimelineDto>({
							onClickDeleteButton: (timelineId) => {
								void onDeleteTimeline(timelineId);
							},
						}),
					},
				}),
			[timelines, totalCount, queryStates, setQueryStates, onDeleteTimeline],
		);
		return (
			<VStack gap="page">
				<Screen.Header
					title="타임라인"
					description="학기/시즌 단위 타임라인을 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							타임라인 등록
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
