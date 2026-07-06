"use client";

import type { TimelineDto } from "@cocrepo/api/core/timelines";
import type {
	DataGridQueryStates,
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
export interface TimelineListScreenQueryStates extends DataGridQueryStates {
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
	onDeleteTimeline: (timelineId: string) => Promise<void>;
}
function TimelinesScreenFallback() {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="타임라인"
				description="학기/시즌 단위 타임라인을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
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
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const timelineRows = timelines ?? [];
		const onClickDeleteIcon = (timelineId: string) => {
			void onDeleteTimeline(timelineId);
		};
		const columns = buildTimelineTableColumns<TimelineDto>({
			onClickDeleteButton: onClickDeleteIcon,
		});
		if (isLoading) {
			return <TimelinesScreenFallback />;
		}
		return (
			<div className="space-y-5">
				<Screen.Header
					title="타임라인"
					description="학기/시즌 단위 타임라인을 관리합니다."
					actions={
						<Button
							color="primary"
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
							<DataGrid
								config={{
									entity: "Timeline",
									columns,
									leftInputs,
									emptyMessage: "등록된 타임라인이 없습니다.",
								}}
								rows={timelineRows}
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
