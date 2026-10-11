"use client";

import type { TimelineDto } from "@cocrepo/api/core/timelines";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildTimelineTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
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
	timelines?: TimelineDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: TimelineListScreenQueryStates;
	setQueryStates: TimelineListScreenSetQueryStates;
	onClickCreateButton: () => void;
	onDeleteTimeline: (timelineId: bigint) => Promise<void>;
}
function TimelinesScreenFallback() {
	return (
		<VStack gap="page">
			<Screen.Header
				title="타임라인"
				description="학기/시즌 단위 타임라인을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
}
export const TimelineListScreen = observer(
	({
		timelines,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
		onDeleteTimeline,
	}: TimelineListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					query: queryStates,
					setQueryStates,
					toolbar: { leftInputs },
					table: {
						entity: "Timeline",
						columns: buildTimelineTableColumns<TimelineDto>({
							onDeleteTimeline,
						}),
					},
					rows: timelines ?? [],
					totalCount,
				}),
		);
		useEffect(() => {
			gridState.query.update(queryStates);
			gridState.rows = timelines ?? [];
			gridState.pagination.setTotalCount(totalCount);
		}, [gridState, queryStates, timelines, totalCount]);
		const onClickDeleteIcon = (timelineId: bigint) => {
			void onDeleteTimeline(timelineId);
		};
		gridState.table.columns = buildTimelineTableColumns<TimelineDto>({
			onClickDeleteButton: onClickDeleteIcon,
		});
		if (isLoading) {
			return <TimelinesScreenFallback />;
		}
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
